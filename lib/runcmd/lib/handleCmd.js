var spawn = require('child_process').spawn;

function start(wss, req, res) {
  console.log("Request handler 'start' was called.");
  console.log(arguments[3]);
  wss.on('connection', function(ws) {

        function send(key) {
          var response = JSON.stringify({ key : key});
          ws.send(response,function(err){
            if(err) console.log(err);
          });
        };
		
		ws.on('open',function(){
            console.log('ws open');
          });        


        //var h = spawn('ping', ['-c', Number(10) ,'www.baidu.com']);
        var h = spawn('masscan', ['-p80', '202.108.33.0/24',  '-oJ', './scan2.json']);


        h.stdout.on('data', function (s) {
			ws.on('message',function(){
				send(s.toString()); 
			});        		   
        });

        h.stderr.on('data', function (s) {   
            send(s.toString());
        });
       

        h.stdout.on('end', function (s) {
          console.log('command end');  
        });

        h.on('close',function(code,signal){
          console.log('child process exited with code:' + code +'signal'+ signal);

        });

        ws.on('close',function(){
            console.log('ws closed');
          });        

  });

}

exports.start = start;