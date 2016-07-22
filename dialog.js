var Botkit = require('botkit');
var builder = require('botbuilder');
var https = require('https');
var querystring = require('querystring');
var prompts = require('./prompts');

var model = process.env.LUIS_MODEL;
var recognizer = new builder.LuisRecognizer(model)
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });

module.exports = dialog
    .matches('LoadProfile', [
        confirmUsername, getProfile
    ])
    .matches('SearchProfile', [
        confirmQuery, searchProfiles, getProfile
    ])
    .onDefault([sendInstructions, redirectConversation]);

function confirmQuery(session, args, next) {
    session.dialogData.entities = args.entities;
    var query = builder.EntityRecognizer.findEntity(args.entities, 'query');

    if (query) {
        next({ response: query.entity });
    } else {
        builder.Prompts.text(session, 'Who are you searching for?');
    }
}

var options = [
    'Load profile',
    'Search profiles'
]

function sendInstructions(session, results, next) {
    builder.Prompts.choice(session, 'What information are you looking for?', options);
}

function redirectConversation(session, results, next) {
    session.beginDialog('/', { response: results.response.entity });
}

function searchProfiles(session, results, next) {
    var query = session.dialogData.query = results.response;
    if (!query) {
        session.endDialog('Request cancelled...');
    } else {
        executeSearch(query, function (profiles) {
            var totalCount = profiles.total_count;
            if (totalCount == 0) {
                session.endDialog('Sorry, no results found.');
            } else if (totalCount > 10) {
                session.endDialog('More than 10 results were found. Please provide a more restrictive query.');
            } else {
                session.dialogData.property = null;
                // var usernames = profiles.items.map(function (item) { return item.login });
                // builder.Prompts.choice(session, 'What user do you want to load?', usernames);

                var thumbnails = profiles.items.map(function(item) { return getProfileThumbnail(session, item)});
                var message = new builder.Message(session).attachments(thumbnails).attachmentLayout('carousel');
                session.send(message);
            }
        });
    }
}

function confirmUsername(session, args, next) {
    session.dialogData.entities = args.entities;

    var username = builder.EntityRecognizer.findEntity(args.entities, 'username');
    if (username) {
        next({ response: username.entity });
    } else if (session.dialogData.username) {
        next({ response: session.dialogData.username });
    } else {
        builder.Prompts.text(session, 'What is the username?');
    }
}

function getProfile(session, results, next) {
    var username = results.response;

    if (username.entity) username = session.dialogData.username = username.entity;
    else session.dialogData.user = username;

    if (!username) {
        session.endDialog('Request cancelled.');
    } else if (session.dialogData.profile && typeof (session.dialogData.profile.login) !== 'undefined' && session.dialogData.profile.login.toLowerCase() == username.toLowerCase()) {
        next();
    } else {
        loadProfile(username, function (profile) {
            if (profile && profile.message !== 'Not Found') {
                session.dialogData.profile = profile;

                var message = new builder.Message(session).attachments([getProfileThumbnail(session, profile)]);
                session.send(message);

                next();
            } else {
                session.endDialog('Sorry, couldn\'t find a profile with that name. You can do a search for a profile.');
            }
        });
    }
}

// -- helper functions

function getProfileThumbnail(session, profile) {
    var thumbnail = new builder.ThumbnailCard(session);
    thumbnail.title(profile.login);
    thumbnail.images([builder.CardImage.create(session, profile.avatar_url)]);

    if(profile.name) thumbnail.subtitle(profile.name);

    var text = '';
    if (profile.company) text += profile.company + '\n';
    if (profile.email) text += profile.email + '\n';
    if (profile.bio) text += profile.bio;
    thumbnail.text(text);

    thumbnail.tap(new builder.CardAction.openUrl(session, profile.html_url));
    return thumbnail;
}

function executeSearch(query, callback) {
    loadData('/search/users?q=' + querystring.escape(query), callback);
}

function loadProfile(username, callback) {
    loadData('/users/' + querystring.escape(username), callback);
}

function loadData(path, callback) {
    var options = {
        host: 'api.github.com',
        port: 443,
        path: path,
        method: 'GET',
        headers: {
            'User-Agent': 'sample-bot'
        }
    };
    var profile;
    var request = https.request(options, function (response) {
        var data = '';
        response.on('data', function (chunk) { data += chunk; });
        response.on('end', function () {
            callback(JSON.parse(data));
        });
    });
    request.end();
}

var properties = ['email', 'name', 'bio', 'location', 'company'];