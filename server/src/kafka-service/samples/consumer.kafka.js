const {kafkaClient} = require('../client.kafka');

async function createConsumer() {
    const consumer = kafkaClient.consumer({groupId: 'group1-document-updates'});
    console.log('Consumer connecting...');
    await consumer.connect();
    console.log('Consumer connection success');

    await consumer.subscribe({topic: 'document-updates', fromBeginning: true});

    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            console.log(`Topic; ${topic} , Partition: ${partition} Received message`, {
                value: message.value.toString(),
            });
        },
    });
}

createConsumer();