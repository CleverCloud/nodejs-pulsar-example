const io = require('socket.io-client');

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

const socket = io({
    auth: {
        user: getCookie('user'),
    },
});

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

socket.on('message', (payload) => {
    const item = document.createElement('li');
    item.textContent = payload.message + payload.data;
    result.appendChild(item);
});

socket.onAny((event, ...args) => {
    console.log({ event, args });
});