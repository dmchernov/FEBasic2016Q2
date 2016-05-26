// JavaScript source code
var colorString = '';
var textString = '';
var marker = '';
var currentSelectedLi;
var previousSelectedLi;

function create() {
	var newLi = document.createElement('li');

	colorString = document.getElementById('color').value;
	textString = document.getElementById('text').value;
	marker = document.getElementById('marker').value;

	newLi.style.color = colorString;
	newLi.innerText = textString;
	newLi.style.listStyleType = marker;

	newLi.onclick = select;

	document.getElementById('list').appendChild(newLi);
}

function change() {
	if (currentSelectedLi == null) {
		alert('Элемент не выбран!');
	} else {
	currentSelectedLi.style.color = document.getElementById('color').value;
	currentSelectedLi.innerText = document.getElementById('text').value;
	currentSelectedLi.style.listStyleType = document.getElementById('marker').value;
	}
}

function removeLi() {
	if (currentSelectedLi == null) {
		alert('Элемент не выбран!');
	} else {
		document.getElementById('list').removeChild(currentSelectedLi);
		currentSelectedLi = null;
	}
}

function select() {
	if (currentSelectedLi != null) {
		currentSelectedLi.style.borderWidth = '';
		currentSelectedLi.style.borderColor = '';
		currentSelectedLi.style.borderStyle = '';
	}
	currentSelectedLi = event.currentTarget;

	document.getElementById('color').value = currentSelectedLi.style.color;
	document.getElementById('text').value = currentSelectedLi.innerText;
	document.getElementById('marker').value = currentSelectedLi.style.listStyleType;

	currentSelectedLi.style.borderWidth = '2px';
	currentSelectedLi.style.borderColor = 'blue';
	currentSelectedLi.style.borderStyle = 'solid';

	event.stopPropagation();
}