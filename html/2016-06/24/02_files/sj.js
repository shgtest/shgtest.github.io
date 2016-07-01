var url = window.location.href,
	a  = url.split('/'),
	v1 = a[2].replace('.yunnan.cn', '');
if(document.getElementById('sj')){
	var v0 = document.getElementById('sj').getAttribute('data');
}else{
	var v0 = 'article';
}
if(v1 == 'special'){
	if(a.length == 8){
		var v2 = a[3],
			v3 = a[5],
			v4 = a[6],
			v5 = a[7].replace('content_', '').replace(/\.htm(.*)/, '');
		uaredirect("http://sj.yunnan.cn/"+v0+"-"+v1+"-"+v2+"-"+v3+"-"+v4+"-"+v5+".html");
	}else{
		var v1 = a[4],
			v2 = a[6],
			v3 = a[7],
			v4 = a[8].replace('content_', '').replace(/\.htm(.*)/, '');
		uaredirect("http://sj.yunnan.cn/"+v0+"-"+v1+"-"+v2+"-"+v3+"-"+v4+".html");
	}
}else if(v1 == 'big5'){
	var v2 = a[4],
		v3 = a[6],
		v4 = a[7],
		v5 = a[8].replace('content_', '').replace(/\.htm(.*)/, '');
	uaredirect("http://sj.yunnan.cn/"+v0+"-"+v2+"-"+v3+"-"+v4+"-"+v5+".html");
}else if(v1 == 'www' && a.length == 8){
	var v2 = a[3],
		v3 = a[5],
		v4 = a[6],
		v5 = a[7].replace('content_', '').replace(/\.htm(.*)/, '');
	uaredirect("http://sj.yunnan.cn/"+v0+"-"+v2+"-"+v3+"-"+v4+"-"+v5+".html");
}else{
	var v2 = a[4],
		v3 = a[5],
		v4 = a[6].replace('content_', '').replace(/\.htm(.*)/, '');
	uaredirect("http://sj.yunnan.cn/"+v0+"-"+v1+"-"+v2+"-"+v3+"-"+v4+".html");
}