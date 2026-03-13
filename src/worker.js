import vader from 'vader-sentiment';
import config from './config.js';
import { createClient, createProducer, createConsumer } from './pulsar.js';

/**
 * @param {String} text
 * @returns {{ label: string, score: number }}
 */
function getSentimentAnalysis(text) {
    const scores = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    const label = scores.compound >= 0.05 ? 'POSITIVE'
        : scores.compound <= -0.05 ? 'NEGATIVE'
        : 'NEUTRAL';
    return { label, score: scores.compound };
}


console.log('[Worker] -Running analysis worker');

const pulsarClient = createClient(config.pulsar);

console.log('[Worker] - Pulsar client created');

const analyzedProducer = await createProducer(pulsarClient, config.pulsar, config.pulsar.topics.analyzed);

console.log('[Worker] - Analyzed producer created');

await createConsumer(pulsarClient, config.pulsar, config.pulsar.topics.raw, async (msg, msgConsumer) => {
    const { message, user } = JSON.parse(msg.getData().toString());

    console.log('[Worker] - Consume raw message:', { message, user });

    const sentiment = getSentimentAnalysis(message);

    console.log('[Worker] - Analyzed raw message:', { sentiment });

    const payload = JSON.stringify({ message, user, sentiment: JSON.stringify(sentiment) });
    console.log('[Worker] - Sending analyzed message:', payload);

    await Promise.race([
        analyzedProducer.send({ data: Buffer.from(payload) }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Send timed out after 10s')), 10000)),
    ]).catch((err) => {
        console.error('[Worker] - Send error:', err);
    });

    console.log('[Worker] - Produced analyzed message.');

    msgConsumer.acknowledge(msg);
});
