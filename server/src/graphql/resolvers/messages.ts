import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { userIsConversationParticipant } from "../../util/functions";
import { GraphQLContext } from "../../util/types";

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
