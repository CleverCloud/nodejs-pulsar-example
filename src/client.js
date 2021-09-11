const WebSocket = require('ws');

const { getWebsocketPulsarUrlWithTopic } = require('./config');

module.exports = (topic) => new WebSocket(getWebsocketPulsarUrlWithTopic(topic), {
    headers: {
        Authorization: `Bearer ${process.env.ADDON_PULSAR_TOKEN}`,
    },
});