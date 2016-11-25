var spawn = require('child_process').spawn;
var fs = require('fs');
var createCache = require('level');
var LevelWriteStream = require('level-write-stream');
var path = require('path');
var es = require('event-stream');
var inspect = require('util').inspect;

function resultStore(createCache, socket){
	//Create LevelDB
	var location = path.join(__dirname, 'cache');
	createCache(location, {keyEncoding: 'string', valueEncoding: 'json'}, function(error, cache){
		
		//Create a writeable stream for levelDB: cache
		var writeStream = LevelWriteStream(cache);
		var rs = fs.createReadStream('./scan2.json');
		
			rs.pipe(es.split())
			  .pipe(es.map(function(line, cb){
				  console.log(line);
				  cb(null, line);
			  }))
			  .pipe(writeStream());
		
			cache.createKeyStream()
				  .on('data', function(key) {
					cache.get(key, function (err, value) {
					  if (!err) send(key, value);
					});
				  })
				  .on('end', function() {
					cache.on('put', send);
				  });
			function send(key, value) {
				  var response = JSON.stringify({ key : key, value : value });
				  socket.volatile.emit('cmd_finished',response);
			}
		
	});
	
};

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
		  resultStore(createCache, socket);

        });

}

exports.start = start;