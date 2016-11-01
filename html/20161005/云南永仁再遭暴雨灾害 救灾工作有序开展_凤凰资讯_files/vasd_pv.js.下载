(function(){
	var reportLoad = {
		rprotocol:'',
		clientFlag:'',
		fck:'',
		mac:'',
		userid:'',
		browser:'',
		source:'',
		url:'',
		ref:'',
		info:''
	};
	function reportPV(data)
	{
		var params = [];
		for (var key in data) {
			params.push(key+'='+encodeURIComponent(data[key]));
		}
		document.createElement('img').src = 'http://stat.funshion.net/tools/fun_vasd?' + params.join('*_*');
	}
	var myCookie = {
		'get': function(Name) {
			var arrStr = document.cookie.split("; ");
			for (var i = 0; i < arrStr.length; i++) {
				var temp = arrStr[i].split("=");
				if (temp[0] == Name) return unescape(temp[1]);
			}
			return '';
		},
		'set': function(name, value, day, domain) {
			if (!day) {
				day = 365;
			};
			var today = new Date();
			var expires = new Date();
			expires.setTime(today.getTime() + 3600 * 24 * 1000 * day);
			document.cookie = name + "=" + escape(value) + "; path=/; domain=" + (domain ? domain: ".funshion.com")+ ";expires=" + expires.toGMTString();
		},
		'setv': function(name, value, day, domain) {
			if (!day) {
				day = 365;
			};
			var today = new Date();
			var expires = new Date();
			expires.setTime(today.getTime() + 3600 * 24 * 1000 * day);
			document.cookie = name + "=" + escape(value) + "; path=/; domain=" + (domain ? domain: ".funshion.com");
		},
		'del': function(name) {this.set(name, '', -365);}
	};
	reportLoad.rprotocol = 1;
	reportLoad.clientFlag = 3;
	reportLoad.browser = encodeURIComponent(navigator.userAgent);
	if(window.gvl == 'seine' || window.gvl == 'rhine') reportLoad.source = 1;
	if(window.gvl == 'gravel' || window.gvl == 'danube') reportLoad.source = 2;
	reportLoad.url = encodeURIComponent(document.location.href);
	reportLoad.ref = encodeURIComponent(document.location.href);
	if(window.gvl == 'seine' || window.gvl == 'danube') reportLoad.ref = '';
	//kejie
	if(window.gvl == 'rhine') {reportLoad.url = '';reportLoad.ref = '';}
	reportPV(reportLoad);
})();