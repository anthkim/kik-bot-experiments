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

// function processMessage(message, callback){
// 	// console.log(message);

// 	if(message.indexOf('symbol$') == 0){
// 		var ticker = message.slice('symbol$ '.length);
// 		var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=' + ticker;
// 		request(url, function(error, response, body){
// 			var info = JSON.parse(body);
// 			// callback(null, info);
// 		});

// 	} 
// 	else {
// 		var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=' + message;

// 		request(url, function(error, response, body){
// 			var info = JSON.parse(body);
// 			// callback(null, body);
// 			// response.
// 			console.log(response);
// 		});
// 	}
// }



function getCompany(message, callback){
	// callback(null, 'this worked');
	var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=' + message;

	request(url, function(error, response, body){
		var json = JSON.parse(body);
		var arrayOfStrings = json.map(function(item){
			return item.Name + ' (' + item.Exchange + ':' + item.Symbol + ')';
		});



		callback(null, arrayOfStrings);
	});
}



bot.onTextMessage((message) => {
	if(message.indexOf('$$$') == 0){

	}
	else{
		getCompany(message.body, function(err, response){
			console.log(response);
			message.addResponseKeyboard(response);
		});

	}
})


app.get('/', function(req, res){
	if(req.query.message.indexOf('$$$') == 0){
		console.log('quote something');
	} 
	else{
		// console.log('lookup something');
		getCompany(req.query.message, function(err, response){
			console.log(response);
			res.send(response);
		});
	}

});

// app.get('/', function(req, res){
// 	res.send('Hello');
// });

app.use(bot.incoming());

app.listen(process.env.PORT || 8080, function(){
	console.log('Server started on port ' + (process.env.PORT || 8080));
});