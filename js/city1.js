function sheng(){
   	$.post("/testback/publicarea/getAreaByLevel1",function(d){
   		//console.log("省",d);
   		$(".selProvince").empty();
   		$(".tch-province").attr("data",d.data[0].areacode);
   		$.each(d.data,function(i,n){
   			$('<option value="'+n.areacode+'" >'+n.areaname+'</option>').appendTo(".selProvince");
   		})
   		shi(d.data[0].areacode);
   		$(".selProvince").change(function(){
   			var code = $(this).val();
   			shi(code);
   			$(".selCity").focus();
   		})
   	})
  }
function shi(code){
   	$.post("/testback/publicarea/getAreaByLevel2",'info={areacode:"'+code+'"}',function(d){
   		//console.log("市",d);
   		$(".selCity").empty();
   		$(".tch-city").attr("data",d.data[0].areacode);
   		$.each(d.data,function(i,n){
   			if(n.areacode == "110100" || n.areacode =="120100" || n.areacode =="310100"|| n.areacode =="500100"){
   				//console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
   			}else{
   				$('<option value="'+n.areacode+'" >'+n.areaname+'</option>').appendTo(".selCity");
   			}
   		})	
   	})
}