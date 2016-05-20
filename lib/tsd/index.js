module.exports = function(port,server){

var stshttp = require('./lib');
var net = require('net');

stshttp(port,server);
};