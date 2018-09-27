const express = require('express')
const http = require('http')
const cors = require('cors')
const path = require('path')

const { ApolloServer } = require('apollo-server-express')

// import our executable schema
const schema = require('./schema')

// create an Apollo Server instance and pass in our schema
const apolloServer = new ApolloServer({ schema })

// boilerplate express setup
const app = express()
app.use('*', cors())

app.use('/', express.static(path.join(__dirname, '../build')))
app.use('*', express.static(path.join(__dirname, '../build/index.html')))

// A special method that will apply the graphql engine to our express server
// by default this will give us a /graphql endpoint
apolloServer.applyMiddleware({ app })

const server = http.createServer(app)
apolloServer.installSubscriptionHandlers(server)

server.listen(7700, '0.0.0.0', () => {
  console.log(`Playground can be accessed on http://localhost:7700/graphql`)
})
