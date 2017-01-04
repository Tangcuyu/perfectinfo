var spawn = require('child_process').spawn;
var rs = require('./resultStore');

function start(socket, cmdparms) {
		//定义发送子进程运行时产生信息的send函数
		function send(key) {
          var response = JSON.stringify({ key : key});
          socket.emit('run', response, function(err){
            if(err) console.log(err);
          });
		  response = null;
        };
		
		//获取传入给子进程的参数数组
		var parmRun = [];
		parmRun.push('-p'+cmdparms.ports);
		parmRun.push(cmdparms.ipaddress);
		parmRun.push('--rate='+cmdparms.packages);
		parmRun.push('--sourceip='+cmdparms.sourceip);
		parmRun.push('-oJ');
		parmRun.push('./scan2.json');
		
        //运行masscan扫描子进程
		//var h = spawn('masscan', ['-p0-100', '202.108.33.0/24',  '-oJ', './scan2.json']);
		var h = spawn('masscan', parmRun);
		
	   	//把当前的子进程pid，赋值给this对象的pid属性，方面在kill函数中使用
		var pid = h.pid;
		
		
		//子进程在标准输出上有数据时，调用send函数，把实时数据发送到前端
        h.stdout.on('data', function (s) {
			send(s.toString());     		   
        });
		
		//子进程发生错误时，发送错误信息到前端
        h.stderr.on('data', function (s) {   
            send(s.toString());
        });
       
		//子进程运行结束时，在控制台显示命令结束
        h.stdout.on('end', function (s) {
		  console.log('command end');  
        });
		
		/*
			--子进程关闭时，在控制台打印子进程退出代码，以及终止时发出的信号。
			--当子进程终止信号为： SIGTERM的时候，表明子进程被KILL,此时，向前台发送扫描被手动终止信息。
			--子进程正常运行关闭后，调用数据存储对象实例方法，完成数据持久化。
			--数据存储对象负责把数据从子进程自动生成的json文件，解析并存入levelDB数据库 	
		*/
        h.on('close',function(code,signal){
			var newdate = new Date();
			var k = Date.now();
			var key = newdate.toLocaleString(k);
			console.log('child process exited with code:' + code +'; signal'+ signal);
			console.log(pid);
			if (signal === 'SIGTERM') {
				socket.emit('cmd_killed', '扫描被手动终止！');
			};
			if (code === 0) {
				socket.emit('scan_finished', '扫描结束');
				rs.resultStore(key);
				rs.resultRead(socket,key);	
			};
			
        });
		
		return pid;
};

// killChildProgress函数实现终止子进程的功能。
function killChildProgress(socket, pid){
	// 判断是否有运行的masscan子进程，如果有向该子进程发出终止信号。终止进程后，把this.pid赋值为undefined防止多次调用kill。
	if(pid){
		console.log('killChildProgress'+ pid);
		process.kill(pid,'SIGTERM');
		pid = null;
		console.log(pid);
	}else{
		socket.emit('cmd_kill_finish', '扫描程序还没开始运行！');
	}
	
};

//导出模块方法
exports.start = start;
exports.kill = killChildProgress;