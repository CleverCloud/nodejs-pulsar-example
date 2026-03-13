# Node.js + Apache Pulsar + Sentiment Analysis Example Application on Clever Cloud
[![Clever Cloud - PaaS](https://img.shields.io/badge/Clever%20Cloud-PaaS-orange)](https://clever-cloud.com)

This is a simple Node.js application that demonstrates how to use Apache Pulsar for message processing with sentiment analysis, and deploy it to Clever Cloud.

## About the Application

This application displays a form where you can send a message. It assesses the mood of your message and tells if it's positive or negative. It uses:

- **Apache Pulsar** for message queuing between the server and worker
- **Socket.IO** for real-time communication with the client
- **VADER** for sentiment analysis (local, no external API needed)

### How It Works

1. The client sends a message to the Express server
2. The server publishes the message onto an Apache Pulsar topic
3. A worker consumes the message, runs sentiment analysis, and publishes the result to another topic
4. The server reads the result and pushes it to the client via WebSocket

### Endpoints

- `GET /` - Renders the main page with the message form
- `POST /messages` - Submit a message for sentiment analysis

## Technology Stack

- [Express.js 5](https://expressjs.com/) - Web framework for Node.js
- [Socket.IO 4](https://socket.io/) - Real-time bidirectional communication
- [pulsar-client](https://pulsar.apache.org/docs/en/client-libraries-node/) - Apache Pulsar client for Node.js
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- [vader-sentiment](https://github.com/vaderSentiment/vaderSentiment-js) - VADER sentiment analysis
- [esbuild](https://esbuild.github.io/) - JavaScript bundler
- Node.js 24+

## Prerequisites

- Node.js 24+
- npm

## Running the Application Locally

```bash
npm install
npm run build
```

Set the required environment variables (duplicate `.env.example` and fill the `ADDON_PULSAR_` variables):

```bash
cp .env.example .env
```

You can either deploy a standalone Pulsar locally with Docker or use the Clever Cloud Pulsar add-on.

Start the server and worker:

```bash
npm start

# In another terminal
npm run worker
```

The application will be accessible at http://localhost:3000.

## Deploying on Clever Cloud

You have two options to deploy your application on Clever Cloud: using the Web Console or using the Clever Tools CLI.

### Option 1: Deploy using the Web Console

#### 1. Create an account on Clever Cloud

If you don't already have an account, go to the [Clever Cloud console](https://console.clever-cloud.com/) and follow the registration instructions.

#### 2. Set up your application on Clever Cloud

1. Log in to the [Clever Cloud console](https://console.clever-cloud.com/)
2. Click on "Create" and select "An application"
3. Choose "Node.js" as the runtime environment
4. Configure your application settings (name, region, etc.)

#### 3. Add a Pulsar Add-on

1. In your application's dashboard, go to "Service dependencies"
2. Click "Link add-ons" and select "Pulsar"
3. Choose the plan that fits your needs
4. Link the add-on to your application

The `ADDON_PULSAR_*` environment variables will be automatically set.

#### 4. Deploy Your Application

You can deploy your application using Git:

```bash
# Add Clever Cloud as a remote repository
git remote add clever git+ssh://git@push-par-clevercloud-customers.services.clever-cloud.com/app_<your-app-id>.git

# Push your code to deploy
git push clever master
```

### Option 2: Deploy using Clever Tools CLI

#### 1. Install Clever Tools

Install the Clever Tools CLI following the [official documentation](https://www.clever-cloud.com/doc/clever-tools/getting_started/):

```bash
# Using npm
npm install -g clever-tools

# Or using Homebrew (macOS)
brew install clever-tools
```

#### 2. Log in to your Clever Cloud account

```bash
clever login
```

#### 3. Create a new application

```bash
# Initialize the current directory as a Clever Cloud application
clever create --type node <YOUR_APP_NAME>

# Add a Pulsar add-on
clever addon create addon-pulsar <YOUR_ADDON_NAME> --link <YOUR_APP_NAME>
```

#### 4. Set environment variables

```bash
cat .env.prod.example | clever env import
```

#### 5. Deploy your application

```bash
clever deploy
```

#### 6. Open your application in a browser

Once deployed, you can access your application at the URL provided by Clever Cloud.

```bash
clever open
```

### Monitoring Your Application

Once deployed, you can monitor your application through:

- **Web Console**: The Clever Cloud console provides logs, metrics, and other tools to help you manage your application.
- **CLI**: Use `clever logs` to view application logs and `clever status` to check the status of your application.

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Apache Pulsar Documentation](https://pulsar.apache.org/docs/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Clever Cloud Node.js Documentation](https://www.clever-cloud.com/developers/doc/applications/nodejs/)
- [Clever Cloud Pulsar Add-on Documentation](https://www.clever-cloud.com/doc/deploy/addon/pulsar/)
- [Clever Cloud Documentation](https://www.clever-cloud.com/doc/)
