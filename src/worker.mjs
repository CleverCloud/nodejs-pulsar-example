import fetch from 'node-fetch';
import config from './config.js';
import { createClient, createProducer, createConsumer } from './pulsar.js';

/**
 * @param {Object} config
 * @param {String} text
 * @returns {Promise<any>}
 */
function getSentimentAnalysis(config, text) {
    return fetch(config.api + `?text=${encodeURIComponent(text)}&model=${config.model}`, {
        method: 'POST',
    });
}

console.log('Running analysis worker');

const pulsarClient = createClient(config.pulsar);

const analyzedProducer = await createProducer(pulsarClient, config.pulsar, config.pulsar.topics.analyzed);

await createConsumer(pulsarClient, config.pulsar, config.pulsar.topics.raw, async (msg, msgConsumer) => {
    const { message, user } = JSON.parse(msg.getData().toString());

    console.log('Consume raw message:', { message, user });

    const response = await getSentimentAnalysis(config.analysis, message).catch((err) => {
        console.error({ err });
        return ;
    });

    const data = await response.json();

    console.log('Analyzed raw message:', { data });

    await analyzedProducer.send({
        data: Buffer.from(JSON.stringify({ message, user, sentiment: data })),
    }).catch((err) => {
        console.error({ err });
        return ;
    });

    console.log('Produced analyzed message.');

    msgConsumer.acknowledge(msg);
});