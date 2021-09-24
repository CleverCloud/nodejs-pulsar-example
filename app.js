const io = require('socket.io-client');

const socket = io();

const form = document.getElementById('form');
const message = document.getElementById('message');
const result = document.getElementById('result');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (message.value) {

        const headers = new Headers({
            'Content-Type': 'application/json',
        });

        fetch('/messages', {
            headers,
            method: 'POST',
            body: JSON.stringify({
                message: message.value,
            }),
        });
    }
});

socket.on('message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    result.appendChild(item);
});