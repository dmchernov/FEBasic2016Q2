// JavaScript source code
var arr = [
	{
		"id": 0,
		"name": "повар 1",
		"email": "a@mail.ru",
		"count": 10,
		"price": 9999911111,
		"options": "radio",
		"radio": "option1",
		"check": ""
	},
	{
		"id": 1,
		"name": "Товар 2",
		"email": "b@mail.ru",
		"count": 40,
		"price": 5754622222.45,
		"options": "radio",
		"radio": "option2",
		"check": ""
	},
	{
		"id": 2,
		"name": "Товар 3",
		"email": "c@mail.ru",
		"count": 30,
		"price": 99933333,
		"options": "check",
		"radio": "",
		"check": [
			"option1",
			"option3",
			"option2"
		]
	}
];

var sortFlag = '';
var selectedArr = NaN;
var edit;

var errorName = '';
var errorEmail = '';
var errorPrice = '';
var errorCount = '';

var newId = 3;

var newPrice;

var reg = /.+@.+\..+/i;
var address;

;$(document).ready(function () {

	$(window).load(function () {
		setSortImage('null.png', '\#nameSort');
		$('\#nameSort img').on('click', countSort);

		setSortImage('null.png', '\#priceSort');
		$('\#priceSort img').on('click', priceSort);

		$('\#findButton').on('click', layout);

		layout();
	})

	$('#b1').on('click', function () {
		alert(arr[0].price);
	})

	//Клик на ссылку или кнопку Edit
	$('body').on('click', 'a, \.edit', (function (event) {
		event.preventDefault();
		modalReset();
		selectedArr = $(this).parents('tr').attr('id');

		//Заполнение полей модального окна
		for (var a = 0; a < arr.length; a++) {
			if (selectedArr == arr[a].id) {
				edit = a;

				$('#name').val(arr[a].name);
				$('#email').val(arr[a].email);
				newPrice = arr[a].price;
				$('#price').val(priceFormat(arr[a].price));
				$('#count').val(arr[a].count);

				//Пусто, радио или чекбоксы
				switch (arr[a].options) {
					case '':
						$('#options').prop('value', 'empty');
						$('#check').css('display', 'none');
						$('#radio').css('display', 'none');
						break;
					case 'radio':
						$('#options').prop('value', 'radio');
						$('#check').css('display', 'none');
						$('#radio').css('display', 'block');
						$('input[name=radio][value=' + arr[a].radio + ']').prop('checked', true);
						break;
					case 'check':
						$('#options').prop('value', 'check');
						$('#radio').css('display', 'none');
						$('#check').css('display', 'block');

						if (arr[a].check.length == 3) {
							$('#all').prop('checked', 'true');
						}
						$.each(arr[a].check, function (key, value) {
							$('#' + arr[a].check[key]).prop('checked', 'true');
						})
						break;
				}
				break;
			}
		}

		$('#addEdit').text('Edit');
		$('#addEdit').off('click');
		$('#addEdit').on('click', save);

		//Анимация открытия модального окна
		$('#overlay').fadeIn(400,
			function () {
				$('#modal')
					.css('display', 'block')
					.animate({ opacity: 1}, 200);
			});
		//--------------------------------------
		
	}));

	$('\#overlay').on('click', function() {
		modalClose();
		deleteModalClose();
	});
	$('#options').on('change', optionsChange);

	//Ввод в поле с количеством только чисел
	$('#count').on('keypress', function(e) {
		e = e || event;

		if (e.ctrlKey || e.shiftKey) return false;

		var ch = String.fromCharCode(e.keyCode || e.charCode);
		if (ch == null) return;

		if (ch < '0' || ch > '9') {
			return false;
		}
	})

	//Ввод в поле с ценой корректного значения
	$('#price').on('keypress', function(e) {
		e = e || event;

		if (e.ctrlKey || e.shiftKey) return false;

		var ch = String.fromCharCode(e.keyCode || e.charCode);
		if (ch == null) return;

		if (+ch >= 0 || +ch <= 9) {
			return true;
		} else if (ch == '.' && ($(this).val().indexOf('.') == -1)) {
			return true;
		} else return false;
	})

	//Запрет вставки в поле с количеством
	$('#count').on('paste', function(e) {
		return false;
	})

	//Потеря фокуса полем с именем
	$('#name').on('blur', function () {
		$('#name').val($.trim($('#name').val()));
		if ($('#name').val() == '') {
			$('#errorName').text('Invalid Name');
			$('#name').css('border', '2px solid red')
			errorName = 'Invalid Name \n';
		} else {
			$('#errorName').text('');
			$('#name').css('border', '');
			errorName = '';
		}
	})

	//Фокус на поле с ценой
	$('#price').on('focus', function() {
		$('#price').val(newPrice);
	})

	//Потеря фокуса полем с ценой
	$('#price').on('blur', function () {
		if ($.isNumeric($('#price').val())) {
			$('#errorPrice').text('');
			$('#price').css('border', '')
			errorPrice = '';
			newPrice = (+$('#price').val()).toFixed(2);
			$('#price').val(priceFormat(newPrice));
		} else {
			$('#errorPrice').text('Invalid Price');
			$('#price').css('border', '2px solid red');
			errorPrice = 'Invalid Price \n';
		}
	})

	//Потеря фокуса полем с Email
	$('#email').on('blur', function () {

		address = $('#email').val();
		if (reg.test(address) == false) {
			$('#errorEmail').text('Invalid Email');
			$('#email').css('border', '2px solid red')
			errorEmail = 'Invalid Email \n';
		} else {
			$('#errorEmail').text('');
			$('#email').css('border', '');
			errorEmail = '';
		}
	})

	//Потеря фокуса у поля с количеством
	$('#count').on('blur', function () {
		if (+$('#count').val() == 0) {
			$('#count').val(0);
		} else {
			$('#count').val(parseInt($(this).val()));
		}

		$('#errorCount').text('');
		$('#count').css('border', '');
		errorCount = '';
	})

	//Отметка всех чекбоксов при отметке All
	$('#all').on('change', function() {
		$('#option1').prop('checked', $(this).prop('checked'));
		$('#option2').prop('checked', $(this).prop('checked'));
		$('#option3').prop('checked', $(this).prop('checked'));
	})

	//Добавление товара
	$('#newButton').on('click', function () {

		modalReset();

		$('#overlay').fadeIn(400,
			function () {
				$('#modal')
					.css('display', 'block')
					.animate({ opacity: 1 }, 200);
			});

		$('#addEdit').off('click');
		$('#addEdit').text('Add');
		$('#addEdit').on('click', function () {

			if ($('#name').val() == '') {
				$('#errorName').text('Invalid Name');
				$('#name').css('border', '2px solid red')
				errorName = 'Invalid Name \n';
			}

			if (!$.isNumeric(newPrice) || $('#price').val() == '') {
				$('#errorPrice').text('Invalid Price');
				$('#price').css('border', '2px solid red');
				errorPrice = 'Invalid Price \n';
			}

			address = $('#email').val();
			if (reg.test(address) == false) {
				$('#errorEmail').text('Invalid Email');
				$('#email').css('border', '2px solid red')
				errorEmail = 'Invalid Email \n';
			}

			if ($('#count').val() == '') {
				$('#errorCount').text('Invalid Count');
				$('#count').css('border', '2px solid red');
				errorCount = 'Invalid Count \n';
			}

			if (errorName == '' && errorEmail == '' && errorPrice == '' && errorCount == '') {
				var y = {
					id: 0,
					name: '',
					price: '',
					email: '',
					count: 0,
					options: '',
					radio: '',
					check:''
				}
				arr.push(y);
				edit = arr.length - 1;
				arr[edit].id = newId++;
				save();
			} else {
				alert(errorName + errorEmail + errorCount + errorPrice);
				errorNavigate();
			}
			
		})
	})

	//Обработчик нажатия кнопки "Delete"
	$('body').on('click', '\.delete', function () {
		selectedArr = $(this).parents('tr').attr('id');

		$('#overlay').fadeIn(400,
			function () {
				$('#deleteModal')
					.css('display', 'block')
					.animate({ opacity: 1 }, 200);
			});
	});

	//Подтверждение удаления
	$('#deleteButton').on('click', function () {

		deleteItem();
		deleteModalClose();
		reLayout();
	});

	//Отмена удаления
	$('#cancelDeleteButton').on('click', deleteModalClose);
});

