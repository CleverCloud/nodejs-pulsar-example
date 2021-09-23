const client = require('../src/client');

try {

    const ws = client(process.env.TOPIC, 'sub');

    ws.on('message', function(message) {
        const receiveMsg = JSON.parse(message);
        console.log('Received: %s - payload: %s', message, Buffer.from(receiveMsg.payload, 'base64').toString());
        
        const ackMsg = {"messageId" : receiveMsg.messageId};
        ws.send(JSON.stringify(ackMsg));
    });

    ws.on('open', function() {
        console.info('Opened !');
    })

    ws.on('close', function close() {
        console.info('disconnected');
    });

    ws.on('error', function (error) {
        throw error;
        process.exit(1);
    });

} catch (e) {
    console.error(e);
    process.exit(1);
}
