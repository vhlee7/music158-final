var uid = Date.now();
var ws = new WebSocket("ws://localhost:7474");
const Max = require("max-api");

var x = 0;
var y = 0;
var holdlen = 0.0;
var hold = false;
let timer;

ws.onopen = function (event) {
	console.log("sending data...");
	ws.send("Ready, willing and able!");
};

ws.onmessage = function (event) {
	let e = JSON.parse(event.data);

	// stuff with data
};

$(window).on("click", function () {

    ws.send("hi");
});

// Managing the interaction

$(window).on("beforeunload", function () {
	ws.close();
});

$(window).on("click", function(e) {
	hold = true;
	x = e.pageX;
	y = e.pageY;
	touch();
});

function touch() {
	var coords = document.getElementById("coords");
	coords.innerHTML = "x: " + clickx + " y: " + clicky;
}

