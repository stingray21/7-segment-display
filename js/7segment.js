console.log('7 Segment Display');



var width = 600;
var height = 200;

var su = 10; //segment unit
// one digit 10 su * 18 su
var segment_stroke = 2;
var segment_length = 6*su;
var segment_width = 2*su;

var digit_width = 12*su;
var digit_height = 20*su;

var seg_x = segment_length/2 ;
var seg_x_mid = segment_length/2 + su - segment_stroke;
var seg_y = segment_width/2 - segment_stroke;
var seg_y_mid = 0;

var segments = [
	{"x":5*su, "y":1*su, "r": 0},
	{"x":9*su, "y":5*su, "r": 1},
	{"x":9*su, "y":13*su, "r": 1},
	{"x":5*su, "y":17*su, "r": 0},
	{"x":1*su, "y":13*su, "r": 1},
	{"x":1*su, "y":5*su, "r": 1},
	{"x":5*su, "y":9*su, "r": 0},
	];

var digits={
	0: [1, 1, 1, 1, 1, 1, 0],
	1: [0, 1, 1, 0, 0, 0, 0],
	2: [1, 1, 0, 1, 1, 0, 1],
	3: [1, 1, 1, 1, 0, 0, 1],
	4: [0, 1, 1, 0, 0, 1, 1],
	5: [1, 0, 1, 1, 0, 1, 1],
	6: [1, 0, 1, 1, 1, 1, 1],
	7: [1, 1, 1, 0, 0, 0, 0],
	8: [1, 1, 1, 1, 1, 1, 1],
	9: [1, 1, 1, 0, 0, 1, 1],
	'-': [0, 0, 0, 0, 0, 0, 1],
	' ': [0, 0, 0, 0, 0, 0, 0],
	};

var segment = [
	{"x":-seg_x, "y":-seg_y},
	{"x":seg_x, "y":-seg_y},
	{"x":seg_x_mid, "y": seg_y_mid},
	{"x":seg_x, "y":seg_y},
	{"x":-seg_x, "y":seg_y},
	{"x":-seg_x_mid, "y": seg_y_mid},
	{"x":-seg_x, "y":-seg_y},
	];

var segment2 = [
	{"x":-seg_x, "y":-seg_y},
	{"x":seg_x, "y":-seg_y},
	{"x":seg_x, "y":seg_y},
	{"x":-seg_x, "y":seg_y},
	{"x":-seg_x, "y":-seg_y},
	];

var display_digits = [
	{"x": su, 		"y": su },
	{"x": 1*digit_width+su, 	"y": su },
	{"x": 2.5*digit_width+su, 	"y": su },
	{"x": 3.5*digit_width+su, 	"y": su },
	];
var svg;
document.addEventListener("DOMContentLoaded", function(event) {
	console.log("DOM fully loaded and parsed");

	svg = d3.select("#display")
		.append("svg:svg")
		.attr("width", width+"px")
		.attr("height", height+"px");

	var digit_box;
	var digit = [];

	digit_box = svg.append("g");

	digit_box.append("rect")
		.attr("width", 4.5*digit_width+"px")
		.attr("height", digit_height+"px")
		.style("fill", "black");

	test = digit_box.selectAll("g").data(display_digits)
	.enter().append("g")
	.attr("transform", function(d) {
		// console.log(d);
		return "translate(" + d.x + "," + d.y + ")";
	})
	.attr("class", function(d, i) {
		// console.log(d, i);
		return "digits number_" + i;
	})
	.selectAll(".segment").data(segments)
	.enter().append("g")
	.attr("class", "segment")
	.attr("transform", function(d) {
		var trans = "translate(" + d.x + "," + d.y + ")";
		trans += (d.r) ? ", rotate(90)" : "";
		return trans;
	});

	initializeTestDisplay(segments, segment);
	// initializeAwayDisplay(segments, segment);
	
	
	console.log(test);
	
	var num = 590;
	countUp(test, num);
}); //DOMContentLoaded


function countUp (digit, num) {
	// console.log('Show '+ num);
	var updateInterval = 1;
	var max = 900;
	
	if (num <= max) {
		setDigits(digit, num);
		setTimeout(countUp, updateInterval*1000, digit, ++num);
	} 
}


function setDigits (digit, num) {
	// console.log('Set to: '+ num);
	var min = ~~(num / 60);
	var sec = ('00' + ~~(num % 60)).substr(-2);
	// console.log('Set to: ' + min + ":" + sec + ' (' + num + ' sec)');

	var digit_num = [];
	digit_num[0] = ('0' + min).substr(-2,1);
	digit_num[1] = ('0' + min).substr(-1);

	digit_num[2] = ('0' + sec).substr(-2,1);
	digit_num[3] = ('0' + sec).substr(-1);
	
	// console.log(digit_num);

	digit_num.forEach( function (d,i) {
		svg.selectAll(".number_"+i).selectAll(".segment").data(function () {
			if (i == 0 && d == 0) return digits[' '];
			// console.log(digits[d]);
			return digits[d];
			})
			.classed("seg-on", function(d) {
				return d;
				});
	});

}

function changeGym (gym) {
	if (gym == 'away') {
		oldGym = 'home';
		initializeAwayDisplay(segments, segment);
	} else {
		oldGym = 'away';
		initializeHomeDisplay(segments, segment);
	}
	
	console.log(gym, oldGym);
	document.getElementById('display').classList.remove(oldGym);
	document.getElementById('display').classList.add(gym);

	segments_on = document.getElementsByClassName('segment');
	console.log(segments_on.length, segments_on);
	for (let i = 0; i < segments_on.length; i++) {
		segments_on[i].classList.remove('hidden');
	}
}

function initializeHomeDisplay(segments, segment) {
	svg.selectAll(".segment").selectAll("*").remove();
	svg.selectAll(".segment").append("polygon")
	.attr("points", function() {
		return segment.map(function(d) {
			return [d.x,d.y].join(",");
		}).join(" ");
	})
	.style("stroke-width", segment_stroke);
}

function initializeAwayDisplay(segments, segment) {
	svg.selectAll(".segment").selectAll("*").remove();
	svg.selectAll(".segment").append("g")
	.selectAll("circle").data([-4,-3,-2,-1,0,1,2,3,4])
	.enter().append("circle")
	.attr("cx", function (d) {
		return d*su/1.25;
	})
	.attr("cy", 0)
	.attr("r", su/4);
}

function initializeTestDisplay(segments, segment) {
	svg.selectAll(".segment").selectAll("*").remove();
	svg.selectAll(".segment").append("polygon")
	.attr("points", function() {
		return segment2.map(function(d) {
			return [d.x,d.y].join(",");
		}).join(" ");
	})
	.style("stroke-width", segment_stroke);
}