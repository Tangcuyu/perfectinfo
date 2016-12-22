var fs = require('fs');
var createCache = require('level');
var LevelWriteStream = require('level-write-stream');
var path = require('path');
var es = require('event-stream');
//Create LevelDB
var location = path.join(__dirname, 'cache');
var cache = createCache(location, {keyEncoding: 'string', valueEncoding: 'json'}, function(error, cache){
	if (error) console.log('Error when create LevelDB');
	return cache;
});
//获取项目根目录路径
var rootpath = path.join(__dirname, '../../../');

function isContains(str, substr){
	return str.indexOf(substr) >= 0;
};

//存储扫描结果到levelDB数据库
function resultStore(){
		//Create a writeable stream for levelDB: cache
		var writeStream = LevelWriteStream(cache);
		//Create a readable stream from scan2.json
		var rs = fs.createReadStream(rootpath+'scan2.json');
		//Get the command run time and make it to string.
		var newdate = new Date();
		var k = Date.now();
		var key = newdate.toLocaleString(k);
		var i=0;
		
		// write file content to leveldb with pipe
		rs.pipe(es.split())
			.pipe(es.map(function(line, cb){
				console.log(isContains(line,'ip'));
				if(isContains(line,'ip')) {
					var lineobj = {};
						lineobj.key = key+'-'+i++;
						lineobj.value = line;
						cb(null, lineobj);	
						console.log(lineobj);
				 }
			}))
			.pipe(writeStream());
};

function resultRead(socket){
		
		function sendResult(key, value) {
				  var response = JSON.stringify({ key : key, value : value });
				  socket.volatile.emit('cmd_finished',response);
				  response = null;
			};
		
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
};

exports.resultStore = resultStore;
exports.resultRead = resultRead;
