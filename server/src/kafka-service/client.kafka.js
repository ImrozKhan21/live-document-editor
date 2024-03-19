const {Kafka} = require("kafkajs");


const CLIENT_ID = "documents-editor";
const BROKERS_URL = ["kafka:9092"];

const TOPIC_DOCUMENT_UPDATE = "update-document-topic";
const TOPIC_NEW_DOCUMENT = "new-document-topic";
const TOPIC_SHARE_DOCUMENT = "share-document-topic";

const kafkaClient = new Kafka({ clientId: CLIENT_ID, brokers: BROKERS_URL });

module.exports = {kafkaClient, TOPIC_DOCUMENT_UPDATE, TOPIC_NEW_DOCUMENT, TOPIC_SHARE_DOCUMENT}