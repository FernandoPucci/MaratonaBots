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
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Endpoint to deal with user messages
server.post('/api/messages', connector.listen());

// Create UIniversal bot
var bot = new builder.UniversalBot(connector);

// set memory storage
bot.set('storage', new builder.MemoryBotStorage());

// get recognizer - recognize user call
var qnaMakerRecognizer = new cognitiveService.QnAMakerRecognizer({
    knowledgeBaseId: process.env.KNOWLEDGE_BASEID,
    subscriptionKey: process.env.SUBSCRIPTION_KEY,
    top: 3 // option if nothing to find
});

// simple tools to elements
var qnaMakerTools = new cognitiveService.QnAMakerTools();

bot.library(qnaMakerTools.createLibrary());

// create default dialog 
var qnaMakerDialog = new cognitiveService.QnAMakerDialog({
    recognizers: [qnaMakerRecognizer],
    defaultMessage: 'Ops... Não encontrei nada sobre isto... Pode me explicar melhor?',
    qnaThreshold: 0.5, // response reliability level
    feedbackLib: qnaMakerTools
});



bot.dialog('/', qnaMakerDialog); 