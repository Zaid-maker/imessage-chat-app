import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { getSession } from "next-auth/react";

/* Creating a new GraphQLWsLink object. */
const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: "ws://localhost:4000/graphql/subscriptions",
          connectionParams: async () => ({
            session: getSession,
          }),
        })
      )
    : null;

/* Creating a new HttpLink object. */
const httpLink = new HttpLink({
  uri: `http://localhost:4000/graphql`,
  credentials: "include",
});

/* Checking if the window object is defined and if the wsLink object is not null. If both are true, it
will return the split function. If not, it will return the httpLink object. */
const link =
  typeof window !== "undefined" && wsLink != null
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

/* Exporting the ApolloClient object. */
export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
