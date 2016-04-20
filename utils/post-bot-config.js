'use strict';

let request = require('request');
let getenv = require('getenv');

var options = {
    uri : 'https://api.kik.com/v1/config',
    method : 'POST',
    auth: {
        // my bot name here
        'user': getenv('KIK_USERNAME'),
        'pass': getenv('KIK_APIKEY'),
        'sendImmediately': false
    },
    json: {
        // AWS url here
        'webhook': getenv('KIK_WEBHOOK'),
        'features': {
            'manuallySendReadReceipts': false,
            'receiveReadReceipts': false,
            'receiveDeliveryReceipts': false,
            'receiveIsTyping': false
        }            
    }
}
request(options, function(error, response, body){
    console.log('POST bot config callback', error, body);
});