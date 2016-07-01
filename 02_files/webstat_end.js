function strip_tag(str) {
   return str.replace(/<\/?[^>]+>/gi, "");
}

function getvalue(name)
{
	if( typeof(document.getElementsByName(name)[0])==="undefined")return false;
	if(document.getElementsByName(name)[0].value != ''){
		return document.getElementsByName(name)[0].value;
	}else{
		return false;
	}
}
var contenttitle = strip_tag(document.title);

if(getvalue('subscriber2')){
	var subscriber = getvalue('subscriber2');
}else{
	var subscriber = getvalue('subscriber');
}

if(document.getElementById("xiangyu")||(document.getElementsByName("xiangyu")).length>0)
{

document.write("<iframe width='0' height='0' frameborder='0' scrolling='no' src='http://netstat.yunnan.cn/test/pagemeta.php?parameter=record&ctitle="+encodeURIComponent(getvalue('title'))+"&recorder_id=&url_d="+escape(document.referrer)+"&pictures=&news_id="+getvalue('nsid')+"&words=&from="+encodeURIComponent(getvalue('sitename'))+"&post_time="+getvalue('pubtime')+"&in_time=&editor_id="+encodeURIComponent(subscriber)+"&first_edit=&f_editor_id=&last_edit=&l_editor_id=&column="+encodeURIComponent(getvalue('nodename'))+"'></iframe>");

}
else
{
	//判断是否unicode
	if(getvalue('siteid')>0){
		if(getvalue('rname')==getvalue('nodename')){
			col = decode(getvalue('rname'));
		}else if(getvalue('pname')==getvalue('rname')){
			col = decode(getvalue('rname')) + '_' + decode(getvalue('nodename'));
		}else{
			col = decode(getvalue('rname')) + '_' + decode(getvalue('pname')) + '_' + decode(getvalue('nodename'));
		}
		var sname = decode(getvalue('sitename'));
		var editor = decode(getvalue('subscriber'));
	}else{
		if(getvalue('rname')==getvalue('nodename')){
			col = getvalue('rname');
		}else if(getvalue('pname')==getvalue('rname')){
			col=getvalue('rname') + '_' + getvalue('nodename');
		}else{
			col=getvalue('rname') + '_' + getvalue('pname') + '_' + getvalue('nodename');
		}
		var sname = getvalue('sitename');
		var editor = getvalue('subscriber');
	}
	document.write("<iframe width='0' height='0' marginheight='0' marginwidth='0' style='visibility:hidden' frameborder='0' scrolling='no' src='http://netstat.yunnan.cn/test/pagemeta.php?parameter=record&ctitle="+encodeURIComponent(contenttitle)+"&recorder_id=&url_d="+escape(document.referrer)+"&pictures=&news_id="+getvalue('nsid')+"&words=&from="+encodeURIComponent(decode(getvalue('sitename')))+"&post_time="+getvalue('pubtime')+"&in_time=&editor_id="+encodeURIComponent(decode(subscriber))+"&first_edit=&f_editor_id=&last_edit=&l_editor_id=&column="+encodeURIComponent(col)+"'></iframe>");
}
//alert(decode(document.getElementsByName('sitename')[0].value));