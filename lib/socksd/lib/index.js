var net = require('net');
var fs = require('fs');
var createCache = require('levelup');
var LevelWriteStream = require('level-write-stream');
var path = require('path');
var es = require('event-stream');
var WsClients = [];// list of currently connected clients (users)

module.exports = function(ports,httpserver) {
		/*Use createCache to finish following:
		  Create LevelDB; 
		  Create TCP socket server; 
		  Get data for TCP client; 
		  Create Socket.io server; 
		  Get data from database: leveldb;
		  Send data to socket.io client;
		*/
		var ports = ports || {};
		ports.http = ports.http || 80;
		ports.tcp = ports.tcp || 9099;	
		var location = path.join(__dirname, 'cache'); // The location for the LevelDB database
		
		// Create LevelDB;
  createCache(location, { keyEncoding: 'string', valueEncoding: 'json' }, function(error, cache) {
		var WriteStream = LevelWriteStream(cache);	// Create a writeable stream for levelDB: cache
		//Create a TCP SOCKET server
		var tcpserver = net.createServer();	
		tcpserver.maxConnections = 64; 	//Allow the max 64 clients to get connected to us.
		tcpserver.listen(ports.tcp, function() {
		  console.log('tcp server listening on %d', ports.tcp);
		});
		/*
		  One issue some users run into is getting EADDRINUSE errors. 
		  This means that another server is already running on the requested port. 
		  One way of handling this would be to wait a second and then try again. 
		*/
		tcpserver.on('error', function (e) {
		  if (e.code == 'EADDRINUSE') {
			console.log('Port in use, retrying...');		  
			setTimeout(function () {
			  tcpserver.close();
			  console.log('Try listening on alternative port: ' + ports.tcp);
			  tcpserver.listen(ports.tcp, function() {
				console.log('tcp server listening on %d', ports.tcp);
			  });
			}, 1000);
		  }
		});  
		// Handle a "new connection" event; Save the data to LevelDB database;
		tcpserver.on('connection', function (socket) {    
			socket.name = socket.remoteAddress+':'+socket.remotePort; // Identify this client   
			// We have a connection - a socket object is assigned to the connection automatically   
			console.log('\nCONNECTED with tcp client: ' + socket.name +'\n' + 'CONNECTED time: ' + (new Date()) +'\n' );
			// Add the new client in the list
			WsClients.push(socket);
			//Get the count of connected clients 
			tcpserver.getConnections(function(err, count){
				console.log("Count of connected clients:"+count);
			});
		  
			//Get data for TCP client;
			socket.on('data', function(data) {
				var message = (new Date()) + socket.name + '> ' + data.toString();
				var data_str = data.toString();
				var stream = WriteStream();	
				// Write the data back to the socket, the client will receive it as data from the server				
				socket.write('Server received:\n'+data_str+'\n'+'from:'+socket.name+'\n');  
				//Check the client data type. If clients are lots of different sensors, Can be optimize with object in the further.
				var check = function(str,substr){
					if (str.indexOf(substr)>= 0) {
						return true;
					} else {
						return false;
					}
							
				};
				/* If data from LXZJ, the data will be string like: “100211,tnpt213,3.2316362496931106,6,lx 9600,lxzj,,,,,db,;”
							Use level-write-stream.write() to insert into levelDB.
					If data from test data with object form, Use pipe to insert data	
				*/	
				if (check(data_str,'lxzj')) {
					var obj= new Object();
					var strarray = data_str.split(",")  // Split the string to a array
					obj.key=strarray[1];
					obj.value=strarray[2];
					stream.write(obj);   //insert data to LevelDB
				} else { 	// Insert the data with pipe (only working on object data form)
					socket
						.pipe(es.split())
						.pipe(es.parse())
						.pipe(WriteStream());
				};
			});

			// Add a 'error' event handler to this instance of socket 
			socket.on('error', function (e) {   
				console.error('socket error with return code: ' + e.code);
				//We should end mysql pool due to the database operation error instead.
				//TODO: Need to find a good point to call endConnections() somewhere else.
				//The other side of the TCP conversation abruptly closed its end of the connection
				console.log('Client:' + socket.name + ' stop the tcpconnection abnormally.');
				socket.destroy();
			}); 	

			socket.on('end', function () {
				console.log('Data transfer end with:' + socket.name);
				socket.end();
			});
			
			// Add a 'close' event handler to this instance of socket
			socket.on('close', function () {
				//remove the end connection with the client: socket.name
				WsClients.splice(WsClients.indexOf(socket), 1);       
				console.log('TCPConnection CLOSED by: ' + socket.name); 
			});
		  
		});
		//Create Socket.io server;
		var io = require('socket.io')(httpserver); 
		//Send data to socket.io client;
		io.on('connection', function(socket) {	  
				cache.createKeyStream()
				  .on('data', function(key) {
					cache.get(key, function (err, value) {
					  if (!err) send(key, value);
					});
				  })
				  .on('end', function() {
					cache.on('put', send);
				  })
				function send(key, value) {
				  var response = JSON.stringify({ key : key, value : value });
				  socket.volatile.emit('send data',response);
				}
				socket.on('disconnect',function(){
				  console.log('Browser refresh or close.');
				}); 

		});
	 

  });
};