//Отрисовка таблицы
function layout() {
	$('\#tableBody').empty();

	$.each(arr, function (key, value) {
		//Если нет совпадений со строкой поиска, то пропустить этот элемент массива
		if((arr[key].name.toUpperCase()).indexOf($('\#findText').val().toUpperCase()) == -1) return true;
		//Добавление строки в таблицу
		$('\#tableBody').append('<tr>');
		//Установка id добавленной строке
		$('\#tableBody tr:last-child').attr('id', arr[key].id);

		var at = $('\#tableBody tr:last-child').attr('id');

		// Добавление ячейки с именем и количеством
		$('\#' + at).append('<td>');

		//Добавление ссылки в ячейку
		$('\#' + at + ' td:last-child').append('<a>');
		var link = $('\#' + at + ' td:last-child a');
		link.text(arr[key].name);
		link.attr('href', '\/');

		//Добавление количества товаров
		$('\#' + at + ' td:last-child').append('<span>');
		var span = $('\#' + at + ' td:last-child span');
		span.addClass('quantity');
		span.text(arr[key].count);

		//Добавление ячейки с ценой
		$('\#' + at).append('<td>');
		$('\#' + at + ' td:last-child').addClass('price');
		$('\#' + at + ' td:last-child').text(priceFormat(arr[key].price));

		//Добавление ячейки с кнопками
		$('\#' + at).append('<td>');
		//Кнопка "Edit"
		$('\#' + at + ' td:last-child').append('<button>');
		var b = $('\#' + at + ' td:last-child button');
		b.addClass('edit');
		b.text('Edit');
		//Кнопка "Delete"
		$('\#' + at + ' td:last-child').append('<button>');
		b = $('\#' + at + ' td:last-child button:last-child');
		b.addClass('delete');
		b.text('Delete');
	})
}

