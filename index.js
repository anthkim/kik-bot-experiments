'use strict';

let express = require('express');
let util = require('util');
let http = require('http');
let Bot  = require('@kikinteractive/kik');

var app = express();

// Configure the bot API endpoint, details for your bot
let bot = new Bot({
    username: 'example.bot',
    apiKey: '8a11119c-dd54-4241-b2ce-81869881f42e',
    baseUrl: 'kik-echobot.ngrok.io'
});

bot.onTextMessage((message) => {
    console.log('hello got a message', message);
    message.reply('Hello! You sent me the message: "' + message.body + '"');
});

app.get('/', function(req, res){
	res.send('Hello');
});

app.use(bot.incoming());

app.listen(process.env.PORT || 8080, function(){
	console.log('Server started on port ' + (process.env.PORT || 8080));
});