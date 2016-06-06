//Entrance of tsd model: tcp server & websocket server 
//module.exports = function(port,server){

var stshttp = require('./lib');


stshttp({
	http:3001,
	tcp:9199
});
//};