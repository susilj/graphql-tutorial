import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `
  type Channel {
     id: ID!                # "!" denotes a required field
     name: String
     messages: [Message]!
     # messages will be returned in a MessageFeed object wrapper
     messageFeed(cursor: String): MessageFeed  
  }

  input MessageInput{
     channelId: ID!
     text: String
  }

  type Message {
    id: ID!
    text: String
    createdAt: Int
  }

  type MessageFeed {
    # cursor specifies the place in the list where we left off
    cursor: String!
    
    # this is a chunk of messages to be returned
    messages: [Message]!
  }
  
  # This type specifies the entry points into our API. In this case
  # there is only one - "channels" - which returns a list of channels.
  type Query {
     channels: [Channel]    # "[]" means this is a list of channels
     channel(id: ID!): Channel
  }

  # The mutation root type, used to define all mutations.
  type Mutation {
    # A mutation to add a new channel to the list of channels
    addChannel(name: String!): Channel
    addMessage(message: MessageInput!): Message
  }

  type Subscription {
    messageAdded(channelId: ID!): Message
  }
`;

// const schema = makeExecutableSchema({ typeDefs });

// addMockFunctionsToSchema({ schema });

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };