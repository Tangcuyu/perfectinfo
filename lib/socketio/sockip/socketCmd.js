var spawn = require('child_process').spawn;

function start(socket, cmdparms) {
	
		function send(key) {
          var response = JSON.stringify({ key : key});
          socket.emit('run', response, function(err){
            if(err) console.log(err);
          });
		  response = null;
        };

        //var h = spawn('ping', ['-c', Number(10) ,'www.baidu.com']);
        var h = spawn('masscan', ['-p80', '202.108.33.0/24',  '-oJ', './scan2.json']);


        h.stdout.on('data', function (s) {	
				send(s.toString());     		   
        });

        h.stderr.on('data', function (s) {   
            send(s.toString());
        });
       

        h.stdout.on('end', function (s) {
          console.log('command end');  
        });

        h.on('close',function(code,signal){
          console.log('child process exited with code:' + code +'signal'+ signal);

        });

}

exports.start = start;