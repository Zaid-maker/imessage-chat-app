import { User } from "@prisma/client";
import { GraphQLError } from "graphql";
import { verifyAndCreateUsername } from "../../util/functions";
import { CreateUsernameResponse, GraphQLContext } from "../../util/types";

const resolvers = {
  Query: {
    searchUsers: () => {},
  },
  Mutation: {
    createUsername: async function createUsername(
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> {
      const { session, prisma } = context;

      /* Checking if the user is logged in. If not, it returns an error. */
      if (!session?.user) {
        return {
          error: "Not Authorized, Make sure you are logged in!",
        };
      }

      const { id } = session.user;
      const { username } = args;

      return await verifyAndCreateUsername({ userId: id, username }, prisma);
    },
  },
};

export default resolvers;
