'use strict';

let request = require('request');
let getenv = require('getenv');

var options = {
    uri : 'https://api.kik.com/v1/config',
    method : 'GET',
    auth: {
        // 'user': 'example.bot',
        // 'pass': '8a11119c-dd54-4241-b2ce-81869881f42e',
        'user': getenv('KIK_USERNAME'),
        'pass': getenv('API_KEY'),
        'sendImmediately': false
    }
}
request(options, function(error, response, body){
    console.log('GET bot config callback', error, body);
});