require('dotenv').config();

function getWebsocketPulsarUrl() {
    const hostname = process.env.ADDON_PULSAR_HOSTNAME;
    const port = process.env.ADDON_PULSAR_HTTP_PORT;
    const tenant = process.env.ADDON_PULSAR_TENANT;
    const namespace = process.env.ADDON_PULSAR_NAMESPACE;

    return `wss://${hostname}:${port}/ws/v2/producer/persistent/${tenant}/${namespace}`;
}

module.exports.getWebsocketPulsarUrlWithTopic = function (topic) {
    return getWebsocketPulsarUrl() + `/${topic}`;
}