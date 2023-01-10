import gql from "graphql-tag";

const typeDefs = gql`
  type Conversation {
    id: String
    latestMessage: Message
    participants: [participant]
    updatedAt: Date
  }

  type Participant {
    id: String
    user: User
    hasSeenLatestMessage: Boolean
  }
`;

export default typeDefs;
