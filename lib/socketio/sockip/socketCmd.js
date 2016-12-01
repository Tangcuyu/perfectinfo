var spawn = require('child_process').spawn;
var fs = require('fs');
var createCache = require('level');
var LevelWriteStream = require('level-write-stream');
var path = require('path');
var es = require('event-stream');
var inspect = require('util').inspect;
//Create LevelDB
var location = path.join(__dirname, 'cache');
var cache = createCache(location, {keyEncoding: 'string', valueEncoding: 'json'}, function(error, cache){
	if (error) console.log('Error when create LevelDB');
	return cache;
});

function resultStore(cache, socket){
		//Create a writeable stream for levelDB: cache
		var writeStream = LevelWriteStream(cache);
		//Create a readable stream from scan2.json
		var rs = fs.createReadStream('./scan2.json');
		//Get the command run time and make it to string.
		var newdate = new Date();
		var k = Date.now();
		var key = newdate.toLocaleString(k);
		// write file content to leveldb with pipe
			rs.pipe(es.split())
			  .pipe(es.map(function(line, cb){
				  if(!isContains(line,'finished')) {
					  var lineobj = {};
						  lineobj.key = key;
						  lineobj.value = line;
					cb(null, lineobj);
				  }				 
			  }))
			  .pipe(writeStream());
		
			cache.createReadStream()
				  .on('data', function(data) {
					  var key = data.key,
						  value = data.value;
					  sendResult(key, value);
				  })
				  .on('error', function(error){
					  console.log(error);
				  })
				  .on('end', function() {
					//cache.on('put', send);
					console.log('ReadStream end!');
				  });
			function sendResult(key, value) {
				  var response = JSON.stringify({ key : key, value : value });
				  socket.volatile.emit('cmd_finished',response);
				  response = null;
			}
	
};

function isContains(str, substr){
	return str.indexOf(substr) >= 0;
}

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
		console.log(parmRun);

        //var h = spawn('ping', ['-c', Number(10) ,'www.baidu.com']);
        //var h = spawn('masscan', ['-p80', '202.108.33.0/24',  '-oJ', './scan2.json']);
		var h = spawn('masscan', parmRun);
	
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
		  resultStore(cache, socket);

        });

}

function kill(socket, cmdparms) {
	
		function send(key) {
          var response = JSON.stringify({ key : key});
          socket.emit('kill_finished', response, function(err){
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
        //var h = spawn('masscan', ['-p80', '202.108.33.0/24',  '-oJ', './scan2.json']);
		var h = spawn('masscan', parmRun);
		console.log(h.pid);
		h.stdout.on('data', function (s) {
			console.log(s);     		   
        });

        h.stderr.on('data', function (s) {   
            
        });
       

        h.stdout.on('end', function (s) {
          console.log('command end');  
        });
		
		h.on('close', function(code, signal){
			console.log('masscan terminated with signal:' + signal);
		});
		h.kill();
		h.stdin.end();
       
}

exports.start = start;
exports.kill = kill;