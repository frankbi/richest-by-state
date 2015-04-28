var width = 960,
	height = 500;

var id = "#map";

var path = d3.geo.path();

var svg = d3.select(id).append("svg")
	.attr("width", width)
	.attr("height", height);

function editWorthValue(str) {

	if (str < 1000) {
		return "$" + str + " M";
	} else {
		str = parseInt(str.replace(",", "")) / 1000;
		return "$" + str + " B";
	}

}

d3.json("data/us-states.json", function(error, json) {

	d3.csv("data/data.csv", function(error, data) {

		for (var i = 0; i < data.length; i++) {
			for (var k = 0; k < json.features.length; k++) {
				if (data[i].ABBREV == json.features[k].properties.abbrev) {
					json.features[k].properties.bname = data[i].DISPLAY_NAME;
					json.features[k].properties.worth = editWorthValue(data[i].WORTH);
				}
			}
		}

		var tooltip = d3.select(id)
			.append("div")
			.attr("id", "tooltip")
			.attr("class", "cf")
			.style("position", "absolute")
			.style("z-index", "10")
			.style("visibility", "hidden");

		var states = svg.selectAll("path")
			.data(json.features)
		  .enter().append("path")
		  	.attr("d", path)
		  	.attr("fill", "gray")
		  	.attr("stroke", "white")
		  	.on("mousemove", function(d) {

		  		// console.log(d);

		  		tooltip.style("visibility", "visible");
		  		tooltip.transition()
		  			.duration(100);

		  		tooltip.html(function() {
		  			var source = $("#tooltip-template").html();
		  			var template = Handlebars.compile(source);
		  			return template(d.properties);
		  		})
		  		.style("left", (d3.event.pageX) + 30 + "px")
		  		.style("top", (d3.event.pageY) + "px");
		  		// .style("left", (d3.event.pageX) - 500 + "px")
		  		// .style("top", (d3.event.pageY) - 100 + "px");

		  	});

		var labels = svg.selectAll("text")
			.data(json.features)
		  .enter().append("text")
		  	.text(function(d) {

		  		if (d.properties.abbrev == "VT") return null;
		  		if (d.properties.abbrev == "NH") return null;
		  		if (d.properties.abbrev == "MA") return null;
				if (d.properties.abbrev == "RI") return null;
				if (d.properties.abbrev == "CT") return null;					  		
				if (d.properties.abbrev == "DE") return null;
				if (d.properties.abbrev == "NJ") return null;
				if (d.properties.abbrev == "MD") return null;
				if (d.properties.abbrev == "DC") return null;

		  		return d.properties.abbrev;
		  	})
			.attr("x", function(d) {

				if (d.properties.abbrev == "LA") return path.centroid(d)[0] - 8;
				if (d.properties.abbrev == "FL") return path.centroid(d)[0] + 11;
				if (d.properties.abbrev == "MI") return path.centroid(d)[0] + 5;
				if (d.properties.abbrev == "CA") return path.centroid(d)[0] - 7;
				if (d.properties.abbrev == "KY") return path.centroid(d)[0] + 15;

				return path.centroid(d)[0];
			})
			.attr("y", function(d) {

				if (d.properties.abbrev == "MI") return path.centroid(d)[1] + 10;
				if (d.properties.abbrev == "TN") return path.centroid(d)[1] + 5;

				return path.centroid(d)[1];
			})
			.attr("text-anchor", "middle")
			.attr("fill", "white");

	});

});