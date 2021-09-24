const express = require('express');
const http = require('http');
const Pulsar = require('pulsar-client');
const morgan = require('morgan');
const { Server } = require('socket.io');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

const pulsarClient = new Pulsar.Client({
    serviceUrl: process.env.ADDON_PULSAR_BINARY_URL,
    authentication: new Pulsar.AuthenticationToken({ token: process.env.ADDON_PULSAR_TOKEN })
});

const pulsar = {
    namespace: process.env.ADDON_PULSAR_NAMESPACE,
    tenant: process.env.ADDON_PULSAR_TENANT,
    topic: process.env.PULSAR_TOPIC,
}

/**
 * @returns {Promise<Pulsar.Producer>}
 */
function createProducer() {
    return pulsarClient.createProducer({
        topic: `persistent://${pulsar.namespace}/${pulsar.tenant}/${pulsar.topic}`,
    });
}

/**
 * @returns {Promise<Pulsar.Consumer>}
 */
function createConsumer(listener) {
    return pulsarClient.subscribe({
        topic: `persistent://${pulsar.namespace}/${pulsar.tenant}/${pulsar.topic}`,
        subscription: 'socket-io',
        subscriptionType: 'Shared',
        ackTimeoutMs: 10000,
        listener,
    });
}

/**
 * @type {Pulsar.Producer}
 */
let pulsarProducer = null;

createProducer().then((producer) => {
    pulsarProducer = producer;
});

console.log({ pulsarProducer });

app.use(morgan('combined'));
app.use(express.static('dist'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/messages', async (req, res) => {
    const msg = await pulsarProducer.send({
        data: Buffer.from(req.body.message),
    }).catch((err) => {
        console.error(err);
        res.json({ message: err }).status(500);
    });

    res.json({ message: msg.toString() });
});

io.on('connection', async (socket) => {
    console.log('user connected');

    const consumer = await createConsumer((msg, msgConsumer) => {
        const data = msg.getData().toString();
        io.emit('message', data);
        msgConsumer.acknowledge(msg);
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
    console.log(`App listening at http://localhost:${port}`)
});