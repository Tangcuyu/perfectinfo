var keystone = require('keystone');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
	
	var options = {
		root: __dirname + '/public/'
	};
	var filename = req.params.name;
	res.sendFile('index.html',options);
});

io.on('connection',function(socket){
	console.log('a user connected');
	io.emit('connected','a user connected');
	socket.on('chat message',function(msg){
		io.emit('chat message', msg);
	});
	socket.on('disconnect',function(msg){
		msg = 'a user disconnected';
		console.log('user disconnected');
	});
	
});

http.listen(3008,function(){
	console.log('listen on port: 3008');
});
