function onlyNum(obj) {
	/* delete backspace left right */
	if (event.shiftKey == 1) {
		event.returnValue = false;
	} else {
		if (!(event.keyCode == 46) && !(event.keyCode == 8)
				&& !(event.keyCode == 37) && !(event.keyCode == 39)) {
			if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
				event.returnValue = false;
			}
		}
	}
}

function onlyNumkeyup(obj) {
	if (event.shiftKey == 1) {
		event.returnValue = false;
	} else {
		if (!(event.keyCode == 46) && !(event.keyCode == 8)
				&& !(event.keyCode == 37) && !(event.keyCode == 39)) {
			if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
				obj.value = obj.value.replace(/\D/g, '');
				event.returnValue = false;
			}
		}
	}
}

function onlyFloat(obj) {
	/* delete backspace left right */
	if (event.shiftKey == 1) {
		event.returnValue = false;
	} else {
		if (!(event.keyCode == 46) && !(event.keyCode == 8)
				&& !(event.keyCode == 37) && !(event.keyCode == 39)) {
			if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
				if (event.keyCode == 110 || event.keyCode == 190) {
					if (obj.value.indexOf('.') >= 0) {
						event.returnValue = false;
					}
				} else {
					event.returnValue = false;
				}
			}
		}
	}
}

function onlyFloatkeyup(obj) {
	if (event.shiftKey == 1) {
		event.returnValue = false;
	} else {
		if (!(event.keyCode == 46) && !(event.keyCode == 8)
				&& !(event.keyCode == 37) && !(event.keyCode == 39)) {
			if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
				if (event.keyCode == 110 || event.keyCode == 190) {
					if (obj.value.indexOf('.') >= 0) {
						event.returnValue = false;
					}
				} else {
					event.returnValue = false;
				}
			}
		}
	}
}

$(document).ready(function() {
	$(".onlyNum").bind({
		change : function() {
			onlyNum();
		},
		keydown : function() {
			onlyNum($(this).get(0));
		},
		keyup : function() {
			onlyNumkeyup($(this).get(0));
		},
		paste : function() {
			return false;
		},
		dragenter : function() {
			return false;
		},
		contextmenu : function() {
			return false;
		}
	}).css("imeMode", "disabled");

	$(".onlyFloat").bind({
		change : function() {
			onlyFloat();
		},
		keydown : function() {
			onlyFloat($(this).get(0));
		},
		keyup : function() {
			onlyFloatkeyup($(this).get(0));
		},
		paste : function() {
			return false;
		},
		dragenter : function() {
			return false;
		},
		contextmenu : function() {
			return false;
		}
	}).css("imeMode", "disabled");
});