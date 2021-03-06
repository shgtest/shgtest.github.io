window.UDC = window.UDC || {};
UDC.browser = {};
UDC.ua = navigator.userAgent || "";
UDC.browser.ie = /msie (\d+\.\d+)/i.test(UDC.ua) ? (document.documentMode || + RegExp['\x241']) : undefined;
UDC.browser.ieTrue = /msie (\d+\.\d+)/i.test(UDC.ua) ? +RegExp['\x241'] : undefined;

(function(){
	if(!UDC.browser.ie && /Trident\//i.test(UDC.ua)){
		var version = /rv:(\d+\.\d+)/i.test(UDC.ua) ? RegExp['\x241'] : undefined;
		if(version){
			version = parseInt(version, 10);
			UDC.browser.ie = version;
			UDC.browser.ieTrue = UDC.browser.ie;
		}
	}
})();

UDC.swf = {};
UDC.swf.version = (function () {
	var n = navigator, isPlugins = false;
	try {isPlugins = (n.plugins && n.mimeTypes.length);}catch(ex){}
	if (isPlugins) {
		var plugin = n.plugins["Shockwave Flash"];
		if (plugin && plugin.description) {
			return plugin.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s)+r/, ".") + ".0";
		}
	} else if (window.ActiveXObject && !window.opera) {
		for (var i = 12; i >= 2; i--) {
			try {
				var c = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + i);
				if (c) {
					var version = c.GetVariable("$version");
					return version.replace(/WIN/g,'').replace(/,/g,'.');
				}
			} catch(e) {}
		}
	}}
)();
UDC.swf.createHTML = function (options) {
	options = options || {};
	var version = UDC.swf.version, 
		needVersion = options.ver || '6.0.0', 
		vUnit1, vUnit2, i, k, len, item, tmpOpt = {},
		encodeHTML = UDC.string.encodeHTML;
	for (k in options) {
		tmpOpt[k] = options[k];
	}
	options = tmpOpt;
	if (version) {
		version = version.split('.');
		needVersion = needVersion.split('.');
		for (i = 0; i < 3; i++) {
			vUnit1 = parseInt(version[i], 10);
			vUnit2 = parseInt(needVersion[i], 10);
			if (vUnit2 < vUnit1) {
				break;
			} else if (vUnit2 > vUnit1) {
				return ''; // 需要更高的版本号
			}
		}
	} else {
		return ''; // 未安装flash插件
	}
	var vars = options.vars, objProperties = ['classid', 'codebase', 'id', 'width', 'height', 'align'];
	options.align = options.align || 'middle';
	options.classid = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000';
	options.codebase = 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0';
	options.movie = options.url || '';
	delete options.vars;
	delete options.url;
	if ('string' == typeof vars) {
		options.flashvars = vars;
	} else {
		var fvars = [];
		for (k in vars) {
			item = vars[k];
			fvars.push(k + "=" + encodeURIComponent(item));
		}
		options.flashvars = fvars.join('&');
	}
	var str = ['<object '];
	for (i = 0, len = objProperties.length; i < len; i++) {
		item = objProperties[i];
		str.push(' ', item, '="', encodeHTML(options[item]), '"');
	}
	str.push('>');
	var params = {
		'wmode'             : 1,
		'scale'             : 1,
		'quality'           : 1,
		'play'              : 1,
		'loop'              : 1,
		'menu'              : 1,
		'salign'            : 1,
		'bgcolor'           : 1,
		'base'              : 1,
		'allowscriptaccess' : 1,
		'allownetworking'   : 1,
		'allowfullscreen'   : 1,
		'seamlesstabbing'   : 1,
		'devicefont'        : 1,
		'swliveconnect'     : 1,
		'flashvars'         : 1,
		'movie'             : 1
	};
	for (k in options) {
		item = options[k];
		k = k.toLowerCase();
		if (params[k] && (item || item === false || item === 0)) {
			str.push('<param name="' + k + '" value="' + encodeHTML(item) + '" />');
		}
	}
	options.src  = options.movie;
	options.name = options.id;
	delete options.id;
	delete options.movie;
	delete options.classid;
	delete options.codebase;
	options.type = 'application/x-shockwave-flash';
	options.pluginspage = 'http://www.macromedia.com/go/getflashplayer';
	str.push('<embed');
	var salign;
	for (k in options) {
		item = options[k];
		if (item || item === false || item === 0) {
			if ((new RegExp("^salign\x24", "i")).test(k)) {
				salign = item;
				continue;
			}
			str.push(' ', k, '="', encodeHTML(item), '"');
		}
	}
	if (salign) {
		str.push(' salign="', encodeHTML(salign), '"');
	}
	str.push('></embed></object>');
	return str.join('');
};
UDC.swf.create = function (options, target) {
	options = options || {};
	var html = UDC.swf.createHTML(options) || options.errorMessage || '';
	if (target && 'string' == typeof target) {
		target = document.getElementById(target);
	}
	if (target) {
		target.innerHTML = html;
	} else {
		document.write(html);
	}
};
UDC.swf.getMovie = function (name) {
	var movie = document[name], ret;
	if (movie && movie.length) {
		movie = (ret = UDC.array.remove(UDC.lang.toArray(movie),function(item){
				return item.tagName.toLowerCase() != "embed";
			})).length >= 1 ? ret[0] : ret;
	}
	if (UDC.browser.ie == 9 || movie){
		ret = movie;
	}else{
		try{ret = window[name];}catch(ex){}
	}
	return ret;
};
UDC.swf.swfVersionCompare = function(needVer){
	needVer = needVer || "9.0.124";
	var needVersion = needVer.split('.');
	var version = (UDC.swf.version || "").split('.');
	var vUnit1, vUnit2;
	for (i = 0; i < 3; i++) {
		vUnit1 = parseInt(version[i], 10);
		vUnit2 = parseInt(needVersion[i], 10);
		if (vUnit2 < vUnit1) {
			break;
		} else if (vUnit2 > vUnit1) {
			return true; // 需要更高的版本号
		}
	}
	return false;
};
UDC.string = {};
UDC.string.encodeHTML = function (source) {
	return String(source)
			.replace(/&/g,'&amp;')
			.replace(/</g,'&lt;')
			.replace(/>/g,'&gt;')
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
};
(function () {
    var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
    UDC.string.trim = function (source) {
        return String(source).replace(trimer, "");
    };
})();
UDC.trim = UDC.string.trim;
UDC.page = {};
UDC.page.getViewHeight = function () {
	var doc = document,	client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;
	return client.clientHeight;
};
UDC.page.getViewWidth = function () {
	var doc = document, client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;
	return client.clientWidth;
};