//Форматирование цены
function priceFormat(n) {
	var s = ",";
	var d = ".";
	n = n.toString();
	a = n.split(d);
	x = a[0];
	y = a[1];
	z = "";
	if (typeof (x) != "undefined") {
		for (i = x.length - 1; i >= 0; i--)
			z += x.charAt(i);
		z = z.replace(/(\d{3})/g, "$1" + s);
		if (z.slice(-s.length) == s)
			z = z.slice(0, -s.length);
		x = "";
		for (i = z.length - 1; i >= 0; i--)
			x += z.charAt(i);
		if (typeof (y) != "undefined" && y.length > 0)
			x += d + y;
	}
	return x + ' \$';
}

//Установка картинки сортировки
function setSortImage(path, sortId) {
	$(sortId).html('<img src=\"' + path + '\" \/>');
}

//Условие сортировки по количеству
function compareCount(a, b){
	if (a.count > b.count) return 1;
	if (a.count > b.count) return -1;
}

//Условие сортировки по цене
function comparePrice(a, b) {
	if (a.price > b.price) return 1;
	if (a.price > b.price) return -1;
}

//Сортировка по количеству
function countSort() {
	if (sortFlag == '' || sortFlag == 'p') {
		$('\#nameSort img').attr('src', 'asc.png');
		arr.sort(compareCount);
		$('\#priceSort img').attr('src', 'null.png');
	} else if(sortFlag == 'c'){
		if ($('\#nameSort img').attr('src') == 'asc.png') {
			$('\#nameSort img').attr('src', 'desc.png');
		} else {
			$('\#nameSort img').attr('src', 'asc.png');
		}
	arr.reverse(compareCount);
	}

	layout();
	sortFlag = 'c';
}

