//var exec = require("child_process").exec;
var spawn = require('child_process').spawn;

function start(server,parms) {
  console.log("Request handler 'start' was called.");
	  var io = require('socket.io')(server);
  //var h = spawn('masscan', ['-p1-100', '202.108.33.0/24', '-oJ scan2.json']);
	  var cmdparms = ['-p'+ parms.games.ports];
		  cmdparms.push(parms.games.ipaddress);
		  cmdparms.push('--rate'+ parms.games.packages);
		  cmdparms.push('--sourceip'+ parms.games.sourceip);
		  cmdparms.push('-oJ scan2.json');
  console.log(cmdparms);
  var h = spawn('masscan', parms);
  
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