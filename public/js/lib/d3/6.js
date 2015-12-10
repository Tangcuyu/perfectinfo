			var w = 680;
			var h = 300;
			var dataset = [];
			var numDataPoints = 50;
			var xRange = Math.random() * 1000;
			var yRange = Math.random() * 1000;
			for (var i = 0; i < numDataPoints; i++) {
				var newNumber1 = Math.round(Math.random() * xRange);
				var newNumber2 = Math.round(Math.random() * yRange);
				dataset.push([newNumber1, newNumber2]);
			}

			var padding = 30;
			var formatAsPercentage = d3.format(".1%");

			
			
			var xScale = d3.scale.linear()
               .domain([0, d3.max(dataset, function(d) { return d[0]; })])
               .range([padding, w - padding * 2]);
			var yScale = d3.scale.linear()
               .domain([0, d3.max(dataset, function(d) { return d[1]; })])
               .range([h - padding, padding]);
			var rScale = d3.scale.linear()
               .domain([0, d3.max(dataset, function(d) { return d[1]; })])
               .range([2, 5]);
			var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
				  .ticks(5);  //Set rough # of ticks
				  //.tickFormat(formatAsPercentage);
			var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(5);	  

			var svg = d3.select("body")
			.select("#sandian")
            .append("svg")
            .attr("width", w)   // <-- Here
            .attr("height", h)
			
			//Define clipping path
			svg.append("clipPath")
				.attr("id", "chart-area")
				.append("rect")
				.attr("x", padding)
				.attr("y", padding)
				.attr("width", w - padding * 3)
				.attr("height", h - padding * 2);

			//Create circles
			svg.append("g")
			   .attr("id", "circles")
			   .attr("clip-path", "url(#chart-area)")
			   .selectAll("circle")
			   .data(dataset)
			   .enter()
			   .append("circle")
			   .attr("cx", function(d) {
			   		return xScale(d[0]);
			   })
			   .attr("cy", function(d) {
			   		return yScale(d[1]);
			   })
			   .attr("r", 2);
			
			//Create X axis
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + (h - padding) + ")")
				.call(xAxis);
			
			//Create Y axis
			svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + padding + ",0)")
				.call(yAxis);
			
			//On click, update with new data			
			d3.select("#psandian")
				.on("click", function() {

					//New values for dataset
					var numValues = dataset.length;						 		//Count original length of dataset
					var maxRange = Math.random() * 1000;						//Max range of new values
					dataset = [];  						 				 		//Initialize empty array
					for (var i = 0; i < numValues; i++) {				 		//Loop numValues times
						var newNumber1 = Math.floor(Math.random() * maxRange);	//New random integer
						var newNumber2 = Math.floor(Math.random() * maxRange);	//New random integer
						dataset.push([newNumber1, newNumber2]);					//Add new number to array
					}
					
					//Update scale domains
					xScale.domain([0, d3.max(dataset, function(d) { return d[0]; })]);
					yScale.domain([0, d3.max(dataset, function(d) { return d[1]; })]);

					//Update all circles
					svg.selectAll("circle")
					   .data(dataset)
					   .transition()
					   .duration(1000)
					   .each("start", function() {      // <-- Executes at start of transition
						   d3.select(this)
							 .attr("fill", "magenta")
							 .attr("r", 8);
					   })
					   .attr("cx", function(d) {
					   		return xScale(d[0]);
					   })
					   .attr("cy", function(d) {
					   		return yScale(d[1]);
					   })
					   .transition()    // <-- Transition #2
					   .duration(1000)
					   .attr("fill", "black")
					   .attr("r", 2);
															   

					//Update X axis
					svg.select(".x.axis")
				    	.transition()
				    	.duration(1000)
						.call(xAxis);
					
					//Update Y axis
					svg.select(".y.axis")
				    	.transition()
				    	.duration(1000)
						.call(yAxis);

				});