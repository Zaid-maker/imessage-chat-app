import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { userIsConversationParticipant } from "../../util/functions";
import { GraphQLContext, SendMessageArguments } from "../../util/types";
import { conversationPopulated } from "./conversations";

const resolvers = {
  Query: {
    messages: async function (
      _: any,
      args: { conversationId: string },
      context: GraphQLContext
    ) {
      const { session, prisma } = context;
      const { conversationId } = args;

      /* Checking if the user is logged in. If not, it throws an error. */
      if (!session?.user) {
        throw new GraphQLError("Not Authorized");
      }

      /* Destructuring the session object and assigning the userId to the id property of the user
      object. */
      const {
        user: { id: userId },
      } = session;

      /* Finding a conversation by its id. */
      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        // include: conversationPopulated
      });

      /* Checking if the conversation exists. If it doesn't, it throws an error. */
      if (!conversation) {
        throw new GraphQLError("Conversation Not Found");
      }

      const allowedToView = userIsConversationParticipant(
        conversation.participants,
        userId
      );

      /* Checking if the user is allowed to view the conversation. If not, it throws an error. */
      if (!allowedToView) {
        throw new Error("Not authorized");
      }

      try {
        const message = await prisma.message.findMany({
          where: {
            conversationId,
          },
          include: messagePopulated,
          orderBy: {
            createdAt: "desc",
          },
        });

        return message;
      } catch (error: any) {
        console.log("messages error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    sendMessage: async function (
      _: any,
      args: SendMessageArguments,
      context: GraphQLContext
    ): Promise<boolean> {
      const { session, prisma, pubsub } = context;

      if (!session?.user) {
        throw new GraphQLError("Not Authorized");
      }

      const { id: userId } = session.user;
      const { id: messageId, senderId, conversationId, body } = args;

      try {
        /* Creating a new message. */
        const newMessage = await prisma.message.create({
          data: {
            id: messageId,
            senderId,
            conversationId,
            body,
          },
          include: messagePopulated,
        });

        /* Finding the participant of the conversation. */
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            userId,
            conversationId,
          },
        });

        /* Checking if the participant exists. If it doesn't, it throws an error. */
        if (!participant) {
          throw new GraphQLError("Participant does not exist");
        }

        const { id: participantId } = participant;

        const conversation = await prisma.conversation.update({
          where: {
            id: conversationId,
          },
          data: {
            latestMessageId: newMessage.id,
            participants: {
              update: {
                where: {
                  id: participantId,
                },
                data: {
                  hasSeenLatestMessage: true,
                },
              },
              updateMany: {
                where: {
                  NOT: {
                    userId,
                  },
                },
                data: {
                  hasSeenLatestMessage: false,
                },
              },
            },
          },
          include: conversationPopulated,
        });

        pubsub.publish("MESSAGE_SENT", { messageSent: newMessage });
        pubsub.publish("CONVERSATION_UPDATED", {
          conversationUpdated: {
            conversation,
          },
        });

        return true;
      } catch (error) {
        console.log("sendMessage error", error);
        throw new GraphQLError("Error sending message");
      }
    },
  },
};

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
    },
  },
});

export default resolvers;
