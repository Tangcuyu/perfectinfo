//var exec = require("child_process").exec;
var spawn = require('child_process').spawn;


function start(view,locals,req,res,httpserver) {
  console.log("Request handler 'start' was called.");
  var io = require('socket.io')(httpserver);

  //var h = spawn('masscan', ['-p1-100', '202.108.33.0/24', '-oJ scan2.json']);
  var h = spawn('masscan', ['-p80', '202.108.33.0/24',  '-oJ', './scan2.json']);
  
  io.on('connection', function(socket) {
	  
		function send(value) {
				  var response = JSON.stringify({value : value });
				  socket.volatile.emit('send data',response);
				}
		
		h.stdout.on('data', function (s) {
			console.log(s.toString());
			//res.writeHead(200, {"Content-Type": "text/plain"});
			//res.write(s.toString());
			//locals.data.iplogs = s.toString();
			//console.log(locals.data.iplogs);
			//view.render('runcmd', locals);
			send(s);
		  });

		h.stderr.on('data', function (s) {
			console.log(s.toString());
			send(s);
		  });
		 

		h.stdout.on('end', function (s) {
			console.log('masscan end');
		  });
			
				
      });

  h.on('close',function(code,signal){
  	console.log('child process exited with code:' + code + signal);

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