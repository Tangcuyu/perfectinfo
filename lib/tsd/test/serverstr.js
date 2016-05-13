
var net = require('net');

var x = 0;

var max = 1000;



var client = net.connect({ port: 9099, host: '192.168.1.97' }, function() {
  
  var id = setInterval(function() {

            x++;

            var val = ((Math.round(Math.random()*100 + x)) / 20).toString();

            client.write('100211,噪音传感器：tnpt213,'+ val + ',6,lx 9600,lxzj,,,,,db,;');
            //client.write('{100211,tnpt213};');


            if(x > max) {
              clearInterval(id);
              console.log('Data transfer done.');
              client.end();
              
            }

  }, 1000);
    
    client.setEncoding('utf8');
    client.on('data', (chunk) => {
                //assert.equal(typeof chunk, 'string');
              //console.log('got data %d', chunk.toString());
                console.log('got data:', chunk.toString());
                });
    client.on('end', () => {
        console.log('disconnected from server');
      });

});



