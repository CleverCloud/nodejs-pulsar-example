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

const emojis = {
    'POSITIVE': 0x1F642,
    'NEGATIVE': 0x1F641,
};

const shrugEmoji = 0x1F937;

const form = document.getElementById('form');
const message = document.getElementById('message');
const messageConfirmation = document.getElementById('message-confirmation');
const result = document.getElementById('result');
const loading = document.getElementById('loading');

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
            loading.classList.remove('hidden');
            setTimeout(() => {
                messageConfirmation.classList.add('hidden');
            }, 3000);

            setTimeout(() => {
                loading.classList.add('hidden');
            }, 20000);
        })
    }
});

function newResultItem(message, { label, score }) {
    const item = document.createElement('li');
    item.classList.value = 'py-4';

    const text = document.createElement('p');
    text.classList.value = 'text-sm text-gray-500';

    const emoji = String.fromCodePoint(emojis[label] || shrugEmoji);
    text.textContent = `${message} - ${emoji} (${label})`;

    item.appendChild(text);

    return item;
}

socket.on('message', (payload) => {
    loading.classList.add('hidden');
    const { message, sentiment } = JSON.parse(payload);
    const item = newResultItem(message, JSON.parse(sentiment));
    result.appendChild(item);
});

socket.onAny((event, ...args) => {
    console.log({ event, args });
});