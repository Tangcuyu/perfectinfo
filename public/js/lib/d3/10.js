
			  var matrix = [
					[11975,  5871, 8916, 2868],
					[ 1951, 10048, 2060, 6171],
					[ 8010, 16145, 8090, 8045],
					[ 1013,   990,  940, 6907]
				];
 
				var width = 450,
					height = 300,
					innerRadius = Math.min(width, height) * .41,
					outerRadius = innerRadius * 1.1;
 
				var fill =["#012000", "#FFDD89", "#957244", "#F26223"];//颜色数组
			 
				var svg = d3.select("body").select("#chord").append("svg")
						.attr("width", width)
						.attr("height", height)
						.append("g")
						.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");//偏移一下
						
				 var chord = d3.layout.chord()
					.padding(.05)
					.sortSubgroups(d3.descending)
					.matrix(matrix);
					
				 svg.append("g").selectAll("path")
					.data(chord.groups)
					.enter().append("path")
					.style("fill", function(d) { return fill[d.index] })
					.style("stroke", function(d) { return fill[d.index]; })
					.attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
					
				svg.append("g")
					.attr("class", "chord")
					.selectAll("path")
					.data(chord.chords)
					.enter().append("path")
					.attr("d", d3.svg.chord().radius(innerRadius))
					.style("fill", function(d) { return fill[d.target.index]; })
					.style("opacity", 1);
				
				 	
				 var ticks = svg.append("g").selectAll("g")
						.data(chord.groups)//第一次分组,依据是chord.groups
						.enter().append("g").selectAll("g")
						.data(groupTicks)//第二次分组，依据是刻度对象
						.enter().append("g")
						.attr("transform", function(d) {//对刻度进行旋转变换
							return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
									+ "translate(" + outerRadius + ",0)";
						});
			 
				ticks.append("line")//来跟线。。
						.attr("x1", 1)
						.attr("y1", 0)
						.attr("x2", 5)
						.attr("y2", 0)
						.style("stroke", "#000");
			 
				ticks.append("text")//添加刻度文字
						.attr("x", 8)
						.attr("dy", ".35em")
						.attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })//文字要继续变换一下避免遮住
						.style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })//为了给尾端的刻度应用样式，这里判断一下角度
						.text(function(d) { return d.label; });//给刻度添加文字
			 
				// Returns an array of tick angles and labels, given a group.
				function groupTicks(d) {
					var k = (d.endAngle - d.startAngle) / d.value;
					return d3.range(0, d.value, 1000).map(function(v, i) {//首先创建一个刻度的数组，遍历之
						return {
							angle: v * k + d.startAngle,//存储单个刻度的角度
							label: i % 5 ? null : v / 1000 + "k"//存储单个刻度的标记
						};
					});
				}
				
				d3.select("p")
				.on("click", function() {
					
					
					
				});
				
				