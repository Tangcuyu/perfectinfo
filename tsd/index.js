//直接抛出原代码段
module.exports=function(app){
var stshttp = require('./lib');
var net = require('net');

stshttp({
 http: 8082,
  tcp: 9099
},app);

}