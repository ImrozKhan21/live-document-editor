const {kafkaClient, TOPIC_DOCUMENT_UPDATE, TOPIC_SHARE_DOCUMENT} = require('./client.kafka');
async function connectKafka() {
    const admin = kafkaClient.admin();
    console.log('Admin connecting...');
    await admin.connect();
    console.log('Admin connection success');

    console.log('Creating topic [document-updates]...');

    await admin.createTopics({
        topics: [
            { topic: TOPIC_DOCUMENT_UPDATE, numPartitions: 2 },
            { topic: TOPIC_SHARE_DOCUMENT, numPartitions: 2 },
        ]
    });
    console.log('Topic [document-updates] created successfully');

    console.log('Admin disconnecting...');

    await admin.disconnect();
}

connectKafka();