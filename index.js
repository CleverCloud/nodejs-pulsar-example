const express = require('express');
const http = require('http');
const Pulsar = require('pulsar-client');
const morgan = require('morgan');
const { Server } = require('socket.io');
const fetch = require('node-fetch');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

const pulsarClient = new Pulsar.Client({
    serviceUrl: process.env.ADDON_PULSAR_BINARY_URL,
    authentication: new Pulsar.AuthenticationToken({ token: process.env.ADDON_PULSAR_TOKEN }),
});

const pulsar = {
    namespace: process.env.ADDON_PULSAR_NAMESPACE,
    tenant: process.env.ADDON_PULSAR_TENANT,
    topics: {
        raw: process.env.PULSAR_TOPIC_RAW,
        analyzed: process.env.PULSAR_TOPIC_ANALYZED,
    },
};

/**
 * @returns {Promise<Pulsar.Producer>}
 */
function createProducer(topic) {
    return pulsarClient.createProducer({
        topic: `persistent://${pulsar.namespace}/${pulsar.tenant}/${topic}`,
    });
}

/**
 * @returns {Promise<Pulsar.Consumer>}
 */
function createConsumer(topic, listener) {
    return pulsarClient.subscribe({
        topic: `persistent://${pulsar.namespace}/${pulsar.tenant}/${topic}`,
        subscription: 'socket-io',
        subscriptionType: 'Shared',
        ackTimeoutMs: 10000,
        listener,
    });
}

function getSentimentAnalysis(text, model = 'distilbert-base-uncased-finetuned-sst-2-english') {
    return fetch(process.env.ANALYSIS_API + `?text=${encodeURIComponent(text)}&model=${model}`, {
        method: 'POST',
    });
}

async function analyseMessages(rawTopic, analyzedTopic) {
    const analyzedProducer = await createProducer(analyzedTopic);

    await createConsumer(rawTopic, async (msg, msgConsumer) => {
        const message = msg.getData().toString();

        console.log('Consume raw message:', { message });

        const response = await getSentimentAnalysis(message).catch((err) => {
            console.error({ err });
            return ;
        });

        const data = await response.json();

        console.log('Analyzed raw message:', { data });

        await analyzedProducer.send({
            data: Buffer.from(JSON.stringify({ message, data })),
        }).catch((err) => {
            console.error({ err });
            return ;
        });

        console.log('Produced analyzed message.');

        msgConsumer.acknowledge(msg);
    });
}

/**
 * @type {Pulsar.Producer}
 */
let rawPulsarProducer = null;

createProducer(pulsar.topics.raw).then((producer) => {
    rawPulsarProducer = producer;
});

app.use(morgan('combined'));
app.use(express.static('dist'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/messages', async (req, res) => {
    const msg = await rawPulsarProducer.send({
        data: Buffer.from(req.body.message),
    }).catch((err) => {
        console.error(err);
        res.json({ message: err }).status(500);
    });

    console.log('Produced raw message:', { message: req.body.message });

    res.json({ message: msg.toString() });
});

io.on('connection', async (socket) => {
    console.log('user connected');

    const consumer = await createConsumer(pulsar.topics.analyzed, (msg, msgConsumer) => {
        const data = msg.getData().toString();
        io.emit('message', data);
        msgConsumer.acknowledge(msg);

        console.log('Consumed analyzed message:', { data });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        consumer.close();
    });
});

server.on('close', async () => {
    console.log('Closing app');

    await pulsarProducer.flush();
    await pulsarProducer.close();
    await pulsarClient.close();
});

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);

    analyseMessages(pulsar.topics.raw, pulsar.topics.analyzed);
});