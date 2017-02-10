var sheng = function(){
   	$.post("/testback/publicarea/getAreaByLevel1",function(d){
   		console.log(d);
   		$.each(d.data,function(i,n){
   			$('<option value="'+n.areacode+'" >'+n.areaname+'</option>').appendTo("#selProvince");
   		})
   		shi(d.data[0].areacode);
   		$("#selProvince").change(function(){
   			var code = $(this).val();
   			shi(code);
   			$("#selCity").focus();
   		})
   	})
   }
   var shi = function(code){
   	$.post("/testback/publicarea/getAreaByLevel2",'info={areacode:"'+code+'"}',function(d){
   		console.log(d);
   		$("#selCity").empty();
   		$.each(d.data,function(i,n){
   			$('<option value="'+n.areacode+'" >'+n.areaname+'</option>').appendTo("#selCity");
   		})
   		xiang(d.data[0].areacode);
   		$("#selCity").change(function(){
   			var code = $(this).val();
   			xiang(code);
   			$("#selDistrict").focus();
   		})
   	})
   }
   var xiang = function(mycode){
   	$.post("/testback/publicarea/getAreaByParent",'info={parentid:"'+mycode+'"}',function(d){
   		console.log(d);
   		$(".clicnic-xian").remove();
   		$.each(d.data,function(i,n){
   			$('<option value="'+n.areacode+'" class="clicnic-xian">'+n.areaname+'</option>').appendTo("#selDistrict");
   		})
   	})
   }