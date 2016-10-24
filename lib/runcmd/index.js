
module.exports = function(view,locals,req,res,server){

var handleCmd = require('./lib');
handleCmd(view,locals,req,res,server);

};