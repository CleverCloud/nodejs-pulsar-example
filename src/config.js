import 'dotenv/config';

export default {
    pulsar: {
        url: process.env.ADDON_PULSAR_BINARY_URL,
        token: process.env.ADDON_PULSAR_TOKEN,
        namespace: process.env.ADDON_PULSAR_NAMESPACE,
        tenant: process.env.ADDON_PULSAR_TENANT,
        topics: {
            raw: process.env.PULSAR_TOPIC_RAW,
            analyzed: process.env.PULSAR_TOPIC_ANALYZED,
        },
    },
};
