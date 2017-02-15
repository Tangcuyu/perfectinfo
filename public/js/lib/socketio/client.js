var scanIP = io.connect('/scan_ip'),
	windpower = io.connect('/wind_power');
var cache = [],
	result = [];

	
function render() {
		d3.select("#scanresult").selectAll("pre")
         .data(cache)
         .enter()
         .insert("pre","pre")
         .text(function(d){
            return d;
          });
  }	
/*
	生成扫描结果页面的函数
*/  
function renderResult() {
		d3.select("#resultList").selectAll("pre")
         .data(result)
         .enter()
		 .append("pre")
         .text(function(d){
            return d;
          });
  }	

 /*
	重置进度条函数（暂时还没用到，需要调整）
*/ 
function resetProgressbar(){
			$('.progress .progress-bar').attr('data-transitiongoal', 0).progressbar({
				display_text: 'center'
			});
}

/*
	判断字符串包含关系的函数，用于去除扫描结果字符串中最后的{finished:1}
*/ 
function isContains(str, substr){
	return str.indexOf(substr) >= 0;
};

/*
开始处理后台服务器发送来的socket事件:
	1. adminopen事件：后台显示socket服务连接
	2. run事件：实时显示命令运行时，控制台上的显示日志
	3. scan_finished事件：扫描命令运行结束后，提示用户
	4. cmd_finished事件：获取后台扫描结果，并显示在resultList区域中
	5. cmd_killed事件：终止命令后提示
	6. cmd_kill_finish事件：终止命令后，再点击终止按钮时，提示用户进程已经停止
*/
scanIP.on('adminopen',function(client){
	console.log(client + '连接到scanIP服务....');
});

scanIP.on('run',function(message){
	
    try { message = JSON.parse(message); } catch($) {}

    if (!cache[message.key]) cache[message.key] = [];
    
    var pattern1 = /.done/g;
    var pattern2 = /.Scanning/g;
    var matches = pattern1.test(message.key);
	var mtitle = pattern2.test(message.key);
    if (mtitle || matches){
    	cache.push(message.key);
    };
	$('.progress .progress-bar').attr('data-transitiongoal', 100).progressbar({
				display_text: 'center',
				done: function(pb){
					//if (confirm('扫描完成重置进度条吗？')) {pb.attr('data-transitiongoal', 0).progressbar();}
					return;
				}
	});
	
    render();
});

scanIP.on('scan_finished',function(message){
	alert(message);
	return;
});

scanIP.on('cmd_finished',function(message){
	
    try { message = JSON.parse(message); } catch($) {}
	//console.log(message);
	//处理从服务器端获取的json数据
	var key = '扫描时间：' + message.key;
	var value = message.value;
	/* 
	if (isContains(value,'IP')) {
		
	}//value = JSON.parse(value); */
	console.log(typeof(value));
	result.push(key, message.value);
	console.log(result);
    renderResult();
	return;
});

scanIP.on('cmd_killed',function(message){
	cache.push(message);
	console.log(message);
    render();
	return;
});




scanIP.on('cmd_kill_finish',function(message){
	cache.push(message);
	console.log(message);
    render();
	return;
});

//把表单数据转换成JSON对象
$.fn.serializeObject = function(){
	var o = {};
	var a = this.serializeArray();
	$.each(a, function(){
		if (o[this.name] !== undefined){
			if(!o[this.name].push){
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		}else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};
//向后台的Socket server 提交扫描命令运行所需参数
$(function(){
	
	$.validator.addMethod('ipaddress', function(value, element){
		var ip = /^(1|([1-9]{1,2}|[1-9]0)|(1[0-9]{2}|2[0-5]{2}))((.(0|([1-9]{1,2}|[1-9]0)|(1[0-9]{2}|2[0-5]{2}))){2}).(1|([1-9]{1,2}|[1-9]0)|(1[0-9]{2}|2[0-5]{2}))$/;
		return this.optional(element) || (ip.test(value));
	}, '请输入正确的IP地址');
	$.validator.addMethod('ports', function(value, element){
		var port = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;   
		var r = /[-]+/;
		return this.optional(element) || ( port.test(value) || r.test(value));
	}, '请输入正确的端口或端口范围，比如：0-1000');
	
	$('#btnRuncmd').click(function(event){
		
		//验证表单输入对象
		var validator = $('#runcmdForm').validate({
			rules: {
				ipaddress:{
					required: true
					//ipaddress: true
				},
				ports:{
					required:true,
					ports:true
				},
				sourceip:{
					required: true,
					ipaddress: true
				}
			}
		});
		//表单的IP和端口是必填项，输入正确后才可以提交命令到后台运行
		if(validator.form()){
			var formobj = $('#runcmdForm').serializeObject();
			var response = JSON.stringify(formobj);
			if (confirm('确认开始扫描')){
				scanIP.emit('cmd_submit',response);	
			};
		};
		
		return false;
	});
	
	$('#btnResetcmd').click(function(event){
		var formobj = $('#runcmdForm').serializeObject();
		var response = JSON.stringify(formobj);
		if (confirm('确认要中断当前的扫描吗？')){
			scanIP.emit('cmd_kill',response);	
		};
		return false;
	});
});