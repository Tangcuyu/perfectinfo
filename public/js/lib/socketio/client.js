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
  
function renderResult() {
		d3.select("#resultList").selectAll("pre")
         .data(result)
         .enter()
         .insert("pre","pre")
         .text(function(d){
            return d;
          });
  }	
  
function resetProgressbar(){
			$('.progress .progress-bar').attr('data-transitiongoal', 0).progressbar({
				display_text: 'center'
			});
}
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

scanIP.on('cmd_finished',function(message){
	
    try { message = JSON.parse(message); } catch($) {}

    //if (!result[message.key]) result[message.key] = [];

	result.push(message.value);
	console.log(message);
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