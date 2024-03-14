const mongoose = require('mongoose');
const {startDocumentUpdateConsumer} = require("../kafka-service/document-update.kafka");
const {startDocumentShareConsumer} = require("../kafka-service/share-document.kafka");

require('dotenv').config(); // mostly for test case this one


const MONGO_URL = process.env["MONGO_URL"];


mongoose.connection.once('open', () => {
    console.log('MongoDb connection ready');
});

mongoose.connection.on('error', (err) => {
    console.log('error', err);
});


async function connectMongoose() {
    try {
        await mongoose.connect(MONGO_URL);
        // Start the KAFKA consumer after the connection is established
        startDocumentUpdateConsumer();
        startDocumentShareConsumer();
        console.log('MongoDB connected');
    } catch (e) {
        console.log(e);
    }
}

async function disconnectMongoose() {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
}

module.exports = {
    connectMongoose,
    disconnectMongoose
}