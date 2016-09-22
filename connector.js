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
            // appId: process.env.MICROSOFT_APP_ID,
            // appPassword: process.env.MICROSOFT_APP_PASSWORD
        });

        var bot = new builder.UniversalBot(connector);

        server.use(restify.queryParser());

        server.post('/api/messages', connector.listen());

        server.get('/oauth', (req, res, next) => {
            // console.log(req.query.code);
            res.send(200, 'Paste this code into the bot: ' + req.query.code);
        });

        bot.dialog('/', dialog);
    }
}
