function setChannel() {
    var channel = GetQueryString("ch");
    if(channel!="" && channel != null){
        var date = new Date();
        date.setTime(date.getTime() + (-1*3600*1000));
        var domain="";
        var url = window.location.host;
        if(url.indexOf(".pinganwj.com") != -1){
            domain = ".pinganwj.com";
        }
        if(url.indexOf(".pawjzs.com") != -1){
            domain = ".pawjzs.com";
        }
        //删除原来的cookie
        document.cookie = "ch=;expires=" + date.toGMTString()+";path=/;domain="+domain;
        //设置新的cookie
        document.cookie = "ch=" +escape(channel) + ";expires=0;path=/;domain="+domain;
    }
}
setChannel();
function getChannel() {
    if (document.cookie.length>0){
        c_start=document.cookie.indexOf("ch=");
        if (c_start!=-1){ 
            c_start=c_start + "ch".length+1 ;
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1){
                c_end=document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}

function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null && r!=""){
        return  unescape(r[2]);
    }
    return "";
}
