var http = require('http');
var net = require('net');
var url = require('url');
var fs = require('fs');
var createCache = require('levelup');
var LevelWriteStream = require('level-write-stream');
var path = require('path');

var es = require('event-stream');

var st = require('st');
var WebSocketServer = require('ws').Server;
//var WebSocket = require('./websocket');
//var WebSocket = require('ws');


var staticHandler = st({
  path: path.join(__dirname, '..', 'public'),
  url: '/',
  index: 'index.html'
});

// list of currently connected clients (users)
  var WsClients = [];

module.exports = function(ports) {

  ports = ports || {};

  ports.http = ports.http || 80;
  ports.tcp = ports.tcp || 9099;

  // create levelDB:cache in the lib folder
  var location = path.join(__dirname, 'cache');
  
  // create log file
  var logFileName = path.join(__dirname, 'tcplog');

  createCache(location, { keyEncoding: 'string', valueEncoding: 'json' }, function(error, cache) {
	
	// Create a writeable stream for levelDB: cache
    var WriteStream = LevelWriteStream(cache);

    /* 
      Create a tcpserver instance.
    */
    var tcpserver = net.createServer(function(socket) {
       
    });

	//Allow the max 64 clients to get connected to us.
	tcpserver.maxConnections = 64;
	
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

    // Handle a "new connection" event
    tcpserver.on('connection', function (socket) {    
      // Identify this client   
      socket.name = socket.remoteAddress+':'+socket.remotePort;
      // Add the new client in the list
      WsClients.push(socket);
      
      // We have a connection - a socket object is assigned to the connection automatically   
      console.log('\nCONNECTED with tcp client: ' + socket.name +'\n' + 'CONNECTED time: ' + (new Date()) +'\n' );
      
	  //Get the count of connected clients 
	  tcpserver.getConnections(function(err, count){
					console.log("Count of connected clients:"+count);
				});
	  
      // Add a 'data' event handler to this instance of socket
	  socket.on('data', function(data) {
				var message = (new Date()) + socket.name + '> ' + data.toString();
				var data_str = data.toString();
							
				// Write the data back to the socket, the client will receive it as data from the server
				socket.write('Server received:\n'+data_str+'\n'+'from:'+socket.name+'\n');
			
				//Write the log to logfile.
				fs.appendFile(logFileName, message + '\n', function (err) {
					if (err) {
						console.log('Append file: ' + logFileName + ' error...\n');
					}
				});	
				
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
						//console.log(data_str);
						//console.log(obj);
					var stream = WriteStream();
						stream.write(obj);   //insert data to LevelDB
				} else { 					// Insert the data with pipe (only working on object data form)
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
        // body...
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

    var httpserver = http.createServer(staticHandler);
    var wss = new WebSocketServer({ 
      server: httpserver.listen(ports.http, function() {
        console.log('http server listening on %d', ports.http);
      }) 
    });

      wss.on('connection', function(ws) {
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
				  ws.send(response,function(err){
					  //console.log(err);
				  });
				}

        ws.on('close',function(){
          console.log('Browser refresh or close.');
        });

      });
	 

  });
};
