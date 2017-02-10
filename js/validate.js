/**
 * 校验和获取数据
 * @param .clinicData 	opts.dataCss
 * @param unitType		opts.unitType
 * @param .must-fill	opts.requireCss
 * @param .txt-error	opts.errorCss
 * @param isGetData	默认值为validateClinic的第一个参数，具体到每个控件时，则可以在控件中添加该属性。
 * 					如果过false，则当前控件不获取但校验，如果不写默认为true
 */

$.fn.extend({ 
	validateClinic : function(isGetData,opts){
		opts = $.getOptsParms(opts); //将新的参数传入opts，如果没有新参数，则用默认参数
//		console.log(opts); 
		var _form = {};
		_form.resultFlg = true;//判断校验的结果，如果为false，则给错误控件加上错误样式，并且不做任何事
		
		this.find('.' + opts.dataCss).each(function(){
			
			//
			if($(this).attr('isGetData') == false || $(this).attr('isGetData') == 'false') 
				isGetData = false;
			else 
				isGetData = true;
			
			$.getFormAndValidateMustFill($(this),opts,isGetData,_form);
		});
		
		return _form;
	}
});


$.extend({
	getFormAndValidateMustFill : function(obj,opts,isGetData,_form){
		if($(obj).attr(opts.unitType)=='input' && opts.hasInput){
			
			_form = $.putInputDataInForm(obj,isGetData,_form,opts);
		}else if($(obj).attr(opts.unitType)=='select' && opts.hasSelect){
			
			_form = $.putSelectDataInForm(obj,isGetData,_form,opts);
		}else if($(obj).attr(opts.unitType)=='radio' && opts.hasRadio){
			
			_form = $.putRadioDataInForm(obj,isGetData,_form,opts);
		}else if($(obj).attr(opts.unitType)=='span' && opts.hasSpan){
			
			_form = $.putSpanDataInForm(obj,isGetData,_form,opts);
		}else if($(obj).attr(opts.unitType)=='img' && opts.hasImg){
			
			_form = $.putImgPathInForm(obj,isGetData,_form,opts);
		}else if($(obj).attr(opts.unitType)=='textarea' && opts.hasTextarea){
			
			_form = $.putTextareaDataInForm(obj,isGetData,_form,opts);
		}else if($(obj).attr(opts.unitType)=='label' && opts.hasLabel){
		
			_form = $.putLabelDataInForm(obj,isGetData,_form,opts);
		}
	},
	putInputDataInForm : function(obj,isGetData,form,opts){
		//校验必输
		if($(obj).hasClass(opts.requireCss) && $(obj).val() == ''){
			form.resultFlg = false;
			$(obj).addClass(opts.errorCss);
		}
		//校验格式
		if(form.resultFlg) form = $.validateFormat(obj,opts,form);
		
		//取值
		if(isGetData && $(obj).val() != null){
			var valTemp = $(obj).val();
			if($(obj).hasClass('onlyNum')){
				valTemp = parseInt(valTemp);
			}
			if($(obj).hasClass('onlyFloat')){
				valTemp = parseFloat(valTemp);
			}
			form[$(obj).attr('name')] = $(obj).val();
		}
		
		return form;
	},
	putSelectDataInForm : function(obj,isGetData,form,opts){
		var selectVal = $(obj).find('option:selected').val();
		//校验
		if($(obj).hasClass(opts.requireCss) && selectVal == ''){
			form.resultFlg = false;
			$(obj).addClass(opts.errorCss);
		}
		//取值
		if(isGetData && selectVal != null){
			form[$(obj).attr('name')] = selectVal;
		}
		return form;
	},
	putRadioDataInForm : function(obj,isGetData,form,opts){
		/**如果是raido，那么取到的一定是raido的父控件，在父控件中设置必输或者取数的属性*/
		
		var radioVal = ''; 
		$(obj).find('input[type=radio]').each(function(){
			if($(this).prop('checked')) radioVal = $(this).attr('value');
		});
		
		//校验
		if($(obj).hasClass(opts.requireCss) && radioVal == ''){
			form.resultFlg = false;
			$(obj).addClass(opts.errorCss);
		}
		//取值
		if(isGetData && radioVal != null){
			form[$(obj).attr('name')] = radioVal;
		}
		return form;
	},
	putSpanDataInForm : function(obj,isGetData,form,opts){
		//校验
		if($(obj).hasClass(opts.requireCss) && $(obj).text() == ''){
			form.resultFlg = false;
			$(obj).addClass(opts.errorCss);
		}
		
		//取值
		if(isGetData && $(obj).text() != null){
			form[$(obj).attr('name')] = $(obj).text();
		}
		return form;
	},
	putImgPathInForm : function(obj,isGetData,form,opts){
		//校验
		if($(obj).hasClass(opts.requireCss) && !$(obj).attr('src')){
			form.resultFlg = false;
			$(obj).parent().addClass(opts.errorCss);
		}
		//取值
		if(isGetData && $(obj).attr('src') != null){
			var src = $(obj).attr('src');
			//http://localhost:8080/resources/images/clinic/temp/headqutersPic/_/_abcdefg-hijk-lmno-pqrs-tuvwxyz12345/license/enterpriseImg74760662.jpg
			src = src.replace(pictureHttpPath,'');
			form[$(obj).attr('name')] = src;
		}
		
		return form;
	},
	putTextareaDataInForm : function(obj,isGetData,form,opts){
		//校验必输
		//console.log($(obj).val());
		if($(obj).hasClass(opts.requireCss) && !$(obj).val()){
			form.resultFlg = false;
			$(obj).addClass(opts.errorCss);
		}
		//取值
		if(isGetData && $(obj).val() != null ){
			form[$(obj).attr('name')] = $(obj).val();
		}
		
		return form;
	},
	putLabelDataInForm : function(obj,isGetData,form,opts){
		//取值
		if(isGetData){
			var ret = '';
			var index = 0;
			$(obj).find('span').each(function(){
				
				if($(this).hasClass('cur')){
					if(index == 0){
						ret = $(this).html();
					}else{
						ret = ret + ',' + $(this).html();
					}
					index ++;
				} 
			});
			
			if(ret != '') form[$(obj).attr('name')] = ret;
		}
		
		return form;
	},
	validateFormat	: function(obj,opts,form){
		if($(obj).attr(opts.validateType)=='mobilePhone'){
			 if(!opts.rexMobilePhone.test($(obj).val())){
				 opts.validateCallBack(obj);
				 form.resultFlg = false;
			 }
			 
		}else if($(obj).attr(opts.validateType)=='userName'){
			if(!opts.rexUserName.test($(obj).val())){
				 opts.validateCallBack(obj);
				 form.resultFlg = false;
			}
		}else if($(obj).attr(opts.validateType)=='password'){
			if(!opts.rexPassword.test($(obj).val())){
				 opts.validateCallBack(obj);
				 form.resultFlg = false;
			}
		}else if($(obj).attr(opts.validateType)=='repeatPwd'){
			var origPhone = $(obj).parents('ul').find('input[name=password]').val();
			var repeatPhone = $(obj).val();
			if(origPhone != repeatPhone){
				opts.validateCallBack(obj);
				form.resultFlg = false;
			}
		}else if($(obj).attr(opts.validateType)=='fixPhone'){
			
		}else if($(obj).attr(opts.validateType)=='email'){
			if($(obj).val() && !opts.rexEmail.test($(obj).val())){
				 opts.validateCallBack(obj);
				 form.resultFlg = false;
			}
		}
//		else if($(obj).attr(opts.validateType)=='netAddress'){
//			if(!opts.rexNet.test($(obj).val())){
//				 opts.validateCallBack(obj);
//				 form.resultFlg = false;
//			}
//		}
		
		return form;
	},
	getOptsParms : function(opts){
		var ret = {};
		var defaultOpts = {
				result		: 	false,
				unitAry 	: 	new Array(),
				dataCss		:	'clinicData',	//需要获取/校验的控件加入的样式
				unitType	:	'unittype',		//给需要获取/校验的控件定义类型
				validateType:	'validatetype',	//给需要获取/校验的控件定义校验类型，手机格式，邮件格式等
				requireCss	:	'must-fill',	//默认必输样式，控件中加入这个便会进行必输校验
				errorCss	:	'txt-error',	//默认错误样式
				rexMobilePhone	: /^1[34578][0-9]{9}$/,
				rexUserName	:	/^[a-zA-Z0-9_]{6,16}$/,
				rexPassword		:	/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/,
				rexEmail	:	/^\s*[0-9A-Za-z][_.0-9A-Za-z-]{0,31}@([0-9a-z][0-9a-z-]{0,30}\.){1,4}[a-z]{2,4}\s*$/,
//				rexNet		:	/[a-zA-z]+:\/\/[^s]*/,
				hasInput	:	false,	//是否需要获取/校验 input中的数据
				hasSelect	:	false,	//是否需要获取/校验 select中的数据
				hasRadio	:	false,	//是否需要获取/校验 radio中的数据
				hasSpan		:	false,	//是否需要获取/校验 span中的数据
				hasImg		: 	false,	//是否需要获取/校验 img中的数据
				hasTextarea	:	false,
				hasLabel	:	false,
				validateCallBack : function(){return false;},//校验失败后需要调用的函数
				callBack	: function(){return false}//默认回调函数
		}
		
		$.extend(defaultOpts,opts);
		
		if(defaultOpts.unitAry.length){
			defaultOpts.unitAry.forEach(function(content,index){
				if(content == 'input') defaultOpts.hasInput = true;
				else if(content == 'select') defaultOpts.hasSelect = true;
				else if(content == 'radio') defaultOpts.hasRadio = true;
				else if(content == 'span') defaultOpts.hasSpan = true;
				else if(content == 'img') defaultOpts.hasImg = true;
				else if(content == 'textarea') defaultOpts.hasTextarea = true;
				else if(content == 'label') defaultOpts.hasLabel = true;
			});
		}
		
		
		return defaultOpts;
		
	},
	axse : function(url, data, successfn, errorfn) {
        data = (data==null || data=="" || typeof(data)=="undefined")? {"date": new Date().getTime()} : data;
        $.ajax({
            type: "post",
            data: data,
            url: url,
            dataType: "json",
            success: function(d){
                successfn(d);
            },
            error: function(e){
                errorfn(e);
            }
        });
    }

});

	
	