var restify = require('restify');
var builder = require('botbuilder');
var cognitiveService = require('botbuilder-cognitiveservices');

// Setup Restify Server
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Chat Connector to Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '',//process.env.MICROSOFT_APP_ID,
    appPassword: ''// process.env.MICROSOFT_APP_PASSWORD
});

// Endpoint to deal with user messages
server.post('/api/messages', connector.listen());

// Get user message and return 'Você disse'
var bot = new builder.UniversalBot(connector, (session) => {
     session.send("Você disse: %s", session.message.text);
});

