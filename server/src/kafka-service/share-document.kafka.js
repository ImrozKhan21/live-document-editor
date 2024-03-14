const {kafkaClient, TOPIC_SHARE_DOCUMENT} = require('./client.kafka');
const {Partitioners} = require('kafkajs')

const DocumentModel = require("../document/document.mongo");
const mongoose = require("mongoose");
const {sendEmailToShareDoc} = require("../services/sendgrid-email");


const consumer = kafkaClient.consumer({groupId: "share-document-group"});
const producer = kafkaClient.producer({createPartitioner: Partitioners.LegacyPartitioner});
const SERVICE_NAME = "share-document-service";
const roomSpacesForSocketIo = {};


const messageQueue = [];

const sendEventToShareDocumentEmail = async ({id, ownerEmails, documentNameSpace}) => {
    roomSpacesForSocketIo[SERVICE_NAME] = documentNameSpace;
    await producer.send({
        topic: TOPIC_SHARE_DOCUMENT,
        messages: [
            {
                value: JSON.stringify({
                    serviceName: SERVICE_NAME,
                    documentId: id,
                    emails: ownerEmails,
                    action: "share-document",
                }),
            },
        ],
    });
};

const startDocumentShareConsumer = async () => {
    if (mongoose.connection.readyState !== 1) {
        console.log('Waiting for MongoDB connection..., retrying in 5 seconds...', mongoose.connection.readyState);
        setTimeout(startDocumentShareConsumer, 5000); // Check again after 5 seconds
        return;
    }
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({topics: [TOPIC_SHARE_DOCUMENT], fromBeginning: true});

    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            // message.value comes in buffer format, so we need to convert it to string
            const value = message.value.toString();
            const data = JSON.parse(value);
            shareDocument(data.documentId, data.emails, data.serviceName);
            console.log(`Topic; ${topic} , Partition: ${partition} Received message`);
        }
    });
}

const shareDocument = async (documentId, emails, serviceName) => {
    //   const {documentId, content, action, serviceName} = data;
    try {
        const currentDocumentDetails = await DocumentModel.findById(documentId, {'__v': 0}, {lean: true});
        const newEmails = emails.filter(email => !currentDocumentDetails?.sharedWith?.includes(email));
        const uniqueEmails = [...new Set(newEmails)];

        if (uniqueEmails.length > 0) {
            await DocumentModel.findOneAndUpdate(
                {_id: documentId}, // use the document's ID
                {$addToSet: {sharedWith: {$each: uniqueEmails}}},
                {new: true}
            );
            uniqueEmails.forEach(email => {
                sendEmailToShareDoc(email);
            });
        }
    } catch (error) {
        console.error('Error sharing document:', error);
        throw error; // Rethrow or handle error appropriately
    }
}


module.exports = {sendEventToShareDocumentEmail, startDocumentShareConsumer};