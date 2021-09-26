import path from 'path';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import cookie from 'cookie';

import config from './config.js';
import { createClient, createProducer, createConsumer } from './pulsar.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

const pulsarClient = createClient(config.pulsar);
const rawPulsarProducer = await createProducer(pulsarClient, config.pulsar, config.pulsar.topics.raw);

app.use(morgan('combined'));
app.use(express.static('dist'));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.cookie('user', uuid());
    res.sendFile(path.resolve() + '/public/index.html');
});

app.post('/messages', async (req, res) => {
    const msg = await rawPulsarProducer.send({
        data: Buffer.from(JSON.stringify({
            message: req.body.message,
            user: req.cookies.user,
        })),
    }).catch((err) => {
        console.error(err);
        res.json({ message: err }).status(500);
    });

    console.log('Produced raw message:', { message: req.body.message, user: req.cookies.user });

    res.json({ message: msg.toString() });
});

io.on('connection', async (socket) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie);

    socket.join(cookies.user);
    
    console.log('User connected:', { user: cookies.user });

    const consumer = await createConsumer(pulsarClient, config.pulsar, config.pulsar.topics.analyzed, (msg, msgConsumer) => {
        const data = JSON.parse(msg.getData().toString());

        io.to(data.user).emit('message', data);
        msgConsumer.acknowledge(msg);

        console.log('Consumed analyzed message:', { data });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', { user: cookies.user });
        consumer.close();
    });
});

server.on('close', async () => {
    console.log('Closing app');

    await rawPulsarProducer.flush();
    await rawPulsarProducer.close();
    await pulsarClient.close();
});

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});