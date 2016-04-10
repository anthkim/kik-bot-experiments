'use strict';

let request = require('request');

var options = {
    uri : 'https://api.kik.com/v1/config',
    method : 'POST',
    auth: {
        // my bot name here
        'user': 'example.bot',
        'pass': '8a11119c-dd54-4241-b2ce-81869881f42e',
        'sendImmediately': false
    },
    json: {
        // AWS url here
        'webhook': 'http://kikbotexperiments.tpeamtxtui.us-west-2.elasticbeanstalk.com/incoming',
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