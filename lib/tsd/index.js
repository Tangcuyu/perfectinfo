module.exports = function(){

var stshttp = require('./lib');
var net = require('net');

stshttp({
  http: 8081,
  tcp: 9199
});
};