UDC.array = {};
UDC.array.remove = function (source, match) {
	var len = source.length;
	while (len--) {
		if (len in source && source[len] === match) {
			source.splice(len, 1);
		}
	}
	return source;
};
UDC.array.indexOf = function (source, match, fromIndex) {
    var len = source.length, iterator = match;
    fromIndex = fromIndex | 0;
    if(fromIndex < 0){
        fromIndex = Math.max(0, len + fromIndex)
    }
    for ( ; fromIndex < len; fromIndex++) {
        if(fromIndex in source && source[fromIndex] === match) {
            return fromIndex;
        }
    }

    return -1;
};
UDC.lang = {};
UDC.lang.toArray = function (source) {
	if (source === null || source === undefined)
		return [];
	if (UDC.lang.isArray(source)) return source;
	if (typeof source.length !== 'number' || typeof source === 'string' || UDC.lang.isFunction(source)) {
		return [source];
	}
	if (source.item) {
		var l = source.length, array = new Array(l);
		while (l--)
			array[l] = source[l];
		return array;
	}
	return [].slice.call(source);
};
UDC.lang.isFunction = function (source) {
	return '[object Function]' == Object.prototype.toString.call(source);
};
UDC.isArray = function (source) {
	return '[object Array]' == Object.prototype.toString.call(source);
};
UDC.cookie = {
    get : function(name) {
        var c = document.cookie;
        if ( !c.length ) {
            return '';
        }
        var tp = c.split( '; ' );
        for ( var i = tp.length - 1; i >= 0; i-- ) {
            var tm = tp[ i ].split( '=' );
            if ( tm.length > 1 && tm[ 0 ] == name && tm[ 1 ] ) {
                return unescape(UDC.trim( tm[ 1 ] ) );
            }
        }
        return '';
    },
    set : function(name, value) {
        var expires = new Date();
        expires.setTime( (new Date()).getTime() + 3600 * 24 * 1000 * 365 );
        document.cookie = name + "=" + escape( value ) + "; path=/; host=" + window.location.host + ";expires=" + expires.toGMTString();
    }
};

