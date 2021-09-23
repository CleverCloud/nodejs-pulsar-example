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
    topic: process.env.TOPIC,
}

async function getProducer(topic) {
    return await pulsarClient.createProducer({
        topic: `persistent://${pulsar.namespace}/${pulsar.tenant}/${topic}`,
    });
}

const producer = getProducer(process.env.TOPIC);

app.use(morgan('combined'));
app.use(express.static('dist'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('messages', function (req, res) {
    console.log(req.body);
    producer.send({
        data: Buffer.from(req.body.message),
    });
});

io.on('connection', function (socket) {
    console.log('user connected');

    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

server.listen(port, function () {
    console.log(`App listening at http://localhost:${port}`)
});