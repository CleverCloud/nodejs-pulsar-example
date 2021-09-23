const client = require('../src/client');

try {
    const ws = client(process.env.TOPIC);

    var message = {
        "payload" : Buffer.from("Hello World").toString('base64'),
        "properties": {
            "key1" : "value1",
            "key2" : "value2"
        },
        "context" : "1"
    };
      
    ws.on('open', function () {
        // Send one message
        ws.send(JSON.stringify(message));
    });
      
    ws.on('message', function (message) {
        console.log('received ack: %s', message);
    });

    ws.on('error', function (error) {
        console.error(error);
        process.exit(1);
    });

} catch (e) {
    console.error(e);
    process.exit(1);
}