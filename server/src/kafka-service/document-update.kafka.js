const {kafkaClient, TOPIC_DOCUMENT_UPDATE} = require('./client.kafka');
const {Partitioners} = require('kafkajs')

const DocumentModel = require("../document/document.mongo");
const mongoose = require("mongoose");


const consumer = kafkaClient.consumer({groupId: "document-update-group"});
const producer = kafkaClient.producer({createPartitioner: Partitioners.LegacyPartitioner});
const SERVICE_NAME = "document-update-service";
const roomSpacesForSocketIo = {};


const messageQueue = [];
const MAX_BATCH_SIZE = 3; // Update after 3 messages
const UPDATE_INTERVAL = 5000; // Update every 5 seconds (optional)
let timerId = null; // Store the timer ID for potential cancellation

const sendEventToUpdateDocument = async ({updatedDoc, documentNameSpace}) => {
    const {id, content} = updatedDoc;

    roomSpacesForSocketIo[SERVICE_NAME] = documentNameSpace;
    await producer.send({
        topic: TOPIC_DOCUMENT_UPDATE,
        messages: [
            {
                value: JSON.stringify({
                    serviceName: SERVICE_NAME,
                    documentId: id,
                    content: content,
                    action: "update-document-content",
                }),
            },
        ],
    });
};

const processBatch = async (data) => {
    const {documentId, serviceName} = data;

    if (messageQueue.length === 0) return;

    const batch = messageQueue.splice(0, MAX_BATCH_SIZE);

    // Sort by message arrival time (assuming a timestamp exists) and limit to batch size
    const sortedBatch = batch.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, MAX_BATCH_SIZE);

    const latestContent = sortedBatch[0].content; // Assuming 'content' holds the latest update
    const historyUpdates = sortedBatch.slice(0, Math.min(sortedBatch.length, MAX_BATCH_SIZE)).map(message => {
        return {content: message.content}
    });

    updateDocument(documentId, latestContent, historyUpdates, serviceName);

};

const startDocumentUpdateConsumer = async () => {
    console.log('MongoDB connection state', mongoose.connection.readyState);
    if (mongoose.connection.readyState !== 1) {
        console.log('Waiting for MongoDB connection..., retrying in 5 seconds...', mongoose.connection.readyState);
        setTimeout(startDocumentUpdateConsumer, 5000); // Check again after 5 seconds
        return;
    }
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({topics: [TOPIC_DOCUMENT_UPDATE], fromBeginning: true});

    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            // message.value comes in buffer format, so we need to convert it to string
            const value = message.value.toString();
            const data = JSON.parse(value);
            messageQueue.push({...data, createdAt: Date.now(), updatedAt: Date.now()});
            if (messageQueue.length >= MAX_BATCH_SIZE) {
                clearTimeout(timerId); // Clear the timer if the queue fills up
                timerId = null; // Reset the timer ID
                await processBatch(data);
            } else if (UPDATE_INTERVAL && !timerId) { // Check for timer interval and running timer in case 3 messages never comes
                timerId = setTimeout(() => {
                    timerId = null; // Reset the timer ID
                    processBatch(data);
                }, UPDATE_INTERVAL);
            }
            console.log(`Topic; ${topic} , Partition: ${partition} Received message`);
        }
    });
}

const updateDocument = async (documentId, latestContent, historyUpdates, serviceName) => {
    //   const {documentId, content, action, serviceName} = data;
    console.log(`Data in consume`, latestContent, serviceName, historyUpdates);

    DocumentModel.findOneAndUpdate({_id: documentId},
        {
            $set: {content: latestContent},
            $push: {
                history: {
                    $each: historyUpdates, // Assuming historyUpdates is an array of the latest 3 updates
                    $slice: -5 // Keeps only the last 5 entries
                }
            }
        }, {new: true})
        .then((updatedDoc) => {
            if (serviceName === SERVICE_NAME && roomSpacesForSocketIo[SERVICE_NAME]) {
                const roomName = `document_${documentId}`; // TODO use below to also update front end that it is successful update
                roomSpacesForSocketIo[SERVICE_NAME].to(roomName).emit('documentUpdated', {documentId, content: latestContent});
                console.log('Document updated:');
            }
        }).catch((error) => {
        console.error('Error updating document:', error);
    });
}


module.exports = {sendEventToUpdateDocument, startDocumentUpdateConsumer};