var scanIP = io.connect('/scan_ip'),
	windpower = io.connect('/wind_power');
var cache = [],
	result = [];

	
function render() {
		d3.select("#scanresult").selectAll("pre")
         .data(cache)
         .enter()
         .append("pre")
         .text(function(d){
            return d;
          });
  }	
  
function renderResult() {
		d3.select("#resultList").selectAll("pre")
         .data(result)
         .enter()
         .append("pre")
         .text(function(d){
            return d;
          });
  }	
  
function resetProgressbar(){
			$('.progress .progress-bar').attr('data-transitiongoal', 0).progressbar({
				display_text: 'center'
			});
}

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
	
	
	$('#btnRuncmd').click(function(event){
		//验证表单输入
		var validator = $('#runcmdForm').validate({
			rules: {
				ipaddress:{
					required: true	
				},
				ports:{
					required:true,
					digits:true
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