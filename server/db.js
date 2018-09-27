const loki = require('lokijs')

const db = new loki('apollo-slack')

const Users = db.addCollection('users')
const Messages = db.addCollection('messages')
const Channels = db.addCollection('channels')

const userData = [
  {
    id: 1,
    name: 'Alice',
    address: 'Waterford'
  },
  {
    id: 2,
    name: 'Bill',
    address: 'Dublin'
  }
]

const channelData = [
  {
    id: 1,
    name: 'javascript'
  },
  {
    id: 2,
    name: 'graphql'
  }
]

const createdAt = Date.now()

const messageData = [
  {
    id: 1,
    channelId: 1,
    text: `javascript is fun!`,
    userId: 1,
    createdAt
  },
  {
    id: 2,
    channelId: 1,
    text: 'GraphQL is awesome',
    userId: 2,
    createdAt
  },
  {
    id: 3,
    channelId: 2,
    text: 'I hope it makes some sense',
    userId: 2,
    createdAt
  }
]

Users.insert(userData)
Channels.insert(channelData)
Messages.insert(messageData)

console.log(Users.find())
console.log(Channels.find())
console.log(Messages.find())

module.exports = {
  Messages,
  Channels,
  Users,
  fixIdFor: (obj) => {
    obj.id = obj.$loki
  }
}
