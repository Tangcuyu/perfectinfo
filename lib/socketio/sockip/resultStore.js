var keystone = require('keystone');
var _ = require('underscore');
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

//存储扫描结果到keystone的mongodb数据库
/* function resultMongodb(done){
	//Create a readable stream from scan2.json
	/* fs.readFile(rootpath+'scan2.json', function(err, data){
		if (err) throw err;
		//var jsonobj = JSON.parse(data);
		console.log(data);
		keystone.createItems(jsonobj, function(err, stats){
			stats && console.log(stats.message);
			done(err);
		}); 
	}); 
	//Create a readable stream from scan2.json
	var rs = fs.createReadStream(rootpath+'scan2.json');
	rs.pipe(es.split())
			.pipe(es.map(function(line, cb){
				if(isContains(line,'ip')) {
					line = line.substring(0,line.length-1);
					var lineobj = JSON.parse(line);
						console.log(lineobj);
					var jsonobj = {};
					jsonobj.IPaddress = lineobj;
					keystone.createItems(jsonobj, function(err, stats){
						stats && console.log(stats.message);
						done(err);
					}); 
				 }
			}));
}; */

//字符串是否包含的判断函数，用于去除扫描结果中的finished等没用的行
function isContains(str, substr){
	return str.indexOf(substr) >= 0;
};

//存储扫描结果到levelDB数据库
function resultStore(key){
		//Create a writeable stream for levelDB: cache
		var writeStream = LevelWriteStream(cache);
		//Create a readable stream from scan2.json
		var rs = fs.createReadStream(rootpath+'scan2.json');
		//Get the command run time and make it to string.
		
		var i=0;
		
		// write file content to leveldb with pipe
		rs.pipe(es.split()) //按照每行分割scan2.json文件中的数据
			.pipe(es.map(function(line, cb){
				// 去掉最后一行{fininsed:1}
				if(isContains(line,'ip')) {
					//去掉每行最后一个字符: ,
					line = line.substring(0,line.length-1);
					try { var mobj = JSON.parse(line); } catch($) { console.log('JSON.parse error');}// 把json字符串解析为json对象
					mobj.scanid = key+'-'+i++;  //增加 scanid 属性： scanid属性为当前时间+序号i
					//从mobj中提取ports数组，并合并到mobj对象中
					var ports = {};
					ports = mobj.ports[0];
					mobj = _.extend(mobj,ports);
					mobj = _.omit(mobj, 'ports'); //去除mobj对象里原有的ports属性
					//构造存储到mongodb的对象
					var jsonobj = {}; 
					jsonobj.IPaddress = _.extend(mobj);
					var arr = _.values(jsonobj);
					jsonobj.IPaddress = arr;
					//把jsonobj数据通过keystone存储到mongoDB数据库中
					keystone.createItems(jsonobj, function(err, stats){
						if (err) console.log(err);
						stats && console.log(stats.message);
					});
					//为回调函数cb，构造lineobj对象
					var lineobj = {};
						lineobj.key = key+'-'+i++;
						lineobj.value = line;
					cb(null, lineobj);	
				 }
			}))
			.pipe(writeStream()); //把数据存到LevelDB数据库中
		rs.on('end', function(){
			console.log('write to leveldb finished.');
			i=0;
		});
};

//发送数据到客户端
function sendResult(key, value, socket) {
				  var response = JSON.stringify({ key : key, value : value });
				  socket.volatile.emit('cmd_finished',response);
};

//从scan2.json中读取扫描结果，并通过socket.volatile.emit发送到前端
function resultRead(socket,key){
	//Create a readable stream from scan2.json
	fs.readFile(rootpath+'scan2.json', 'utf8', function(err, data){
		if(err) throw err;
		sendResult(key, data, socket);
	});	
};

exports.resultStore = resultStore;
exports.resultRead = resultRead;
//exports.resultMongodb = resultMongodb;
