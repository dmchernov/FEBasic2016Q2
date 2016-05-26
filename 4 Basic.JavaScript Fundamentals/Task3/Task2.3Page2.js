// JavaScript source code
var timer = 10;
var clear;
window.onload = Timer;
function showTimer() {
	document.getElementById('timer').innerText = (timer--).toString();
	if (timer == 0) {
		forward();
	}
}

function Timer() {
	clear = setInterval(showTimer, 1000);
}
function forward() {
	document.location.href = "HTMLPage3.html";
}

function StopTimer() {
	clearInterval(clear);
	timer = 10;
}