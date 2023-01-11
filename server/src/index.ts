import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import express from "express";
import { PubSub } from "graphql-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import { GraphQLContext, SubscriptionContext } from "./util/types";

const main = async () => {
  dotenv.config();

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const app = express();
  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql/subscriptions",
  });

  const prisma = new PrismaClient();
  const pubsub = new PubSub();

  const getSubscriptionContext = async (
    ctx: SubscriptionContext
  ): Promise<GraphQLContext> => {
    ctx;
    if (ctx.connectionParams && ctx.connectionParams.session) {
      const { session } = ctx.connectionParams;
      return { session, prisma, pubsub };
    }

    return { session: null, prisma, pubsub };
  };

  const serverCleanup = useServer(
    {
      schema,
      context: (ctx: SubscriptionContext) => {
        return getSubscriptionContext(ctx);
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  const PORT = 4000 || process.env.PORT;

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );

  console.log(`Server is now running on http://localhost:${PORT}/graphql`);
};

main().catch((err) => console.log(err));
