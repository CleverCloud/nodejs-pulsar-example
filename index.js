const express = require('express');
const http = require('http');
const morgan = require('morgan');
const { Server } = require('socket.io');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

app.use(morgan('combined'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'public/index.html');
});

io.on('connection', function (socket) {
    console.log('user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

server.listen(port, function () {
    console.log(`App listening at http://localhost:${port}`)
});