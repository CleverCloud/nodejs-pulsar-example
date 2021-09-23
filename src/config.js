require('dotenv').config();

function getWebsocketPulsarUrl(role = 'consumer') {
    const hostname = process.env.ADDON_PULSAR_HOSTNAME;
    const port = process.env.ADDON_PULSAR_HTTP_PORT;
    const tenant = process.env.ADDON_PULSAR_TENANT;
    const namespace = process.env.ADDON_PULSAR_NAMESPACE;

    return `wss://${hostname}:${port}/ws/v2/${role}/persistent/${tenant}/${namespace}`;
}

module.exports.getProducerWebsocketPulsarUrlWithTopic = function (topic) {
    return getWebsocketPulsarUrl('producer') + `/${topic}`;
}

module.exports.getConsumerWebsocketPulsarUrlWithTopic = function (topic, subscription) {
    return getWebsocketPulsarUrl() + `/${topic}/${subscription}`;
}