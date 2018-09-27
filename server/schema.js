const { makeExecutableSchema } = require('graphql-tools')

const { PubSub, withFilter } = require('graphql-subscriptions')
const pubsub = new PubSub()

const db = require('./db')

// This is our Schema Definition
const typeDefs = `

  scalar Date

  type Channel {
    id: Int!                # "!" denotes a required field
    name: String
    messages: [Message]!
  }

  type Message {
    id: Int!
    text: String!
    sender: User!
    createdAt: Date!
  }

  type User {
    id: Int!
    name: String!
    address: String!
    messages: [Message]!
  }

  # This type specifies the entry points into our API. 
  type Query {
    channels: [Channel]    # "[]" means this is a list of channels
    channel(id: Int!): Channel
    user(id: Int!): User
  }

  # The mutation root type, used to define all mutations.
  type Mutation {
    # A mutation to add a new channel to the list of channels
    addChannel(name: String!): Channel
    addMessage(text: String! channelId: Int! userId: Int!): Message
    addUser(name: String! address: String): User
  }

  type Subscription {
    messageAdded: Message
    messageAddedToChannel(channelId: Int!): Message
    channelAdded: Channel
  }

`
// The resolvers are the actual implementation of our API
// think of a resolver like a http handler
const resolvers = {
  Query: {
    channels: (root, args, context, info) => {
      return db.Channels.find()
    },
    channel: (root, args, context, info) => {
      const { id } = args
      return db.Channels.get(id)
    },
    user: (root, args, context, info) => {
      const { id } = args
      return db.Users.get(id)
    }
  },
  Mutation: {
    addChannel: (root, args, context, info) => {
      const { name } = args
      const newChannel = db.Channels.insert({ name })
      db.fixIdFor(newChannel)
      pubsub.publish('channelAdded', { channelAdded: newChannel })
      return newChannel
    },
    addMessage: (root, args, context, info) => {
      const { text, channelId, userId } = args
      const newMessage = db.Messages.insert({ text, channelId, userId, createdAt: Date.now() })
      db.fixIdFor(newMessage)
      pubsub.publish('messageAdded', { messageAdded: newMessage, messageAddedToChannel: newMessage })
      return newMessage
    },
    addUser: (root, args, context, info) => {
      const { name, address } = args
      const newUser = db.Users.insert({ name, address })
      db.fixIdFor(newUser)
      return newUser
    }
  },
  Channel: {
    messages: (root, args, context, info) => {
      const channelId = root.id
      return db.Messages.find({ channelId: channelId })
    }
  },
  Message: {
    sender: (root, args, context, info) => {
      const userId = root.userId
      const user = db.Users.get(userId)
      return user
    }
  },
  Subscription: {
    channelAdded: {
      subscribe: () => {
        return pubsub.asyncIterator('channelAdded')
      }
    },
    messageAdded: {
      subscribe: () => {
        return pubsub.asyncIterator('messageAdded')
      }
    },
    messageAddedToChannel: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('messageAdded'),
        (payload, variables) => {
          return payload.messageAddedToChannel.channelId == variables.channelId
        }
      )
    }
  }
}

// Take the schema definition + resolvers and turn it into an executable engine
const schema = makeExecutableSchema({ typeDefs, resolvers })

module.exports = schema
