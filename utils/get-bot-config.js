'use strict';

let request = require('request');

var options = {
    uri : 'https://api.kik.com/v1/config',
    method : 'GET',
    auth: {
        'user': 'example.bot',
        'pass': '8a11119c-dd54-4241-b2ce-81869881f42e',
        'sendImmediately': false
    }
}
request(options, function(error, response, body){
    console.log('GET bot config callback', error, body);
});