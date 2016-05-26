// JavaScript source code
function start() {
	var input = '';
	var sequence = '';
	var beginIndex = 0;
	var i = 0;
	var arr = [];
	var output;
	var y;

	output = document.getElementById('input').value;
	input = output.toUpperCase();
	sequence = document.getElementById('sequence').value.toUpperCase();

	while (input.indexOf(sequence, beginIndex) != -1) {
		y = arr[i++] = input.indexOf(sequence, beginIndex);
		beginIndex = sequence.length + y;
	}

	var result = '';
	i = 0;
	for (var x = 0; x < arr.length; x++) {
		result += output.slice(i, arr[x]);
		i = sequence.length + arr[x];
	}
	result += output.slice(i, output.length);

	document.getElementById('output').innerHTML = result;
}