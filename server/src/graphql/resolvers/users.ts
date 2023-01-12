import { User } from "@prisma/client";
import { GraphQLError } from "graphql";
import { CreateUsernameResponse, GraphQLContext } from "../../util/types";
import { verifyAndCreateUsername } from "../../util/functions";

const resolvers = {
  Query: {
    searchUsers: async function searchUsers(
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<Array<User>> {
      const { username: searchedUsername } = args;
      const { prisma, session } = context;

      if (!session?.user) {
        throw new GraphQLError("you are not Authorized");
      }

      const {
        user: { username: myUsername },
      } = session;

      try {
        const users = await prisma.user.findMany({
          where: {
            username: {
              contains: searchedUsername,
              not: myUsername,
              mode: "insensitive",
            },
          },
        });

        return users;
      } catch (error: any) {
        console.log("Error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    createUsername: async function createUsername(
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> {
      const { session, prisma } = context;

      if (!session?.user) {
        return {
          error: "Not authorized",
        };
      }

      const { id } = session.user;
      const { username } = args;

      return await verifyAndCreateUsername({ userId: id, username }, prisma);
    },
  },
};

export default resolvers;
