const express = require('express');
const {ApolloServer} = require('apollo-server-express');

const {makeExecutableSchema} = require('@graphql-tools/schema');
const {loadFilesSync} = require('@graphql-tools/load-files');
const {createServer} = require("http");
const {Server} = require("socket.io");
const cookieSession = require("cookie-session");

const {socketIoConnection} = require("./socket");
const {connectMongoose} = require("./services/mongo");


const api = require("./api");
const fs = require("fs");
const passport = require("passport");
require('dotenv').config();

const config = {
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2,
}

const PORT = process.env.PORT || 8000;
const httpServer = createServer({
    cert: fs.readFileSync('cert.pem'),
    key: fs.readFileSync('key.pem'),
    passphrase: 'node-project'
}, api);

const socketServer = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:4200', 'http://localhost:8080', 'https://studio.apollographql.com'], // Adjust according to your Angular app's origin
        methods: ['GET', 'POST']
    }
});
const documentNameSpace = socketIoConnection(socketServer);

const typesArray = loadFilesSync('**/*', {
    extensions: ['graphql'],
});
const resolversArray = loadFilesSync('**/*', {
    extensions: ['resolver.js'],
});

async function startApolloServer(typeDefs, resolvers) {
    const schema = makeExecutableSchema({
        typeDefs: typesArray,
        resolvers: resolversArray
    });

    const server = new ApolloServer({
        schema,
        // if having cors set up in express we don't need to set it up here
    /*    cors: {
            origin: ['http://localhost:4200', 'http://localhost:8080', 'https://studio.apollographql.com'], // Adjust according to your Angular app's origin
            credentials: true,
        },*/
        context: ({req}) => {
            // Check for authentication token OR req user
            const token = req.headers.authorization || '';
            return {token, documentNameSpace, user: req.user};
        }
    });
    await server.start();
    server.applyMiddleware({app: api, path: '/graphql', cors: false}); // similar to old app.use('/graphql', graphqlHTTP({schema: schema, graphiql: true}));
}


const startServer = async () => {
    await connectMongoose();
    await startApolloServer();
    httpServer.listen(PORT, () => {   // 1
        console.log('GraphQL Server is running!', PORT);
    });
}

startServer()