//Сортировка по цене
function priceSort() {
	if (sortFlag == '' || sortFlag == 'c') {
		$('\#priceSort img').attr('src', 'asc.png');
		arr.sort(comparePrice);
		$('\#nameSort img').attr('src', 'null.png');
	} else if (sortFlag == 'p') {
		if ($('\#priceSort img').attr('src') == 'asc.png') {
			$('\#priceSort img').attr('src', 'desc.png');
		} else {
			$('\#priceSort img').attr('src', 'asc.png');
		}
		arr.reverse(comparePrice);
	}

	layout();
	sortFlag = 'p';
}

//Закрытие модального окна без сохранения
function modalClose() {
	modalCloseAnimate();

	modalReset();
};

//Анимация закрытия модального окна
function modalCloseAnimate() {
	$('#modal').animate({ opacity: 0 }, 200, function () {
												$(this).css('display', 'none');
												$('#overlay').fadeOut(400);
											}
						);
}

//Сохранение изменений
function save() {
	if (errorName != '' || errorEmail != '' || errorPrice != '' || errorCount != '') {
		alert(errorName + errorEmail + errorPrice + errorCount);
		errorNavigate();
	} else {
		
		arr[edit].name = $('#name').val();
		arr[edit].email = $('#email').val();
		arr[edit].price = newPrice;
		arr[edit].count = $('#count').val();

		if ($('#options').prop('value') == 'empty') {
			arr[edit].options = '';
			arr[edit].radio = '';
			arr[edit].check = '';
		} else if ($('#options').prop('value') == 'radio') {
			arr[edit].options = 'radio';
			arr[edit].radio = $('input [type=radio] [selected=true]').val();
		} else {
			arr[edit].options = 'check';
			arr[edit].radio = '';
			arr[edit].check = [];
			for (var i = 1; i <= 3; i++) {
				if ($('#option' + i).prop('checked') == true) {
					arr[edit].check.push('option' + i);
				}
			}
		}

		reLayout();
		modalCloseAnimate();
	}
}

//Изменение видимости чекбоксов и радиокнопок в модальном окне
function optionsChange() {
	if ($('#options').prop('value') == 'empty') {
		$('#check').css('display', 'none');
		$('#radio').css('display', 'none');
	} else if ($('#options').prop('value') == 'radio') {
		$('#check').css('display', 'none');
		$('#radio').css('display', 'block');
	} else {
		$('#check').css('display', 'block');
		$('#radio').css('display', 'none');
	}
}

//Удаление товара
function deleteItem() {

	for (var a = 0; a < arr.length; a++) {
		if (selectedArr == arr[a].id) {
			arr.splice(a, 1);
		}
	}
}

//Reset модального окна правки/добавления
function modalReset() {

	$('#name').val('');
	$('#email').val('');
	$('#count').val('');
	$('#price').val('');

	errorEmail = errorName = errorPrice = errorCount = '';

	$('#errorPrice').text('');
	$('#price').css('border', '');

	$('#errorName').text('');
	$('#name').css('border', '');

	$('#errorEmail').text('');
	$('#email').css('border', '');

	$('#errorCount').text('');
	$('#count').css('border', '');

	$('#options').prop('value', 'empty');
	$('#check').css('display', 'none');
	$('#radio').css('display', 'none');

	newPrice = 0;
	address = '';
}

//Закрытие окна удаления
function deleteModalClose() {
	$('#deleteModal').animate({ opacity: 0 }, 200, function () {
		$('#deleteModal').css('display', 'none');
		$('#overlay').fadeOut(400);
	}
						);
}

//Reset сортировки
function sortReset() {

	setSortImage('null.png', '\#nameSort');
	setSortImage('null.png', '\#priceSort');

	$('\#nameSort img').off('click');
	$('\#priceSort img').off('click');


	$('\#nameSort img').on('click', countSort);
	$('\#priceSort img').on('click', priceSort);

	sortFlag = '';
}

//Перерисовка таблицы
function reLayout() {
	sortReset();
	layout();
}

//Переход к первому полю с неверными данными
function errorNavigate() {
	if (errorName != '') {
		$('#name').focus();
		return true;
	}
	if (errorEmail != '') {
		$('#email').focus();
		return true;
	}
	if (errorCount != '') {
		$('#count').focus();
		return true;
	}
	if (errorPrice != '') {
		$('#price').focus();
		return true;
	}
}