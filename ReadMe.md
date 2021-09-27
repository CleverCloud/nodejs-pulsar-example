# Devoxx Paris 2021 Demo

> This repository demonstrates the usage of Apache Pulsar with a dead simple Node.js application.

This demo displays a form where you can send a message, it will assess the mood of your message and tell if it's a negative or positive message.

How it works:

- The client sends a request to the server with a message.
- The server pushes the message onto an Apache Pulsar topic.
- The worker analyzes the message and sends the result into another Apache Pulsar topic.
- The server reads the result from the analyzed topic and sends them to the client via WebSocket.

## Documentation

- [How to deploy a standalone Pulsar with Docker](https://pulsar.apache.org/docs/en/standalone-docker/)
- [Getting started with the Clever Cloud CLI](https://www.clever-cloud.com/doc/getting-started/cli/)
- [Clever Cloud Pulsar Add-on documentation](https://www.clever-cloud.com/doc/deploy/addon/pulsar/)
- [How to deploy a Node.js application on Clever Cloud](https://www.clever-cloud.com/doc/deploy/application/javascript/by-framework/nodejs/)


## Requirements

You will need those dependencies to run it locally.

- Node.js 14.17
- Apache Pulsar C++ client 2.8.1
- clever-tools (Clever Cloud CLI)

Note: The Apache Pulsar C++ client is already available on Clever Cloud Node.js applications.

## Usage

Clone the repository and install its dependencies:

```bash
git clone https://github.com/CleverCloud/devoxx-paris-2021-demo.git && cd devoxx-paris-2021-demo

npm install
```

Build the frontend assets:

```bash
npm run build
```

Duplicate the `.env.example` file and fill the empty `ADDON_PULSAR_` variables:

```bash
cp .env.example .env
```

You can either deploy a standalone Pulsar locally with Docker or use Pulsar add-on.

Start the server & worker:

```bash
npm start

# In another terminal 
npm run worker 
```

## Deployment

To deploy the demo, we need to create a Pulsar add-on and a Node.js application.

Create the Node.js application:

```bash
clever create --type node demo-devoxx
```

Create the Pulsar add-on and link it to the Node.js application:

```bash
clever addon create addon-pulsar demo-devoxx --link demo-devoxx
```

Import the production environnment example:

```bash
cat .env.prod.example | clever env import
```

You can now link the application and deploy the repository:

```bash
clever link demo-devoxx
clever deploy
```

To open your application in a browser, simply run `clever open`.

Et voilà!