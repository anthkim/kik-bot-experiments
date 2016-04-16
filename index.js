'use strict';

let express = require('express');
let util = require('util');
let http = require('http');
let Bot  = require('@kikinteractive/kik');
let request = require('request');
let getenv = require('getenv');

var app = express();

// Configure the bot API endpoint, details for your bot
let bot = new Bot({
    username: 'example.bot',
    apiKey: '8a11119c-dd54-4241-b2ce-81869881f42e',
    baseUrl: 'kik-echobot.ngrok.io'
});

function processMessage(message, callback){
	// console.log(message);

	if(message.indexOf('symbol$') == 0){
		var ticker = message.slice('symbol$ '.length);
		var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=' + ticker;
		request(url, function(error, response, body){
			var info = JSON.parse(body);
			callback(null, info);
		});

	} 
	else {
		var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=' + message;

		request(url, function(error, response, body){
			var info = JSON.parse(body);
			callback(null, body);
		});
	}
}



bot.onTextMessage((message) => {
    // console.log('hello got a message', message);
    // message.reply('Hello! You sent me the message: "' + message.body + '"');
    processMessage(message.body, function(err, response){
    	message.reply(response);
    });

});


app.get('/', function(req, res){
	processMessage(req.query.message, function(error, response){
		console.log(response);
	});
});

// app.get('/', function(req, res){
// 	res.send('Hello');
// });

app.use(bot.incoming());

app.listen(process.env.PORT || 8080, function(){
	console.log('Server started on port ' + (process.env.PORT || 8080));
});