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

app.get('/', function (req, res) {
    res.send('Hello Devoxx Paris 2021!');
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

server.listen(port, function () {
    console.log(`App listening at http://localhost:${port}`)
});