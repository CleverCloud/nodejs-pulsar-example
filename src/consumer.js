const client = require('./client')

const ws = client(process.env.TOPIC);

ws.on('message', function(message) {
    const receiveMsg = JSON.parse(message);
    console.log('Received: %s - payload: %s', message, Buffer.from(receiveMsg.payload, 'base64').toString());
    
    const ackMsg = {"messageId" : receiveMsg.messageId};
    ws.send(JSON.stringify(ackMsg));
});