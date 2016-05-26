// JavaScript source code
window.onload = function() {
	var a = confirm('на первую страницу - OK, закрыть окно - Cancel');
	if (a) {
		document.location.href = "HTMLPage1.html";
	} else {
		this.window.close();
	}
	if (!window.closed) {
		alert('Окно не может быть закрыто');
	}
}