var builder = require('botbuilder');
var restify = require('restify');
var dialog = require('./dialog');
var prompts = require('./prompts');

module.exports = {
    start: function () {
        var bot = new builder.BotConnectorBot({ appId: 'id', appSecret: 'secret' });
        bot.add('/', dialog);

        bot.configure({
            userWelcomeMessage: prompts.userWelcomeMessage 
        });

        var server = restify.createServer();
        server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
        server.listen(process.env.port || 3978, function () {
            console.log('listening');
        });
        return bot;
    }
}
