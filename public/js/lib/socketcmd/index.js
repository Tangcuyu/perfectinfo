var socket = io();
var cache = [];

function render() {
      d3.select("#scanresult").selectAll("pre")
         .data(cache)
         .enter()
         .append("pre")
         .text(function(d){
            return d;
          })
         .attr("font-family", "sans-serif")
         .attr("font-size", "14px");
  }

socket.on('message', function(message) {

    //console.log(message);
    try { message = JSON.parse(message); } catch($) {}

    if (!cache[message.key]) cache[message.key] = [];
    
    var pattern1 = /.done/g;
    var pattern2 = /.rate/g;
    var matches = pattern1.test(message.key);
    if (matches){
    	cache.push(message.key);
    };
    
    render();
    
    
  });
  
socket.on('error',function(err){
	  console.log(err);
  });