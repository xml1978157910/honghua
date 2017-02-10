/**
 * @project 登录Register.js
 * @version 1.0
 * @author Kimi
 * @date 2016-3-9
 */
;
(function($) {
	/**
	 * @name 类构造函数
	 * @description 定义类常亮、变量、方法
	 */
	function Register() {
		// 短信验证码时效（秒）
		this.SendSMSIntervalSecond = 120;
		// 手机号码校验正则
		this.Mobile = /^1[34578][0-9]{9}$/;
		// 用户名校验正则
		this.UserName = /^[a-zA-Z0-9_]{6,100}$/;
		// 密码校验正则
		this.Password = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/;
		//中国地区代码
		this.chinaCode='156';
		//日本地区代码
		this.japanCode='392';
		//新加坡地区代码
		this.singaporeCode='702';
		// 系统路径
		this._path = '';
		// 环境其它照片个数（最少一张）
		this._otherPhotoListSize = 1;
		// 注册数据对象
		this.regiterData = {};
		//输入不能为空
		this._isEmty = function(val) {
			if ($.trim(val) == '') {
				return false;
			}
			return true;
		}
		// 发送短信防重复点击控制
		this._sendFlag = '0';
		// 注册提交防重复点击控制
		this._registerFlag = '0';

		// 提交注册校验
		this._validate = function() {
			var _this = register;

			// 清除错误提示
			$('.reg-main').find('.wrong').html('<em></em>');
			// 再次提交需要重新取值
			_this.regiterData = {};
			// 医疗机构信息
			_this.regiterData.clinicName = $('#clinicName').val();
			_this.regiterData.countryCode = $('#selCountry').val();
			_this.regiterData.country = $('#selCountry option:selected').text();
			
			if(_this.regiterData.countryCode == _this.chinaCode){
				_this.regiterData.provinceCode = $('#selProvince').val();
				if (_this._isEmty(_this.regiterData.provinceCode)) {
					_this.regiterData.province = $('#selProvince option:selected').text();
				} else {
					_this.regiterData.province = '';
				}
				_this.regiterData.cityCode = $('#selCity').val();
				if (_this._isEmty(_this.regiterData.cityCode)) {
					_this.regiterData.city = $('#selCity option:selected').text();
				} else {
					_this.regiterData.city = '';
				}
				_this.regiterData.districtCode = $('#selDistrict').val();
				if (_this._isEmty(_this.regiterData.districtCode)) {
					_this.regiterData.district = $('#selDistrict option:selected').text();
				} else {
					_this.regiterData.district = '';
				}
				_this.regiterData.address = $('#suggestId').val();
				if ($('#referrer option:selected').text() == '请选择') {
					_this.regiterData.referrer = '';
				} else {
					_this.regiterData.referrer = $('#referrer option:selected').text();
				}
				_this.regiterData.referrerTel = $('#referrer').val();
			}else if(_this.regiterData.countryCode == _this.japanCode){
				_this.regiterData.provinceCode = $('#selJapanArea').val();
				if (_this._isEmty(_this.regiterData.provinceCode)) {
					_this.regiterData.province = $('#selJapanArea option:selected').text();
				} else {
					_this.regiterData.province = '';
				}
				_this.regiterData.address = $('#address2').val();
			}else if(_this.regiterData.countryCode == _this.singaporeCode){
				_this.regiterData.provinceCode = $('#selSingaporeArea').val();
				if (_this._isEmty(_this.regiterData.provinceCode)) {
					_this.regiterData.province = $('#selSingaporeArea option:selected').text();
				} else {
					_this.regiterData.province = '';
				}
				_this.regiterData.address = $('#address3').val();
			}

			// 详细信息
			$('#isMedicalInsurance').find('.zsxz-radio').each(function() {
				if($(this).prop('checked')) {
					_this.regiterData.isMedicalInsurance = $(this).attr('val');
				}
			});
			var _isFirstDia = true;
			$('#diagnosisType').find('.zsxz-radio').each(function() {
				if($(this).prop('checked')) {
					if (_isFirstDia) {
						_this.regiterData.diagnosisTypeCode1 = $(this).attr('val');
						_this.regiterData.diagnosisType1 = $(this).parent().text();
						_isFirstDia = false;
					} else {
						_this.regiterData.diagnosisTypeCode1 += '|' + $(this).attr('val');
						_this.regiterData.diagnosisType1 += '|' + $(this).parent().text();
					}
				}
			});
			_this.regiterData.phone = _this._isEmty($('#phone1').val()) ? $('#phone1').val() + '-' + $('#phone2').val() : '';
			_this.regiterData.mobile = $('#mobile').val();
			
			//营业时间
			_this.regiterData.openingTimeBegin = $('#openingTimeBegin').val();
			_this.regiterData.openingTimeEnd = $('#openingTimeEnd').val();
			_this.regiterData.openingTimeOther = $('#clinicOpenTimeOther').val();
			
			var _openingTimeType = '';
			var $openingTime = $('#openingTimeType').find('input[name=openingTimeType]:checked');
			_this.regiterData.openingTimeType = $openingTime.attr('val');
			if(_this.regiterData.openingTimeType == '2'){
				_openingTimeType = $('#clinicOpenTimeOther').val();
			}else{
				_openingTimeType = $openingTime.parent().text();
			}
			if (_this._isEmty(_this.regiterData.openingTimeBegin)
					&& _this._isEmty(_this.regiterData.openingTimeEnd)
					&& _this._isEmty(_this.regiterData.openingTimeType)) {
				_this.regiterData.openingTime = $('#openingTimeBegin option:selected').text()
						+ '至' + $('#openingTimeEnd option:selected').text()
						+ '（' + _openingTimeType   + '）';
			} else {
				_this.regiterData.openingTime = '';
			}


			// 环境照片
			var _clinicPhotoPath = 'clinic/clinicPic/' + dbid.substring(0, 1) + '/' + dbid + '/photo/';
			var _isFirstOther = true;
			_this.regiterData.clinicPhotoPath = _clinicPhotoPath;
			$('#envPohto').find('img').each(function() {
				if($(this).attr('id') == 'pRegisterFacade') {
					var _clinicFacadeName = $(this).attr('src');
					if (_this._isEmty(_clinicFacadeName)) {
						_this.regiterData.clinicFacadeName = _clinicFacadeName.replace(pictureHttpPath, '');
					} else {
						_this.regiterData.clinicFacadeName = '';
					}
				} else if($(this).attr('id') == 'pRegisterWaiting') {
					var _clinicWaitingName = $(this).attr('src');
					if (_this._isEmty(_clinicWaitingName)) {
						_this.regiterData.clinicWaitingName = _clinicWaitingName.replace(pictureHttpPath, '');
					} else {
						_this.regiterData.clinicWaitingName = '';
					}
				} else if($(this).attr('id') == 'pRegisterMedLab') {
					var _clinicMedLabName = $(this).attr('src');
					if (_this._isEmty(_clinicMedLabName)) {
						_this.regiterData.clinicMedLabName = _clinicMedLabName.replace(pictureHttpPath, '');
					} else {
						_this.regiterData.clinicMedLabName = '';
					}
				} else if($(this).attr('id').indexOf('pRegisterOther') >= 0) {
					var _clinicOtherName = $(this).attr('src');
					if (_this._isEmty(_clinicOtherName)) {
						if (_isFirstOther) {
							_this.regiterData.clinicOtherName = _clinicOtherName.replace(pictureHttpPath, '');
							_isFirstOther = false;
						} else {
							_this.regiterData.clinicOtherName += '|' + _clinicOtherName.replace(pictureHttpPath, '');
						}
					}
				}
			});

			// 账户信息
			_this.regiterData.userName = $('#userName').val();
			_this.regiterData.password = $('#password').val();

			// 验证信息
			_this.regiterData.telphone = $('#telphone').val();
			_this.regiterData.administratorTel = $('#telphone').val();
			_this.regiterData.phoneCode = $('#phone-code').val();

			// 注册来源
			_this.regiterData.registerResource = '0';

			// 记录cookie中的渠道来源
			if (typeof(getChannel) == 'function') {
				_this.regiterData.channel = getChannel();
			}

			// --------------------------------------------------------------------------------------------------
			//机构名称的验证
			if(!_this._isEmty(_this.regiterData.clinicName)) {
				var $this = $('#clinicName');
				var $wrong = $this.parents('li').find('.wrong');
				$this.addClass("txt-error");
				$wrong.html("<em></em>请输入医疗机构名称");
				$wrong.show();
			}
			// 地址的验证
			if(_this.regiterData.countryCode == _this.chinaCode){//中国地区
				if(!_this._isEmty(_this.regiterData.provinceCode)) {
					var $this = $('#selProvince');
					$this.addClass("txt-error");
				}
				if (!_this._isEmty(_this.regiterData.cityCode)) {
					var $this = $('#selCity');
					$this.addClass("txt-error");
				}
				console.log(_this.regiterData.districtCode)
				if (!_this._isEmty(_this.regiterData.districtCode)) {
					var $this = $('#selDistrict');
					$this.addClass("txt-error");
				}
				if (!_this._isEmty(_this.regiterData.address)) {
					var $this = $('#suggestId');
					$this.addClass("txt-error");
				}
			}else if(_this.regiterData.countryCode == _this.japanCode){//日本
				if(!_this._isEmty(_this.regiterData.provinceCode)) {
					var $this = $('#selJapanArea');
					$this.addClass("txt-error");
				}
				if (!_this._isEmty(_this.regiterData.address)) {
					var $this = $('#address2');
					$this.addClass("txt-error");
				}
			}else if(_this.regiterData.countryCode == _this.singaporeCode){//新加坡
				if(!_this._isEmty(_this.regiterData.provinceCode)) {
					var $this = $('#selSingaporeArea');
					$this.addClass("txt-error");
				}
				if (!_this._isEmty(_this.regiterData.address)) {
					var $this = $('#address3');
					$this.addClass("txt-error");
				}
			}
			
			// 诊疗科室、诊疗项目校验
			if(!_this._isEmty(_this.regiterData.diagnosisTypeCode1)) {
				var $this = $('#diagnosisType');
				$this.addClass("txt-error");
			}
			// 医疗机构固定电话、手机
			if(!_this._isEmty(_this.regiterData.phone) && !_this._isEmty(_this.regiterData.mobile)) {
				$('#phone1').parent().find('input').addClass("txt-error");
			}
			if(_this._isEmty(_this.regiterData.mobile) && !_this.Mobile.test(_this.regiterData.mobile)) {
				$('#mobile').addClass("txt-error");
			}
			// 营业时间
			if(!_this._isEmty(_this.regiterData.openingTimeBegin)) {
				$this = $('#openingTimeBegin');
				$this.addClass("txt-error");
			}
			if(!_this._isEmty(_this.regiterData.openingTimeEnd)) {
				$this = $('#openingTimeEnd');
				$this.addClass("txt-error");
			}
			if(!_this._isEmty(_this.regiterData.openingTimeType)) {
				$('#openingTimeType').addClass("txt-error");
			}
			
			if(_this.regiterData.openingTimeType == '2'){
				if(!_this._isEmty(_this.regiterData.openingTimeOther)) {
					$('#clinicOpenTimeOther').addClass("txt-error");
				}
			}
			

			// 用户名校验
			if(!_this.UserName.test(_this.regiterData.userName)) {
				var $this = $('#userName');
				var $wrong = $this.parents('li').find('.wrong');
				$this.addClass("txt-error");
				$wrong.html("<em></em>用户名格式不正确");
				$wrong.show();
			}
			// 密码校验
			if(!_this.Password.test(_this.regiterData.password)) {
				var $this = $('#password');
				var $wrong = $this.parents('li').find('.wrong');
				$this.addClass("txt-error");
				$wrong.html("<em></em>密码格式不正确");
				$wrong.show();
			}
			// 手机号校验
			if(!_this.Mobile.test(_this.regiterData.telphone)) {
				var $this = $('#telphone');
				var $wrong = $this.parents('li').find('.wrong');
				$this.addClass("txt-error");
				$wrong.html("<em></em>手机号格式不正确");
				$wrong.show();
			}
			// 图形验证码校验
			var _picCode = $('#picCode').val();
			if(!_this._isEmty(_picCode) || _picCode.length < 4) {
				var $this = $('#picCode');
				var $wrong = $this.parents('li').find('.wrong');
				$this.addClass("txt-error");
				$wrong.html("<em></em>请输入4位验证码");
				$wrong.show();
			}
			// 短信验证码校验
			if(!_this._isEmty(_this.regiterData.phoneCode) || _this.regiterData.phoneCode.length < 4) {
				var $this = $('#phone-code');
				var $wrong = $this.parents('li').find('.wrong');
				$this.addClass("txt-error");
				$wrong.html("<em></em>请输入4位验证码");
				$wrong.show();
			}
			
		}
        
		// 动态码倒计时
		this._countDownEnt = function(times) {
			var _this = register;

			var ZeroMobileDiv = "请输入手机号";
			var UnRegister = "该手机号码已注册";
			var Error = "验证码发送失败";

			var _t = times;
			var _countdown = null;
			var $code = $("#send-code");
			var $wrong = $('#telphone').parents('li').find('.wrong');
			var $codewrong = $('#picCode').parents('li').find('.wrong');

			var _lengthMobile = $("#telphone").val().length;

			if (_this._sendFlag == '0') { // 防止重复点击发送短信按钮
				_this._sendFlag = '1';
			} else {
				return;
			}

			clearInterval(_countdown);
			$wrong.hide();
			$('#send-success').hide();
			
			if (_lengthMobile == 0) {
				$wrong.html(ZeroMobileDiv);
				$wrong.show();
				$("#telphone").addClass("txt-error");
				_this._sendFlag = '0';
				return false;
			}

			$.ajax({
				url : _this._path
				+ "/login/loginValidate.do?act=sendMoblieCodeMsg&mobileNum="
				+ $("#telphone").val()+"&isRegister=Y&voteCodeSessionKey="+voteCodeSessionKey+"&curCode="+$('#picCode').val(),
				type : 'post',
				// timeout : 3000, // 超时时间设置，单位毫秒
				dateType : 'text',
				cache : false,
				success : function(data) {
					_this._sendFlag = '0';
					if (data == "success") {
						$('#send-success').show();
						$code.addClass("code-sending").html("已发送<span class='time-count'>120s</span>");
						_countdown = setInterval(function() {
							var _this = register;
							_t--;
							$code.html("已发送<span class='time-count'>" + _t + "s</span>");
							if (_t === 0) {
								clearInterval(_countdown);
								$code.removeClass("code-sending").html("重新获取验证码");
								$wrong.hide();
							}
						}, 1000);
						return true;
					} else if (data == "register") {
						$wrong.html(UnRegister);
						$wrong.show();
						$("#telphone").addClass("txt-error");
						return false;
					} else if(data == "codeblank"){
						$codewrong.html("图形验证码不能为空");
						$codewrong.show();
						$("#picCode").addClass("txt-error");
					}  else if(data == "codewrong"){
						$codewrong.html("图形验证码输入有误");
						$codewrong.show();
						$("#picCode").addClass("txt-error");
					} else {
						$wrong.html(Error);
						$wrong.show();
						$("#telphone").addClass("txt-error");
						return false;
					}
				},
				error : function() {
					_this._sendFlag = '0';
					$wrong.html(Error);
					$wrong.show();
					$("#telphone").addClass("txt-error");
					return false;
				}
			});
		}

		// 注册提交
		this._submitRegiterRequest = function() {
			console.log(11);
			
		}
	};

	/**
	 * @name 类属性
	 * @description 定义类属性方法
	 */
	Register.prototype = {
		// 初始方法
		init : function() {
			
			//IE兼容按钮位置错位
			if ((navigator.userAgent.indexOf('MSIE') >= 0) 
				    && (navigator.userAgent.indexOf('Opera') < 0)){
				$('#send-code').css({"vertical-align":"-2px"});
			}
			
			$('input, textarea').placeholder({customClass:'my-placeholder'});
			$('.reg-main').find(".wrong").hide();
			
//			refreshVervifiCode4(pictureHttpPath);
			
			register.listener();
		},
		// 事件监听
		listener : function() {
			/**
			 * 必填项输入监听
			 */
			$(".must-fill").focus(function(){
				var $this = $(this);
				$this.removeClass("txt-error");
				$this.parents('li').find('.wrong').hide();
			});

			/**
			 * 已上传图片删除按钮监听
			 */
			$(".delate").click(function() {
				var $this = $(this);
				$this.hide();
				$this.parent().find('img').hide();
				$this.parent().find('img').attr('src', '');
			});
			/**
			 * 诊疗项目、营业时间类型监听
			 */
			$('#diagnosisType .zsxz-radio, #openingTimeType .zsxz-radio').click(function() {
				var $this = $(this);
				$this.parents('.checkbox-list').removeClass("txt-error");
			});

			/**
			 * 省市区、营业开始结束时间监听
			 */
			$('#selProvince, #selJapanArea, #selSingaporeArea, #selCity, #selDistrict, #openingTimeBegin, #openingTimeEnd').click(function() {
				var $this = $(this);
				$this.removeClass("txt-error");
			});


			/**
			 * 发送动态码监听
			 */
//			$(".send-code").click(function(){
//				//add by hm 校验图形验证码
//				var picCode = $('#picCode').val();
//				var checkRet = checkCode(picCode);
//				if(!checkRet) return checkRet;
//				
//				
//				var _this = register;
//				var $this = $(this);
//				if ($this.hasClass("code-sending")) {
//					return;
//				}
//				
//				if(!_this.Mobile.test($('#telphone').val())){
//					var $wrong = $('#telphone').parents('li').find('.wrong');
//					$wrong.html('手机格式不正确，请重新输入！');
//					$wrong.show();
//					$("#telphone").addClass("txt-error");
//					return false;
//				}
//				
//				_this._countDownEnt(_this.SendSMSIntervalSecond);
//			});

			/**
			 * 注册按钮监听
			 */
			$(".submitbtn").click(function(){
				var _this = register;
				var $parent = $(this).closest(".reg-main");
				$parent.find(".txt-error").removeClass("txt-error");
				$parent.find(".wrong").hide();
				// 提交注册校验
				_this._validate();
				
				if($parent.find(".txt-error").length > 0){//输入不正确
					var _top = $parent.find(".txt-error").offset().top;
					$("body").animate({"scrollTop":_top},200);
					$("html").animate({"scrollTop":_top},200);
					return;
				}
				if(!$("#reg-rule").prop("checked")){
					pop.show("N", "请先阅读并勾选服务条款！");
					return;
				}

				//add by hm 校验图形验证码
//				var picCode = $('#picCode').val();
//				var checkRet = checkCode(picCode);
//				if(!checkRet) return checkRet;
				
				// 注册提交
				_this._submitRegiterRequest();
			});


			// 上传环境照
			$(".upload_env_action").click(function() {
				$(this).parent().hide();
				$(".env_upload").show();
			});

			/**
			 * 环境设备添加按钮
			 */
			$('.add').click(function(){
				var _this = register;
				var _index1 = _this._otherPhotoListSize + 1;
				$('#envPohto').append('<div class="upload_item"><img id="pRegisterOther'
						+ _index1
						+ '" style="display:none;"><a class="upload"><input type="file" name="file" id="clinicOtherF'
						+ _index1
						+ '" onchange="upload(this, \'photo\', \'pRegisterOther'
						+ _index1
						+ '\', \'clinicPic\')" accept="image/*"></a><span>其它照片</span></div>');
				_this._otherPhotoListSize = _index1;
			});

			// input输入框增加选择效果
			$("input, select").focus(function(){
				$(this).addClass('add-border');
			}).blur(function() {
				$(this).removeClass('add-border');
			});

	        // 营业时间Begin监听，控制营业时间End展示内容
			$('#openingTimeBegin').change(function(){
				var $this = $(this);
				var _index = parseInt($this.val());
				var _openingTimeEnd = $('#openingTimeEnd').val();
				$('#openingTimeEnd').html('<option value="">请选择</option>');
				for (var i = _index + 1; i <= 48; i++) {
					var j = i < 10 ? ('0' + i) : (i + '');
					var k = parseInt(i / 2) < 10 ? ('0' + parseInt(i / 2)) : (parseInt(i / 2) + '');
					if (i % 2 == 0) {
						$('#openingTimeEnd').append('<option value=' + j + '>'
								+ k + ':00</option>');
					} else {
						$('#openingTimeEnd').append('<option value=' + j + '>'
								+ k + ':30</option>');
					}
				}
				if (_index < parseInt(_openingTimeEnd)) {
					$('#openingTimeEnd').val(_openingTimeEnd);
				}
			});
			
			// 国家下拉监听 获取国家列表
			$("#selCountry").change(function(){
				var _this = register;
				var _param = {};
				_param.parentId = $('#selCountry').val();
				if(_param.parentId == _this.chinaCode){
					$("#referrer_li").show();
					$("#chinaArea_li").show();
					$("#japanArea_li").hide();
					$("#singaporeArea_li").hide();
				}
				if(_param.parentId == _this.japanCode){//日本
					$("#chinaArea_li").hide();
					$("#japanArea_li").show();
					$("#singaporeArea_li").hide();
					$("#referrer_li").hide();
					$.ajax({
						url : "/login/getJapanArea.do",
						type : 'post',
						dateType : 'json',
						data : '',
						success : function(data) {
							if (!!data.result && data.result == "success") {
								var _areaList = data.areaList;
								if (!!_areaList && _areaList.length > 0) {
									$('#selJapanArea').html('<option value="">请选择</option>');
									for (var i = 0; i < _areaList.length; i++) {
										$('#selJapanArea').append('<option value=' + _areaList[i].areaId + '>'
												+ _areaList[i].name + '</option>');
									}
								}
							} else {
							}
						},
						error : function() {
						}
					});
				}
				if(_param.parentId == _this.singaporeCode){
					$("#referrer_li").hide();
					$("#chinaArea_li").hide();
					$("#japanArea_li").hide();
					$("#singaporeArea_li").show();
					$.ajax({
						url : "/login/getSingaporeArea.do",
						type : 'post',
						dateType : 'json',
						data : '',
						success : function(data) {
							if (!!data.result && data.result == "success") {
								var _areaList = data.areaList;
								if (!!_areaList && _areaList.length > 0) {
									$('#selSingaporeArea').html('<option value="">请选择</option>');
									for (var i = 0; i < _areaList.length; i++) {
										$('#selSingaporeArea').append('<option value=' + _areaList[i].areaId + '>'
												+ _areaList[i].name + '</option>');
									}
								}
							} else {
							}
						},
						error : function() {
						}
					});
				}
				
			});
			//添加营业时间选项监听事件
			$('input[name=openingTimeType]').change(function(){
				var _index = $(this).attr("val");
				console.log(_index);
				console.log($(this))
				if(_index == 2){
					$("#clinicOpenTimeOther").removeAttr('readonly');
				}else{
					$("#clinicOpenTimeOther").attr('readonly','readonly');
				}
			});
			
			$(".metype").hover(function() {
				$(".mechanism").show();
			}, function() {
				$(".mechanism").hide();
			});
			$(".detype").hover(function() {
				$(".department").show();
			}, function() {
				$(".department").hide();
			});
		}
	};

	/**
	 * @name 创建实体类
	 */
	register = new Register();
	register.init();
})(jQuery);

!!$(function(){
	$('#selCountry').val('156');
});