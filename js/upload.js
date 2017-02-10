/**
 * 文件上传
 * @param obj 上传文件对象
 * @param tpye 上传文件大类别
 * @param flag 回写图片id
 * @param clinicDoc 诊所医生分类
 */
function upload(obj, type, flag, clinicDoc) {
	var $this = $('#' + flag);
	$this.parent().removeClass("txt-error");
	if (validateUploadTypeFail(obj)) {
		pop.show("N", "请上传图片格式的文件！", "上传失败");
		return;
	}
	if (validateUploadSizeFail(obj)) {
		pop.show("N", "附件不能大于4M！", "上传失败");
		return;
	}
	$.layer({
		type : 3,
		border : [ 0 ],
		bgColor : ''
	});
	$.ajaxFileUpload({
    	url : '/upload/uploadPic.do?dbid=' + dbid + '&clinicDoc=' + clinicDoc + '&type=' + type + '&flag=' + flag + '&r=' + Math.random(),
        secureuri:false, 
        fileElementId:$(obj).attr("id"),
        dataType: 'json', 
        success: function (data) {
            if(typeof(data.result) != 'undefined'){
            	if(""!=data.result && data.result=='success'){
            		if (clinicDoc == 'clinicPic' && type == 'authorize') {
            			$('#' + flag).attr('href',
        						pictureHttpPath + 'clinic/temp/' + clinicDoc + '/' + dbid.substring(0, 1)
        						+ '/' + dbid + '/' + type + '/'
        						+ data.picUrl);
                    	$('#' + flag).removeAttr('disabled style');
                    	$('#' + flag).html('已上传查看');
                    	pop.show('Y', '上传成功', '提示');
            		} else if(type == 'cer' && clinicDoc=="clinicPic"){
            			$('#' + flag).attr('src',
        						pictureHttpPath + 'clinic/temp/' + clinicDoc + '/' + dbid.substring(0, 1)
        						+ '/' + dbid + '/' + type + '/'
        						+ data.picUrl);
            			$('#' + flag).show();
            			$('#' + flag).parent().find('i').show();
            		} else if(type == 'license' && clinicDoc=="doctor"){
            			$('#' + flag).attr('src',
            					pictureHttpPath + 'clinic/temp/' + clinicDoc + '/' + dbid.substring(0, 1)
            					+ '/' + dbid + '/' + type + '/'
            					+ data.picUrl);
            			$('#' + flag).show();
            			$('#' + flag).parent().find('a').show();
            			
            			var eleId = $(obj).attr('eleId');
            			var totalCount = $('.'+eleId).length;
            			if(totalCount <5){
            				var picIndex = parseInt($(obj).attr('index'))+1;
            				if( totalCount == picIndex){
            					var _this = doctor;
            					doctor._doctorPhotoAdd(obj,eleId,picIndex);
            				}
            			}
            		} else if((type == 'license' || type == 'photo') && (clinicDoc=="clinicPic" || clinicDoc=="headPic") && flag.indexOf('Register') >= 0){
            			$('#' + flag).attr('src',
        						pictureHttpPath + 'clinic/temp/' + clinicDoc + '/' + dbid.substring(0, 1)
        						+ '/' + dbid + '/' + type + '/'
        						+ data.picUrl);
            			$('#' + flag).parent().find('a').addClass('done');
            		} else {
            			var imgSrc = pictureHttpPath + 'clinic/temp/' + clinicDoc + '/' + dbid.substring(0, 1) + '/' + dbid + '/' + type + '/' + data.picUrl;
            			var doctorPhotoHidden =  $('#doctorPhotoHidden');
            			if(doctorPhotoHidden){
            				$('#doctorPhotoHidden').val(imgSrc);
            				$('#upload').on('change', function() {
            					upload($(this),'photo','doctorPhoto','doctor');
            					doctor._changeFile(this);
            				});
            				
            			}
            				
            			$('#' + flag).attr('src', imgSrc);
            			$('#' + flag).show();
            			$('#' + flag).parent().find('a').show();
            			if (clinicDoc == 'clinicPic' && type == 'photo' && flag.indexOf('clinicOther') >= 0) {
            				var _this = clinic;
            				_this._otherPhotoAdd(flag);
            			}
            			if(clinicDoc == 'iconPic'){
            				$('.click-up').hide();
            			}
            		}
            	}else{
            		pop.show("N", data.reason, "上传失败");
            	}
           }
        },complete:function(xml, status){
        	layer.closeAll('loading');
        	pop.hide();
			if(status=="error"){
				if(/413 Request Entity Too Large/i.test(xml.responseText)){
					pop.show("N", "附件不能大于4M！", "上传失败");
				}else{
					pop.show("N", "文件上传异常！", "上传失败");
				}
				
			}
        }
    });
}

/**
 * 校验文件类型
 * @param obj
 * @returns {Boolean}
 */
function validateUploadTypeFail(obj) {
	var filetypes = [ ".gif", ".jpg", ".png", ".pdf", ".bmp", ".jpeg" ];
	var filepath = obj.value;
	// 文件类型
	if (filepath) {
		var isnext = false;
		var fileend = filepath.substring(filepath.lastIndexOf("."));
		if (filetypes && filetypes.length > 0) {
			for (var i = 0; i < filetypes.length; i++) {
				if (filetypes[i] == fileend.toLowerCase()) {
					isnext = true;
					break;
				}
			}
		}
		if (!isnext) {
			return true;
		}
	}
	return false;
}

/**
 * 校验文件大小
 * @param obj
 * @returns {Boolean}
 */
function validateUploadSizeFail(obj) {
	try {
		var filemaxsize = 1024 * 4; //4M 
		var fileSize = 0;
		if (userBrowser() && !obj.files) {
			var filePath = obj.value;
			var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
			var file = fileSystem.GetFile(filePath);
			fileSize = file.Size;
		} else {
			fileSize = obj.files[0].size;
		}
		var size = fileSize / 1024;
		if (size > filemaxsize) {
			return true;
		}
	} catch (e) {
		return false;
	}
	return false;
}

function userBrowser() {
	var browserName = navigator.userAgent.toLowerCase();
	if (/msie/i.test(browserName) && !/opera/.test(browserName)) {
		return "ie";
	} else if (/firefox/i.test(browserName)) {
		return "firefox";
	} else if (/chrome/i.test(browserName) && /webkit/i.test(browserName)
			&& /mozilla/i.test(browserName)) {
		return "chrome";
	} else if (/opera/i.test(browserName)) {
		return "opera";
	} else if (/webkit/i.test(browserName)
			&& !(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i
					.test(browserName))) {
		return "safari";
	} else {
		return "unKnow";
	}
}