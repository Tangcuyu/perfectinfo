
+function(){
 var widthMain=$("#main").width()
 var context;
 $(window).resize(function(){
  widthMain=$("#main").width()
	context = cubism.context()
    .serverDelay(0)
    .clientDelay(0)
    .step(1e3)
    .size(widthMain);
  })

	var socket = io();

	var cache = {};
	var metrics = [];
	var keys = {};

  socket.on('send data', function(message) {
   try { message = JSON.parse(message); } catch($) {}

    if (!cache[message.key]) cache[message.key] = [];
    cache[message.key].push(message.value);

    if (!keys[message.key]) {
      metrics.push(metric(message.key));
      metrics.sort(function(a, b) { return a - b });
      keys[message.key] = Date.now();
      render();
    } 
  });
  
  socket.on('error',function(err){
	  console.log(err);
  });

    context = cubism.context()
    .serverDelay(0)
    .clientDelay(0)
    .step(1e3)
    .size(widthMain);


  function metric(name) {

    cache[name] = [];

    var last;

    var m = context.metric(function(start, stop, step, callback) {

      start = +start, stop = +stop;
      if (isNaN(last)) last = start;     
      cache[name] = cache[name].slice((start - stop) / step);
      callback(null, cache[name]);
    }, name);

    m.name = name;
    return m;
  }

  function render() {
    d3.select("#main").call(function(div) {

      div
        .append("div")
        .attr("class", "axis")
        .call(context.axis().orient("top"));

      div
        .selectAll(".horizon")
          .data(metrics)
        .enter().append("div")
          .attr("class", "horizon")
          .call(context.horizon().extent([-20, 20]).height(125));

      div.append("div")
        .attr("class", "rule")
         .call(context.rule());

    });

    // On mousemove, reposition the chart values to match the rule.
    context.on("focus", function(i) {
      var px = i == null ? null : context.size() - i + "px";
      d3.selectAll(".value").style("right", px);
    });
  }



}()
