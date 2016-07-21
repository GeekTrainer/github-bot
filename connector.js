var builder = require('botbuilder');
var restify = require('restify');
var dialog = require('./dialog');
var prompts = require('./prompts');

module.exports = {
    start: function () {
        var server = restify.createServer();
        server.listen(process.env.port || process.env.PORT || 3978, function() {
            console.log('listening');
        });

        var connector = new builder.ChatConnector({
            appId: process.env.MICROSOFT_APP_ID,
            appPassword: process.env.MICROSOFT_APP_PASSWORD
        });
        var bot = new builder.UniversalBot(connector);
        server.post('/api/messages', connector.listen());
        bot.dialog('/', dialog);


        // var bot = new builder.BotConnectorBot({ appId: 'id', appSecret: 'secret' });
        // bot.add('/', dialog);

        // bot.configure({
        //     userWelcomeMessage: prompts.userWelcomeMessage 
        // });

        // var server = restify.createServer();
        // server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
        // server.listen(process.env.port || 3978, function () {
        //     console.log('listening');
        // });
        // return bot;
    }
}
