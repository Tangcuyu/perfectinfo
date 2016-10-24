var socket = io();

socket.on('send data', function(message) {

	//console.log('1');
	//console.log(message);
   try { message = JSON.parse(message); } catch($) {}

    if (!cache[message.key]) cache[message.key] = [];
    cache[message.key].push(message.value);

    if (!keys[message.key]) {
      metrics.push(metric(message.key));
      metrics.sort(function(a, b) { return a - b });
      keys[message.key] = Date.now();
      render();
    } 
  });
  
socket.on('error',function(err){
	  console.log(err);
  });