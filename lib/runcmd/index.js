var WebSocketServer = require('ws').Server;

module.exports = function(server, req, res){

var wss = new WebSocketServer({ 
      server: server
    });
var stshttp = require('./lib/handleCmd');

stshttp.start(wss, req, res);

};