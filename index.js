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
    username: getenv('KIK_USERNAME'),
	apiKey: getenv('KIK_APIKEY'),
    baseUrl: 'kik-echobot.ngrok.io'
});

// let suggestions = {
// 	'initialResponseSuggestions' : [
// 		"show me stocks",
// 		"show me companies"
// 	]
// }

function getCompany(message, callback){
	// var company = message.slice('search '.length);
	var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=' + message;

	request(url, function(error, response, body){
		var json = JSON.parse(body);
		var arrayOfStrings = json.map(function(item){
			// return item.Name + ' (' + item.Exchange + ':' + item.Symbol + ')';
			return item.Name + ' (Ticker:' + item.Symbol + ')';
		});
		var arrayOfStringToOneString = arrayOfStrings.join(', ');
		callback(null, 'Did you mean one of these companies? ' + arrayOfStringToOneString);
		// how do i add response keyboard????
	});
}

function getQuote(message, callback){
	// var ticker = message.slice('quote '.length);
	var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=' + message;
	
	request(url, function(error, response, body){
		var json = JSON.parse(body);
		// callback(null,json);
		callback(null, json.Name + ' stock\'s last price on ' + json.Timestamp + ' was $' + json.LastPrice + ', ' + json.ChangePercent + '% change from the previous day and ' + json.ChangePercentYTD + '% since the start of the year.');
		// callback(null, info);
	});
}

function promptMe(message, callback){
	callback(null, 'Hi! You can type \'quote [TICKER]\' and I can get  you the latest price on the stock. Or you can type \'search [COMPANY]\' and I\'ll find the ticker for you! Later I will be smarter.');
}

function processMessage(message, callback) {
	console.log('processMessage ' + message);
	if(message.toLowerCase().indexOf('quote') === 0) {
		var ticker = message.slice('quote '.length);
		getQuote(ticker, function(err, response){
			console.log(response);
			// message.reply(response);
			callback(null, response);
		});
	} else if(message.toLowerCase().indexOf('search') === 0) {
		var company = message.slice('search '.length);
		getCompany(company, function(err, response){
			console.log(response);
			// message.reply(response
			callback(null, response);
		});
	} else {
		promptMe(message.body, function(err, response){
			console.log(response);
			// message.reply(response);
			callback(null, response);
		});
	}
}


bot.onTextMessage((message) => {
	processMessage(message.body, function(error, response){
		message.addResponseKeyboard([
			"show me stocks",
			"show me companies"
		]);
		message.reply(response);
	});
});


app.get('/', function(req, res){
	if(req.query.message.toLowerCase().indexOf('quote') === 0){
		var ticker = req.query.message.slice('quote '.length);
		getQuote(ticker, function(err, response){
			console.log(response);
			res.send(response);
		});	
	} else if(req.query.message.toLowerCase().indexOf('search') === 0){
		// console.log('lookup something');
		var company = req.query.message.slice('search '.length);
		getCompany(company, function(err, response){
			console.log(response);
			res.send(response);
		});
	} else{
		res.send('cannot help');
	}
	// processMessage(req.query.message, function(error, response){
	// 	res.send(response);
	// })

});

// app.get('/', function(req, res){
// 	res.send('Hello');
// });

app.use(bot.incoming());

app.listen(process.env.PORT || 8080, function(){
	console.log('Server started on port ' + (process.env.PORT || 8080));
});