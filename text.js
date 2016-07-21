var builder = require('botbuilder');
var dialog = require('./dialog');

module.exports = {
    start: function() {
        // var bot = new builder.TextBot();
        // bot.add('/', dialog);
        // bot.listenStdin();
        // return bot;

        var connector = new builder.ConsoleConnector().listen();
        var bot = new builder.UniversalBot(connector);
        bot.dialog('/', dialog);
    }
}