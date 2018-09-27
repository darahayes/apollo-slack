## Apollo Slack

This is a very basic Slack application I hacked together for an introductory talk on GraphQL.
The application consists of a GraphQL backend built with [Apollo Server](), a React frontend and an in memory database.

Full disclaimer: I am not a frontend developer so while the finished product looks somewhat decent, the code is an absolute mess :) The talk was much more focused on API design.

The server code, found under `server` is very straightforward and should help you get started with GraphQL and Node.js

## Setup

There are two steps to running the application locally.

1. Build the frontend
2. Start the server

Here's how you get started.

#### Install frontend dependencies

```
npm install
```

#### Build the React frontend.

```
npm run build
```

The resulting build is located in the `build` folder.

#### Install the Server Dependencies

```
cd server && npm install
```

#### Start the Server

```
cd ../ && npm run start
```

The server has the GraphQL API and it also serves the frontend from the `build` folder.


#### Run the Frontend in Development Mode

If you want to hack on the frontend app without rebuilding every time, you can run the app in a live reload mode.

```
npm run start:dev
```

You should still keep the API running in the background for the frontend to talk to the API.

#### License

MIT