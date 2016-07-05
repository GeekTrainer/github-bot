var builder = require('botbuilder');
var dialog = require('./dialog');

module.exports = {
    start: function() {
        var bot = new builder.TextBot();
        bot.add('/', dialog);
        bot.listenStdin();
        return bot;
    }
}