UDC.aps  = UDC.aps || [];
UDC.reqIndex = UDC.reqIndex || 0;

;(function(){
	var doc = document, eles = document.getElementsByTagName('script'), len = eles.length, domId, match, config;
	var getFck = function(){
		var checkGuid = function(str){
			if(!str) return '';
			return String(str).match(/[a-zA-Z0-9]{8,64}/i) ? str : '';
		};
		var gmp = function(){
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		var c_guid = checkGuid(String(UDC.cookie.get('_uda_fck')));
		if(!c_guid){
			c_guid = (gmp() + gmp() + gmp() + gmp() + gmp() + gmp() + gmp() + gmp()).toUpperCase();
			UDC.cookie.set('_uda_fck', c_guid, 365);
		}
		return c_guid;
	};
	var guid = function () {
		var guid = "";
		for (var i = 1; i <= 32; i++){
		  var n = Math.floor(Math.random()*16.0).toString(16);
		  guid +=   n;
		}
		return guid;
	};

	var oc = '';
	for(var i = 0; i < len; i++){
		domId = eles[i].getAttribute('id');
		if(!domId) continue;
		match = /^udc\-(.*?)$/.exec(domId);
		if(!match) continue;
		if(UDC.array.indexOf(UDC.aps, match[2]) > -1) return;
		oc = match[1];
		break;
	}

	if(!window._udc && oc){
		window._udc = true;
		var mick = getFck();
		var url = 'http://stat.funshion.net/ecom-ad/ifar_load/?rprotocol=1&mick=' + mick + '&oc='+encodeURIComponent(oc)+'&loc=' + encodeURIComponent(window.location.href) + '&ref='+encodeURIComponent(document.referrer)+'&ua=' + encodeURIComponent(navigator.userAgent) + '&beif=' + (window == top ? 0 : 1) + '&fin=' + (UDC.swf.version ? 1 : 0) + '&ext=';
		(new Image()).src = url;

		if(Math.random() * 10000 < 100){
			var pvid = guid(), index = 0;
			setInterval(function(){
				index++;
				var url = 'http://stat.funshion.net/ecom-ad/ifar_duration/?rprotocol=1&mick=' + mick + '&oc='+encodeURIComponent(oc)+'&pvid=' + pvid + '&tod='+( index * 5 )+'&ext=';
				(new Image()).src = url;
			}, 5000);
		}

		//拉去vasd
		var url = 'http://vasd.fun.tv/vasd/pa/index?sid=' + oc ;
		var sc = document.createElement('iframe');
		sc.frameborder = '0';
		sc.style.width = '0px';
		sc.style.height = '0px';
		sc.style.position = 'absolute';
		sc.style.border = 0;
		sc.style.scrolling = 'no';
		sc.style.right = 0;
		sc.style.bottom = 0;
		sc.src = url;
		document.body.insertBefore(sc, document.body.firstChild);
	}
})();