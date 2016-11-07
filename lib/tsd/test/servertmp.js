
var net = require('net');

var x = 0;

var max = 1000;

var client = net.connect({ port: 9099, host: '101.200.209.103' }, function() {

  function write(json) {
    client.write(JSON.stringify(json) + '\n');
  }
  
  var id = setInterval(function() {

    x++;
    //write({ key: '温度', value: (Math.random() + x) / 50 });
    //write({ key: 'X轴振动偏移', value: (Math.round(Math.random()*100)) / 30 });
    //write({ key: '温度', value: (Math.random() + x) / 50 });
    //write({ key: 'ohai', value: 1000 });
    write({ key: '温度', value: (Math.round(Math.random()*100/20))});
    //write({ key: '温度', value: (Math.random() + x) / 50 });
    

    /*if(x > max) {
              clearInterval(id);
              console.log('Data transfer done.');
              client.end();
              
            };*/


  }, 1000);



   
 
});




client.setEncoding('utf8');
client.on('data', (chunk) => {
            //assert.equal(typeof chunk, 'string');
          //console.log('got data %d', chunk.toString());
            console.log('got string data', x +';'+ chunk.toString());
            });
client.on('end', () => {
        console.log('disconnected from server');
      });