/**
 * 连锁诊所总账户注册js
 */
(function($){
	
	function HeadRegister(){
		this._result = '';//校验执行结果，可能为空，可能为form对象，可能是true和false
		
		// 短信验证码时效（秒）
		this.SendSMSIntervalSecond = 120;
		// 手机号码校验正则
		this.Mobile = /^1[34578][0-9]{9}$/;
		//only num and letter
		this.NumLetter = /^[a-zA-Z0-9]{15,18}$/;
		// 用户名校验正则
		this.UserName = /^[a-zA-Z0-9_]{6,100}$/;
		// 密码校验正则
		this.Password = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/;
		// 系统路径
		this._path = '';
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

		this._getAllData = function(){
			var form = $('#clinicData').validateClinic(true,opts);
		};
		
		this._countDownEnt = function(times) {
			var _this = headRegister;

			var ZeroMobileDiv = "请输入手机号";
			var UnRegister = "该手机号码已注册";
			var Error = "验证码发送失败";

			var _t = times;
			var _countdown = null;
			var $code = $("#send-code");
			var $wrong = $('#telphone').parents('li').find('.wrong');

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
							var _this = headRegister;
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
			
		};
		
		this._validateCallback = function(obj,opts,form){
			$(obj).parents('li').find('.wrong').show();
			$(obj).addClass('txt-error');
		};
	}
	
	HeadRegister.prototype = {
		init : function(){
			$('input, textarea').placeholder({customClass:'my-placeholder'});
			
			var _this = headRegister;
			
			_this.listener();
			opts.validateCallBack = _this._validateCallback;
//			console.log(form);
			refreshVervifiCode4(pictureHttpPath);
		},
		listener : function(){
			$("input:radio[name='certificate']").click(function(){
				var certificate = $("input:radio[name='certificate']:checked").val();
				var oneCertificate = $(".one-certificate");
				var threeCertificate = $(".three-certificate");
				if(certificate==1){
			        oneCertificate.show();
			        $(oneCertificate).find('img').addClass('clinicData must-fill');
			        $(oneCertificate).find('input').each(function(){
			        	if($(this).attr('type')=='text') $(this).addClass('clinicData must-fill');
			        });
			        
			        $(threeCertificate).find('img').each(function(){
			        	$(this).removeClass('clinicData must-fill');
			        });
			        
			        $(threeCertificate).find('input').each(function(){
			        	if($(this).attr('type')=='text') $(this).removeClass('clinicData must-fill');
			        });
			        threeCertificate.hide();
			    }else{
			    	$(oneCertificate).find('img').removeClass('clinicData must-fill');
			    	$(oneCertificate).find('input').each(function(){
			    		if($(this).attr('type')=='text') $(this).removeClass('clinicData must-fill');
			    	})
			    	oneCertificate.hide();
			    	threeCertificate.show();
			    	$(threeCertificate).find('img').each(function(){
			        	$(this).addClass('clinicData must-fill');
			        });
			    	$(threeCertificate).find('input').each(function(){
			    		if($(this).attr('type')=='text') $(this).addClass('clinicData must-fill');
			    	});
			    }
		    });
			/**
			 * 必填项输入监听
			 */
			$(".must-fill, input").focus(function(){
				var $this = $(this);
				$this.removeClass("txt-error");
				$this.parents('li').find('.wrong').hide();
			});
			/**
			 * 发送动态码监听
			 */
			$(".send-code").click(function(){
				//add by hm 校验图形验证码
				var picCode = $('#picCode').val();
				var checkRet = checkCode(picCode);
				if(!checkRet) return checkRet;
				
				
				var _this = headRegister;
				var $this = $(this);
				if ($this.hasClass("code-sending")) {
					return;
				}
				
				if(!_this.Mobile.test($('#telphone').val())){
					var $wrong = $('#telphone').parents('li').find('.wrong');
					$wrong.html('手机格式不正确，请重新输入！');
					$wrong.show();
					$("#telphone").addClass("txt-error");
					return false;
				}
				
				_this._countDownEnt(_this.SendSMSIntervalSecond);
			});
		    $('.submitbtn').click(function(){
	    	
				var _this = headRegister;
				var SysErrorDiv = "网络繁忙，保存数据失败！";
				var _message = "提交审核";
				
				// 审核传全量数据，保存只传当前页数据
				_this._formData = $('.reg-main').validateClinic(true,opts);
				
				_this._formData.validateCode=voteCodeSessionKey;
				_this._formData.curCode=$('#picCode').val();
				
				// 记录cookie中的渠道来源
				if (typeof(getChannel) == 'function') {
					_this.regiterData.channel = getChannel();
				}
				
				if(!_this._formData.resultFlg) return;

				//add by hm 校验图形验证码
				var picCode = $('#picCode').val();
				var checkRet = checkCode(picCode);
				if(!checkRet) return checkRet;
		    	
				if(!$("#reg-rule").prop("checked")){
					pop.show("N", "请先阅读并勾选服务条款！");
					return;
				}
				
				$.ajax({
					url : "/login/headInsert.do",
					type : 'post',
					dateType : 'json',
					data : _this._formData,
					success : function(data) {
						if (!!data) {
							if (!!data.result && data.result == "success") {
								var _userName = $("#userName").val();
								var _password = $("#password").val();
								pop.show("N", "恭喜您，注册成功并已提交审核!", "注册成功", function() {
									if (!!_userName) {
										window.location.href="/login/loginSSO.do?userName=" + _userName + "&pwd=" + _password + "&x=" + new Date();
									}
								});
							} else {
								if (!!data.reason) {
									pop.show("N", data.reason, "提交失败");
								} else {
									pop.show("N", SysErrorDiv, "提交失败");
								}
							}
						}
					},
					error : function() {
						pop.show("N", '由于您长时间没有操作, 还请您重新登录.', "提交失败", function() {
							window.location.href = "/clinic/center.do";
						});
					}
				});
		    });
			//协议弹窗
			$("#reg-agree").click(function(){
	    		$("#protocol,.transparent_bg").show();
		    });
			$("#ou_dtgb").click(function(){
		    	$("#protocol,.transparent_bg").hide();
		    });
			$("#checkTos").click(function(){
				$("#reg-rule").prop("checked", true);
		    	$("#protocol,.transparent_bg").hide();
		    });

			// input输入框增加选择效果
			$("input, select").focus(function(){
				$(this).addClass('add-border');
			}).blur(function() {
				$(this).removeClass('add-border');
			});
		}
	}
	headRegister = new HeadRegister();
	headRegister.init();
})(jQuery)

//IE兼容按钮位置错位
if ((navigator.userAgent.indexOf('MSIE') >= 0) 
	    && (navigator.userAgent.indexOf('Opera') < 0)){
	$('#send-code').css({"vertical-align":"-2px"});
}