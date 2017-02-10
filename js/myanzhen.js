     var mynic = function(){
     	//调地址的下拉
		$("#center-addr").on("input", function() {
			 mysheng = $("#selProvince").find("option:selected").text();
			 myshi = $("#selCity").find("option:selected").text();
			 if($("#selDistrict").find("option:selected").text() != "请选择"){
			 	 myxian = $("#selDistrict").find("option:selected").text();
			 }
			 //北京，天津，重庆，上海，台湾省，香港特别行政区，澳门特别行政区
	//		 if(mysheng == "北京" || mysheng == "天津" || mysheng == "重庆" || mysheng == "上海" || mysheng == "台湾省" || mysheng == "香港特别行政区" || mysheng == "澳门特别行政区"){
	//		 	 foinput = mysheng;
	//		 }else{
	//		 	 foinput = myshi;
	//		 }
	         foinput = mysheng+myshi+myxian;
			 fourval = $('#center-addr').val();
			//foinput = $("#ceshi").val();
			fourpan(fourval, 1, "#center-addr");
			fourdate(fourval, foinput);
		});
     }
		//叉的显示隐藏
            fourpan = function(addval,yanadd,yanname) {
					if(addval != "") {
						$(".fourshow").show();
						chaclear(yanadd,yanname);
					} else {
						$(".fourshow").hide();
					}
				}
				//叉的清除
			chaclear = function(yanadd,yanname) {
					$(".fourshow").on('click', function() {
						$(yanname).val("");
						$(".addul").empty();
						$(".addtishi span").html("");
						if(yanadd ==2){
							fouyan();
						}
						$('.fourshow').hide();
						$(".addtishi").hide();
					})
				}
			//fexid问题
			$(".foofixed").css({"position":"static"});
			myblur = function(myname){
				$(myname).on('blur',function(){
					$(".addtishi span").html("");
					$(".addul").empty();
				})
			}
				//请求
			fourdate = function(addval,foinput) {
				$.ajax({
					type: "POST",
					url: "http://api.map.baidu.com/place/v2/suggestion?query=" + foinput+addval + "&region=全国&output=json&ak=Ay3vHUo33Y4mc78fBMlW5WHmkn9VWfi6", //必须有
					dataType: "jsonp", //表示返回值类型，不必须
					success: function(data) {
						//console.log(data);
						$(".addtishi").show();
				        $(".addtishi").css("height","327px");
						if(data.result.length == 0) {
//							$(".addtishi span").html("没有搜索到相关地址");
//							$(".addul").empty();
							$(".addtishi").css("display","none");
						} else {
							$(".addtishi").css("display","block");
							$(".addtishi span").html("您要找的是不是");
							fourlist(data.result);
						}
					}
				});
			}

		 fourlist = function(pill) {
				$(".addul").empty();
				$.each(pill, function(i, n) {
					fourshow(n);

				})

			}
		fourshow = function(t) {
				$('<li><em>' + t.name + '</em><i>' + t.city + t.district + '</i></li>').appendTo(".addul").on('click', function() {
					$("#center-addr").val(t.name).focus();
					//经纬度 
					$('#latitude').val(t.location.lat);
					$('#longitude').val(t.location.lng);
					$(".addtishi").hide();
					$(".addul").empty();
					$(".addtishi span").html("");
					$('.fourshow').hide();
					mymap(t.city+t.district+t.name);
				});
			}

			