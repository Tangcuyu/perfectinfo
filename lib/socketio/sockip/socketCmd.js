var spawn = require('child_process').spawn;
var rs = require('./resultStore');

function start(socket, cmdparms) {
	
		function send(key) {
          var response = JSON.stringify({ key : key});
          socket.emit('run', response, function(err){
            if(err) console.log(err);
          });
		  response = null;
        };
		
		var parmRun = [];
		parmRun.push('-p'+cmdparms.ports);
		parmRun.push(cmdparms.ipaddress);
		parmRun.push('--rate='+cmdparms.packages);
		parmRun.push('--sourceip='+cmdparms.sourceip);
		parmRun.push('-oJ');
		parmRun.push('./scan2.json');
		//console.log(parmRun);

        //var h = spawn('ping', ['-c', Number(10) ,'www.baidu.com']);
        //var h = spawn('masscan', ['-p0-100', '202.108.33.0/24',  '-oJ', './scan2.json']);
		var h = spawn('masscan', parmRun);
	   	
		this.pid = h.pid;
		
		//console.log(this);
		
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
		  if (signal === 'SIGTERM') {
			  socket.emit('cmd_killed', '扫描被手动终止！');
			  this.pid = null;
		  };
		  console.log(rs);
		  console.log(typeof(rs.rStore));
		  //rs.rStore(socket);
		  //rs.rRead(socket);
        });
		//return this;
};
function killChildProgress(){
	if(this.pid){
		console.log('killChildProgress'+this.pid);
		process.kill(this.pid,'SIGTERM');
	}
	
};
exports.start = start;
exports.kill = killChildProgress;