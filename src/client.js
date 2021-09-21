const WebSocket = require('ws');

const { 
    getProducerWebsocketPulsarUrlWithTopic, 
    getConsumerWebsocketPulsarUrlWithTopic 
} = require('./config');

module.exports = (topic, subscription = null) => {
    let url = getProducerWebsocketPulsarUrlWithTopic(topic)
    if (subscription) {
        url = getConsumerWebsocketPulsarUrlWithTopic(topic, subscription)
    }

    const ws = new WebSocket(url, {
        headers: {
            Authorization: `Bearer ${process.env.ADDON_PULSAR_TOKEN}`,
        },
    });

    return ws
};