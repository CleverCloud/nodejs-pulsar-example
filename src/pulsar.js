const { Client, AuthenticationToken } = require('pulsar-client');

/**
 * @returns {Pulsar.Client}
 */
module.exports.createClient = function (config) {
    return new Client({
        serviceUrl: config.url,
        authentication: new AuthenticationToken({ token: config.token }),
    });
}

/**
 * @returns {Promise<Pulsar.Producer>}
 */
module.exports.createProducer = function (client, config, topic) {
    return client.createProducer({
        topic: `persistent://${config.tenant}/${config.namespace}/${topic}`,
    });
}

/**
 * @returns {Promise<Pulsar.Consumer>}
 */
module.exports.createConsumer = function (client, config, topic, listener) {
    return client.subscribe({
        topic: `persistent://${config.tenant}/${config.namespace}/${topic}`,
        subscription: 'socket-io',
        subscriptionType: 'Shared',
        ackTimeoutMs: 10000,
        listener,
    });
}