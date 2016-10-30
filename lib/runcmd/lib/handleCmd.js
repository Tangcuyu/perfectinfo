//var exec = require("child_process").exec;
var spawn = require('child_process').spawn;

function start(keystone,locals) {
  console.log("Request handler 'start' was called.");
	  var io = require('socket.io')(keystone.httpserver);
  //var h = spawn('masscan', ['-p1-100', '202.108.33.0/24', '-oJ scan2.json']);
	  var parms = '-p'+ locals.data.ports
				  +','+ locals.data.ipaddress
				  +','+ '--rate'+ locals.data.packages
				  +','+ '--sourceip'+ locals.data.sourceip
				  +','+ '-oJ'
				  +','+ './scan2.json';
  //var h = spawn('masscan', parms);
  console.log(parms);
	  io.on('connection', function(socket) {
		  
			function send(value) {
					  var response = JSON.stringify({value : value });
					  socket.volatile.emit('send data',response);
					}
			
			h.stdout.on('data', function (err,s) {
				console.log(s.toString());
				if (!err) send(s);
			  });

			h.stderr.on('data', function (s) {
				console.log(s.toString());
				send(s);
			  });
			 

			h.stdout.on('end', function (s) {
				console.log('masscan end');
			  });
				
			h.on('close',function(code,signal){
				console.log('child process exited with code:' + code + signal);

			  });		
		  });

/*


  exec("masscan --help", function (error, stdout, stderr) {
    if (error) {console.log(error);};
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write(stdout);
    res.end();
  });*/
}


exports.start = start;