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
    render();
});

scanIP.on('cmd_finished',function(message){
	
    try { message = JSON.parse(message); } catch($) {}

    if (!result[message.key]) result[message.key] = [];

	result.push(message.key);
	console.log(result);
    renderResult();
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
		var formobj = $('#runcmdForm').serializeObject();
		var response = JSON.stringify(formobj);
		if (confirm('确认开始扫描')){
			$('.progress .progress-bar').progressbar({
				display_text: 'fill'
			});
			scanIP.emit('cmd_submit',response);	
		};
		return false;
	});
});