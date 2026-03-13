import Pulsar from 'pulsar-client';

const { Client, AuthenticationToken } = Pulsar;

/**
 * @returns {Pulsar.Client}
 */
export function createClient(config) {
    return new Client({
        serviceUrl: config.url,
        authentication: new AuthenticationToken({ token: config.token }),
    });
}

/**
 * @returns {Promise<Pulsar.Producer>}
 */
export function createProducer(client, config, topic) {
    return client.createProducer({
        topic: `persistent://${config.tenant}/${config.namespace}/${topic}`,
    });
}

/**
 * @returns {Promise<Pulsar.Consumer>}
 */
export function createConsumer(client, config, topic, listener) {
    return client.subscribe({
        topic: `persistent://${config.tenant}/${config.namespace}/${topic}`,
        subscription: 'socket-io',
        subscriptionType: 'Shared',
        ackTimeoutMs: 10000,
        listener,
    });
}
