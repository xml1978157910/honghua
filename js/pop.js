/**
 * 定义参数
 */
function Pop() {
	this._time = 3;
	this._countDown = null;
	this._pop = $('.pop');
	this._prompt = $('.prompt');
	this._title = $('#pop_title');
	this._content = $('#pop_body');
	this._btnClick = $('#pop_checkTos');
	this._x = $('#pop_dtgb');
	this._obj = {};

	// 是否空校验 空：true，非空：false
	this._isEmty = function(val) {
		if ($.trim(val) == '') {
			return true;
		}
		return false;
	};
}

Pop.prototype = {
	/**
	 * 弹窗提示框
	 * 
	 * @param content
	 *            弹窗提示框内容主体
	 * @param title
	 *            弹窗提示框标题
	 * @param callBack
	 *            弹窗提示框确定按钮回调方法
	 */
	show : function(isCountDown, content, title, callBack, obj) {
		var _this = this;
		clearInterval(_this._countDown);
		_this._obj = obj;
		_this._btnClick.html("确定");
		_this._content.html(content);
		if (!_this._isEmty(title)) {
			_this._title.html(title);
		} else {
			_this._title.html("提示");
		}
		_this._btnClick.click(function() {
			if (typeof(callBack) == 'function') {
				callBack(obj);
			}
			_this._pop.hide();
		});
		_this._x.click(function() {
			if (typeof(callBack) == 'function') {
				callBack(obj);
			}
			_this._pop.hide();
		});
		if (isCountDown == "Y") {
			_this._time = 3;
			_this._btnClick.html("确定（" + _this._time + "秒）");
			_this._countDown = setInterval('pop.hide(' + callBack + ')', 1000);
		}
		_this._pop.show();
	},
	hide : function(callBack) {
		var _this = this;
		if (_this._time > 0) {
			_this._time--;
			_this._btnClick.html("确定（" + _this._time + "秒）")
		} else {
			clearInterval(_this._countDown);
			if (typeof(callBack) == 'function') {
				callBack(_this._obj);
			}
			_this._pop.hide();
		}
	}
}

/**
 * @name 创建实体类
 */
pop = new Pop();