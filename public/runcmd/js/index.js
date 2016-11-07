var socket = io();

socket.on('send data', function(message) {

	//console.log('1');
	//console.log(message);
   try { message = JSON.parse(message); } catch($) {}
	$('#scanresult').append('li').text(message);
  });
  
socket.on('error',function(err){
	  console.log(err);
  });