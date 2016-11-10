websocket(function(socket) {

  var cache = [],
      height = 500,
      width = 600;
  
  /*var svg = d3.select("#scanresult")
                .append("svg")
                .attr("width", width)
                .attr("height", height);*/

  socket.on('data', function(message) {

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

});
