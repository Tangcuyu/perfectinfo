var str = "100211,tnpt213,76.5,6,lx 9600,lxzj,,,,,db,";
var createKV=function(str){
	var obj = new Object();
	var strarray = str.split(',');
	
		obj.key = strarray[1];
		obj.value = strarray[2];


	console.log(obj);

}

createKV(str);