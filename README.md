## GitHub Bot

A sample bot that will retrieve user information from GitHub. Connects with Slack, REST calls via Restify, and text/console.

### Setup

Prerequisites

1. A LUIS model trained
2. A Slack account you can add a bot to

Install components

```
npm install
```

Create environmental values

1. Add a new file named `.env`.
2. Add the following values:
```
SLACK_TOKEN=***YOUR-SLACK-BOT-TOKEN***
LUIS_MODEL=***YOUR-LUIS-MODEL-URL***
```