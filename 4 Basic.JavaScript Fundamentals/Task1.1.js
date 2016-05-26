// JavaScript source code
var output = '';
var intermediateResult;
var result = 0;
var newLine = "<br />";
var inputString = '';
var reg = /(\d+\.*\d*)([^0123456789\.\-\+\/\*=]*)(-|\+|\*|\/|=)/g;
var previousOperator = '';
var ifString = /=$/gm;

function save() {
	inputString = document.getElementById("inputString").value;
	
	document.getElementById("inputString2").innerHTML = output = '';
	intermediateResult = reg.exec(inputString);
	result = 0;
	previousOperator = '';
	comp.onclick = compute;
}
function compute() {
	result = +RegExp.$1;
		while (intermediateResult != null) {
			output += intermediateResult[1] + newLine;
			output += intermediateResult[3] + newLine;

			switch (previousOperator) {
				case '-':
					result -= RegExp.$1;
					break;
				case '+':
					result += +RegExp.$1;
					break;
				case '*':
					result *= RegExp.$1;
					break;
				case '/':
					result /= RegExp.$1;
					break;
				default:
					result = result;
			}
			previousOperator = RegExp.$3;
			intermediateResult = reg.exec(inputString);
		}

	document.getElementById("inputString2").innerHTML = output + newLine + result.toFixed(2);
}