//图形验证码key
var voteCodeSessionKey = '';

//session超时时间（15分钟）
var session_timeout = 15 * 60 * 1000;
var globalLastSessionTime = (new Date()).getTime();
var picExpiredTime = "360";



function refreshVervifiCode4(nginxRoot) {
	voteCodeSessionKey = new Date().getTime() + parseInt(Math.random() * 1000000);
	$(".codeImg img").attr("src", nginxRoot + "verification/code/num/clinic/6/"+ voteCodeSessionKey + "/" + picExpiredTime);
//		$(".codeImg img").attr("src", "https://imagedev.pawjzs.com/" + "verification/code/clinic/6/"+ voteCodeSessionKey +"/90");
}

//校验图形验证码
function checkCode(curCode,flag){
	
	var ret = true;
	if(!curCode){
		if(flag == 'm'){
			alert('对不起，图形验证码不能为空！');
		}else{
			pop.show("N", '对不起，图形验证码不能为空！', "操作失败");
		}
		ret = false;
	}
	
	if(!ret) return ret;
	
	var url = '/validate/validatePicCode.do';
	var data = {};
	data.curCode = curCode;
	data.sessionKey = voteCodeSessionKey;
	$.ajax({
        type: "post",
        data: data,
        async: false,
        url: url,
        dataType: "json",
		success : function(data) {
			if (!!data) {
				if (!!data.result && data.result == "success") {
					
				}else if(data.result == "failure"){
					if(flag == 'm'){
						alert(data.reason);
					}else{
					pop.show("N", data.reason, "操作失败");
					}
					ret = false;
				}
			}
		},
		error : function(data) {
			if(flag == 'm'){
				alert('由于您长时间没有操作, 请您重新登录.')
				return false;
			}else{
				pop.show("N", '由于您长时间没有操作, 请您重新登录.', "保存失败", function() {
					window.location.href = "/clinic/center.do";
				});
			}
		}
	});
	
	return ret;
}


//更换验证图片
$("#codeImgImg").click(function(){
	refreshRandImage();
});

//flag 区别pc段和手机端
function refreshRandImage(){
	//判断是否session超时，若超时，则需要F5刷新浏览器
	var past = (new Date()).getTime() - globalLastSessionTime;
	if(past > session_timeout) {
		var flag = $('.codeImg').attr('flag');
		if(flag && flag == 'm'){
			alert('由于您长时间没有操作, 请重新刷新页面！')
			return false;
		}else{
			pop.show("N", '由于您长时间没有操作, 请重新刷新页面！', "操作失败", function() {
				return false;
			});
		}
	} else {
		$("#codeImg").val("");
		var now_date = new Date();
		 
		voteCodeSessionKey = now_date.getTime() + parseInt(Math.random() * 1000000);			
		var randomImageUrl = pictureHttpPath +"/verification/code/clinic/6/" + voteCodeSessionKey + "/" + picExpiredTime;
//				var randomImageUrl = "https://imagedev.pawjzs.com/" +"/verification/code/clinic/6/" + voteCodeSessionKey + "/" + picExpiredTime;
		
		$("#codeImgImg").attr("src", randomImageUrl);
		
		globalLastSessionTime = now_date.getTime();
	}
}