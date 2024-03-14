const {kafkaClient} = require('../client.kafka');

async function createProducer() {
    const producer = kafkaClient.producer();
    console.log('Producer connecting...');
    await producer.connect();
    console.log('Producer connection success');

    await producer.send({
        topic: 'document-updates',
        messages: [
            {
                partition: 0,
                key: "document-updates",
                value: JSON.stringify({document_id: 'document_id', content: 'content'})
            },

        ],
    });
    await producer.disconnect();
}

createProducer();