var Botkit = require('botkit');
var builder = require('botbuilder');
var dialog = require('./dialog');

module.exports = {
  start: function () {
    var controller = Botkit.slackbot();
    var bot = controller.spawn({
      token: process.env.SLACK_TOKEN
    });

    var slackBot = new builder.SlackBot(controller, bot);
    slackBot.add('/', dialog);

    slackBot.listenForMentions();

    bot.startRTM(function (err, bot, payload) {
      if (err) {
        throw new Error('Could not connect to Slack');
      }
    });
    return bot;
  }
}