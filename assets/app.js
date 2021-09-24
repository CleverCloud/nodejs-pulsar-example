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
const messageConfirmation = document.getElementById('message-confirmation');
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
        }).then(() => {
            form.reset();
            messageConfirmation.classList.remove('hidden');
            setTimeout(() => {
                messageConfirmation.classList.add('hidden');
            }, 3000);
        })
    }
});

function newResultItem(msg) {
    const item = document.createElement('li');
    item.classList.value = 'py-4';

    const text = document.createElement('p');
    text.classList.value = 'text-sm text-gray-500';
    text.textContent = msg;

    item.appendChild(text);

    return item;
}

socket.on('message', (payload) => {
    const item = newResultItem(payload.message + payload.data);
    result.appendChild(item);
});

socket.onAny((event, ...args) => {
    console.log({ event, args });
});