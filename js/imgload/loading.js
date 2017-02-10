/**
 * 加载图片js文件
 */
// 添加加载图片
function addLoad() {
	var basePath ="${basePath}";
	var str = "<div id='dis' style='position:absolute;left:0;top:0;background:#000;opacity:0.4;filter:alpha(opacity=40);'></div><div id='loadImg' style='position:absolute;left:50%;top:50%;' ></div>" ;
	$("body").append(str) ;
	var disWidth = document.documentElement.offsetWidth;
	var disHeight = document.documentElement.offsetHeight;
	document.getElementById("dis").style.width=disWidth+"px";
	document.getElementById("dis").style.height=disHeight+"px";
	var loadImgW = document.getElementById("loadImg").clientWidth;
	var loadImgH = document.getElementById("loadImg").clientHeight;
	document.getElementById("loadImg").style.marginLeft=-(loadImgW/2)+"px";
	document.getElementById("loadImg").style.marginTop=-(loadImgH/2)+"px";	
}

// 移除加载图片
function removeLoad() {
	$("#loadImg,#dis").remove()
}