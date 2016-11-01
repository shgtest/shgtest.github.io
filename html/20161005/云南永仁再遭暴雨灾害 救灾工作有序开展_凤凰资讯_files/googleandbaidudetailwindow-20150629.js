  var _IFENG_WINDOW_CTRL_BD = true;
  var ifeng_Detail_Window_Flag = true; 
  var ifeng = ifeng || {};
  ifeng.Ad = ifeng.Ad || {} ;
  ifeng.Util = ifeng.Util || {};
  ifeng.Util.myAttachEventfunction = function(obj, evt, fn){
		if (obj.addEventListener) {
			obj.addEventListener(evt, fn, false);
		} else if (obj.attachEvent) {
			obj.attachEvent("on" + evt, fn);
		} else {
			obj["on" + evt] = fn;
		}
  };
  ifeng.Util.removemyAttachEvent = function(obj,evt,fn){
        if(obj.removeEventListener){
            obj.removeEventListener(evt,fn,false);
        }
        else if(obj.detachEvent){
            obj.detachEvent("on"+evt,fn);
        }
        else{
            obj["on"+evt]=null;
        }
    };
  ifeng.Util.merge = function(source, target) {
	if(!source) return {}; 
	if(!target) return source; 
	var r = {};
	for(var i in source) {
		r[i] = typeof target[i] == 'undefined' ? source[i] : target[i];
	}
	return r;
};
ifeng.Util.getById = function(id) {
	if(id == 'body') {
		return document.body;
	}else {
		return document.getElementById(id);
	}
};
ifeng.Util.createElement = function(tag, props, event, fn) {
	var t = document.createElement(tag),
		pos = props['position'],
		addListener = function() {
			if(pos && pos == 'fixed' && ifeng.Util.browser().IE6) {
				var top = typeof props['top'] == 'undefined' ? 0 : props['top'];
				if(typeof top == 'string' && top.length > 2) {
					top = Number(top.split('px')[0]);
				}else {
					top = Number(top);
				}
				props['position'] = 'absolute';
				
				delete props['top'];
			}
			delete props['isListen'];
		};
	!props['isListen'] ? null : addListener(); 
	for(var i in props) {
		t.style[i] = props[i];
		
	}
	if(!event || !fn) { return t;}
	if(event.constructor == Array) {
		for(var i = 0, len = event.length; i < len; i++) {
			(function(i){
				ifeng.Util.bind(t, event.event, event.fn);
			})(i);
		}
	}else {
		ifeng.Util.bind(t, event, fn);
	}
	return t;
};
ifeng.Util.browser = function() {
	var b = {}, a = navigator.userAgent.toLowerCase();
	b.IE = /msie/.test(a);
	b.OPERA = /opera/.test(a);
	b.MOZ = /gecko/.test(a);
	b.IE6 = /msie 6/.test(a);
	b.IE7 = /msie 7/.test(a);
	b.IE8 = /msie 8/.test(a);
	b.SAFARI = /safari/.test(a);
	b.CHROME = /chrome/.test(a);
	b.IPHONE = /iphone os/.test(a);
	return b;
};
//获得二级域名（频道域名）
ifeng.Util.getSecondDomain = function() {
		var arr_domain=document.domain.split(".");
		return arr_domain[0];
};
ifeng.Util.getFileName = function(url) {
	if(url == '' || typeof url == 'undefined') {
		return '';
	}
	var lastNode = url.lastIndexOf('/');
	return url.substring(lastNode + 1, url.lastIndexOf('.'));
}
ifeng.Ad.Cookie = {

	setCookie : function (name, value, options) {
		if(!this.validateCookieName(name)){
            return;
        };
		if (this.isUndefined(value)){
			return;
		}
		options = options || {};
		var text = this._createCookieString(name, value, !options.raw, options);
		document.cookie = text;
		return text;
	},


    getCookie : function (name, options) {
        if(!this.validateCookieName(name)){ return;};
        var cookies,
            cookie,
            converter;
        if (this.isFunction(options)) {
            converter = options;
            options = {};
        } else if (this.isObject(options)) {
            converter = options.converter;
        } else {
            options = {};
        }

        cookies = this._parseCookieString(document.cookie);
        cookie = cookies[name];
        if (this.isUndefined(cookie)) {
            return null;
        }
        if (!this.isFunction(converter)){
            return cookie;
        } else {
            return converter(cookie);
        }
    },

    _createCookieString : function (name, value,encodeValue,options) {
		options = options || {};
		encodeValue = true;
		 var text  = encodeURIComponent(name) + "=" + (encodeValue ? encodeURIComponent(value) : value),
	         expires = options.expires,
	         path    = !options.path ? '/':options.path,
	         domain  = !options.domain ? location.host : options.domain;
		if (this.isObject(options)){
			if (typeof expires === 'number'){ 
				text += "; expires=" + new Date(expires).toUTCString();
			}
			if (this.isString(path) && path !== ""){
				text += "; path=" + path;
			}
			if (this.isString(domain) && domain !== ""){
				text += "; domain=" + domain;
			}
			if (options.secure === true){
				text += "; secure";
			}
		}
		return text;
	},

    _parseCookieString : function (text) {
        var cookies = {};
        if (this.isString(text) && text.length > 0) {
            var cookieParts = text.split(/;\s/g),
                cookieName  = null,
                cookieValue = null,
                cookieNameValue = null;

            for (var i=0, len=cookieParts.length; i < len; i++){
                cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
                if (cookieNameValue instanceof Array){
                    try {
                        cookieName = cookieNameValue[1];
                        cookieValue = cookieParts[i].substring(cookieNameValue[1].length+1);
                    } catch (ex){

                    }
                } else {
                    cookieName = cookieParts[i];
                    cookieValue = "";
                }
                cookies[cookieName] = decodeURIComponent(cookieValue);
            }

        }
        return cookies;
    },

    remove : function (name, options) {
        this.validateCookieName(name);
        options = options || {};
        options.expires = new Date(0);
        return this.setCookie(name, "", options);
    },
	validateCookieName : function(name) {
        if (!this.isString(name) || name === ""){
            return false;
        }else{
            return name;
        }
    },
	isUndefined : function(o) {
	    return typeof o === 'undefined';
	},
	isString : function(o) {
	    return typeof o === 'string';
	},
	isFunction : function(o) {
	    return typeof o === 'function';
	},
	isObject : function(o, failfn) {
	    var t = typeof o;
	    return (o && (t === 'object' || (!failfn && (t === 'function' || this.isFunction(o))))) || false;
	}
};
ifeng.Util.bind = function(target, event, callback, scope) {
	// 如果指定了scope，将其作为callback的this传入callback方法
	var delegate = callback;
	if (scope) {
		delegate = function(event) {
			callback.call(scope, event); 
		};
	}
	// 根据浏览器绑定事件
	if (window.addEventListener) {  // Mozilla, Chrome, Firefox
		target.addEventListener(event, delegate, false);
	} else {  // IE
		target.attachEvent("on" + event, delegate);
	}			
};
ifeng.Util.paseJSON = function(str) {
	return (new Function('return ' + str))();
};

ifeng.Ad.IfengWindow = function(options){
	var _ = this;
	_.windowPlayTime = options.windowPlayTime;
	_.windowSwfPlayTime = options.windowSwfPlayTime;
	_.impressionUrl = options.monitorUrl;
    _.flightId = options.flightId;
	_.ifengWindowEncode = function(encodeParameter){
		if(encodeParameter){
			return encodeParameter.replace(/&/g, '%26');
		}else{
			return '';
		}
	};
	_.ifengWindowSwfObject = null;
	_.options = ifeng.Util.merge({
	    	movie: '',
			IfengWindowSource: '',
			swfUrl : '',
			swfHuiShou:'',
	    	ifengLink: '',
	    	targetId: 'body',
	    	width: 300,
	    	height: 250,
            zIndex: 999,
            cwidth:10,
            cheight:10,
            falshvar:'',
            bottom: 0,
            right:0,
	    	delayTime:0,
            closeTime: 1,
            maxOpenTime: '',
			IfengWindowBottom:0,
			flashvar:'movie='+ _.ifengWindowEncode(options.movie) +'&IfengWindowSource='+ _.ifengWindowEncode(options.IfengWindowSource) +'&swfUrl='+ _.ifengWindowEncode(options.swfUrl) +'&clickUrl='+ 
_.ifengWindowEncode(options.clickUrl) +'&monitorUrl='+ _.ifengWindowEncode((options.monitorUrl).join('@_@')) +'&replayUrl='+ _.ifengWindowEncode(options.replayUrl) +'&playUrl='+ _.ifengWindowEncode(options.playUrl) +'?inUrl='+ options.reginUrl +'&isAutoPlay='+ options.isAutoPlay +'&windowPlayTime='+ options.windowPlayTime },options);
		_.myname = 'whh';
	_.getcookie = function(name){
		var splitCookie = document.cookie.split("; ");
			for(var i = 0; i < splitCookie.length; i++) {
				var cookieNameValue = splitCookie[i].split("=");
				if(cookieNameValue[0] == name) {
					return unescape(cookieNameValue[1]);
				}
			}
			return '';
	};
	    //得到一个cookie的值
	_.setcookie = function (name, value, time) {
			var expiresTime = new Date(date.getTime() + time * 60000);
			document.cookie = name + "=" + escape(value) + ";path=/;expires=" + expiresTime.toGMTString() + ";";
		}; 
	var el = ifeng.Util.getById(_.options.targetId);
	if(!el) {
		 throw new Errors('the target container is not exist.');
		 return;
	}
	_.swfSource = 'http://img.ifeng.com/tres/html/coupletnew/adbig_90x250-new.swf';
	_.el = el;
    _.options.top = document.documentElement.clientHeight-_.options.height;
	 _.options.top = parseInt(document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + 
document.documentElement.clientHeight - _.options.height;
	var browser = ifeng.Util.browser();
	var viewDiv = ifeng.Util.createElement('div',{
 		//	display: 'none',
            position : browser.IE6 ? 'absolute' : 'fixed',
		    right:_.options.right +'px',
            width:_.options.width+'px',
            height:_.options.height+'px',
            zIndex:_.options.zIndex,
			bottom: '-250px',
			isListen: true
 		});
	var viewDivSmall = ifeng.Util.createElement('div',{
 			display: 'none',
            position : browser.IE6 ? 'absolute' : 'fixed',
		    right:_.options.right +'px',
            width:100+'px',
            height:100+'px',
            zIndex:_.options.zIndex,
			bottom: 0 + 'px',
			isListen: true
 		});
		if(_.options.swfUrl && !/\.html$/.test(_.options.swfUrl.toLowerCase()) ){
			mastDivBig = ifeng.Util.createElement('div',{
				position:'absolute',
				top:0,
				left:0,
				zIndex:_.options.zIndex+1
			});
			mastDivBig.innerHTML = "<a href='" + options.clickUrl + "' target='_blank'><img style='border:none;width:" + _.options.width+ "px;height:" + _.options.height + "px' src='http://img.ifeng.com/tres/recommend/html/test/1x1.gif' /></a>";
		}
		mastDiv = ifeng.Util.createElement('div',{
			position:'absolute',
			top:0,
			left:0,
			zIndex:_.options.zIndex+2
		});
		mastDiv.innerHTML = "<a href='javascript:;' onclick='ifengWindowInstance.callWindow();' ><img style='border:none;width:" + 100 + "px;height:" + 100 + "px' src='http://img.ifeng.com/tres/recommend/html/test/1x1.gif' /></a>";
		smallCloseDiv = ifeng.Util.createElement('div',{
			position: 'absolute',
			top:"-12px",
			right:0
		});
		smallCloseDiv.innerHTML = "<a href='javascript:;' onclick='this.parentNode.parentNode.style.display = \"none\";'><img src='http://y1.ifengimg.com/1d124ac5e89463af/2012/1229/close.gif' style='border:none;' /></a>";
		smallCloseDiv.onclick = function(){
				smallCloseDiv.style.display = 'none';
		};

        inDiv =ifeng.Util.createElement('div',{
            position: 'relative',
            width:_.options.width+'px',
            height:_.options.height+'px'
        });
 		closeDiv = ifeng.Util.createElement('div',{
 			right: '6px',
            bottom:_.options.height-14+'px',
 			width: _.options.cwidth +'px',
 			height: _.options.cheight+'px',
            position: 'absolute',
            zIndex: _.options.zIndex+2
 		});
		if(_.options.swfUrl){
			closeDiv.innerHTML = "<a href='javascript:;' onclick='ifengWindowPlayComplete();'><img src='http://y1.ifengimg.com/1d124ac5e89463af/2012/1229/close.gif' style='border:none;' /></a>";
		}
		flashDiv = ifeng.Util.createElement('div',{
 			width: _.options.width+'px',
 			height: _.options.height+'px',
            bottom: 0+'px',
            position: 'absolute',
            zIndex: _.options.zIndex+1
 		});
			viewDivSmall.appendChild(mastDiv);
		viewDivSmall.appendChild(smallCloseDiv);
	inDiv.appendChild(flashDiv);
    viewDiv.appendChild(inDiv);
	if(_.options.swfUrl){
		viewDiv.style.display = 'none';
	}else{
		viewDiv.style.height = '250px';
		viewDiv.style.overflow = 'hidden';
	}
	if(_.options.swfUrl){
		// viewDiv.appendChild(mastDivBig);
		 viewDiv.appendChild(closeDiv);
	}
    _.viewDiv = viewDiv;
	_.closeDiv = closeDiv;
	_.flashDiv =flashDiv;
	_.viewDivSmall = viewDivSmall;
    if(browser.IE6){
        ifeng.Util.bind(document, 'mousewheel', function() {  
		    _.viewDiv.style.top = document.documentElement.scrollTop + _.options.top + 'px';
		});
    }				
};

ifeng.Ad.IfengWindow.prototype = {
	fnScroll : function(){
		var _ = this;
		_ = ifengWindowInstance;
		 _.options.top = parseInt(document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + document.documentElement.clientHeight - _.options.height-_.options.IfengWindowBottom;
		_.viewDiv.style.top = _.options.top + 'px';
		_.options.left = parseInt(document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + document.documentElement.clientWidth - _.options.width;
		_.viewDiv.style.left = _.options.left - _.options.right + 'px';
		_.viewDivSmall.style.top = (parseInt(document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + document.documentElement.clientHeight - 100-_.options.IfengWindowBottom) + 'px';
		_.viewDivSmall.style.right = 0 +'px';
		
	},
	fnResize : function (){
		var _ = this;
		_ = ifengWindowInstance;
		 _.options.top = parseInt(document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + document.documentElement.clientHeight - _.options.height;
		 _.viewDiv.style.top = _.options.top + 'px';
		_.options.left = parseInt(document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + document.documentElement.clientWidth - _.options.width;
		_.viewDiv.style.left = _.options.left - _.options.right + 'px';	
		_.viewDivSmall.style.top = (parseInt(document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + document.documentElement.clientHeight - 100-_.options.IfengWindowBottom) + 'px';
		_.viewDivSmall.style.right = 0 +'px';
	},
	run: function(){
		var _ = this;
		_.el.appendChild(_.viewDiv);
		_.el.appendChild(_.viewDivSmall);
		_.setFlash();
		//曝光
		for(var i= 0 ; i< _.impressionUrl.length ; i++){
			if(_.impressionUrl[i]){
				_.toImpression(_.impressionUrl[i]);
			}
		}
	},
	toImpression:function(url){
		var _ = this;
		 var impressionDiv =ifeng.Util.createElement('div',{
            display: 'none',
			width:1+'px',
            height:1+'px'
        });
		 impressionDiv.innerHTML = "<img src='" + url + "' style='border:none;'>";
		 _.el.appendChild(impressionDiv);
	},
	callWindow: function(){
		var _ = this;
		
		_.viewDivSmall.style.display = 'none';
		
		if(_.options.swfUrl){
			_.viewDiv.style.display = 'block';
			_.clearTimeoutswfPlayTime = setTimeout(function(){_.ifengWindowClose();},_.windowSwfPlayTime*1000);
		}else{
			_.viewDiv.style.height = '250px';
			_.viewDiv.style.overflow = 'hidden';
			_.ifengWindowSwfObject.sendToSwf('playVid');
		}
	},
	setFlash: function(){
		
		var _ = this;
		//判断投放的是哪种素材
		if(typeof _.options.IfengWindowSource == 'string' && _.options.IfengWindowSource != ''){
			var ifengWindowSourceSort = _.options.IfengWindowSource;	
		} else {
			var ifengWindowSourceSort = _.options.swfUrl;
		}

		/*
		var movie = _.options.swfUrl ? _.options.swfUrl : _.options.movie;
		_.options.ifengLink  = _.options.swfUrl ? _.options.ifengLink : _.options.ifengLink.replace(/&/g, '%26');
	
		var flash = _.__getFlash({swfurl:movie, width:_.options.width, height:_.options.height,id:"IfengWindowPlayerId"});
		flash.addFlashVars(_.options.flashvar);		
		//flash.addParam("wmode", "transparent");
		flash.addParam("quality", "high");
		flash.addParam("swliveconnect", "true");
		flash.addParam("allowFullScreen", "true");
		flash.addParam("allowScriptAccess", "always");
		
		if(_.options.swfUrl){
			flash.addParam("wmode", "transparent");
		}else{
			flash.addParam("wmode", "transparent");
		}
		*/
		var iframeHtml = "";
		if(/\.html$/.test(_.options.swfUrl.toLowerCase())){
			iframeHtml = '<iframe src="' + _.options.swfUrl + '" width="' + _.options.width + '" height="' + _.options.height + '" frameborder="0" border="0" marginwidth="0" marginheight="0" hspace="0" vspace="0" scrolling="no"></iframe>';
		}
		//控制视窗浮出延迟时间
		setTimeout(function(){
			//_.flashDiv.innerHTML  = flash.play();
			_.flashDiv.innerHTML  = iframeHtml;
			_.ifengWindowSwfObject = navigator.appName.indexOf("Microsoft")!=-1 ? window['IfengWindowPlayerId'] : document['IfengWindowPlayerId'];
			if(ifengWindowSourceSort){
				if(_.options.swfUrl){
					_.tofloatTheFlash();
				}
			}
		},_.options.delayTime*1000);
		if(_.options.swfUrl){
			_.viewDiv.style.display = 'block';
		}else{
			_.viewDiv.style.height = '250px';
			_.viewDiv.style.overflow = 'hidden';
		}		
		var flash2 = _.__getFlash({swfurl:_.options.swfHuiShou , width:100, height:100,id:"IfengWindowPlayerIdSmall"});
		flash2.addFlashVars(_.options.flashvar);
		//flash.addParam("wmode", "transparent");
		flash2.addParam("quality", "high");
		flash2.addParam("swliveconnect", "true");
		flash2.addParam("allowFullScreen", "true");
		flash2.addParam("allowScriptAccess", "always");
		
		if(_.options.swfUrl){
			flash2.addParam("wmode", "transparent");
		}else{
			flash2.addParam("wmode", "transparent");
		}
		_.viewDivSmall.innerHTML += flash2.play();
		
	},
	__getFlash : function(settings) {
		return new Player(settings);	
	},
	//控制播放flash
	tofloatTheFlash : function() {	
		var _ = this;
		var interval = setInterval(function() {		
	    _.viewDiv.style.bottom = (parseInt(_.viewDiv.style.bottom) + 25) + "px";
		if(parseInt(_.viewDiv.style.bottom) >=  _.options.IfengWindowBottom-25 ) {
			_.viewDiv.style.bottom = _.options.IfengWindowBottom + 'px'; 
			clearInterval(interval);
			interval = null;
			if(!_.options.swfUrl){
				_.ifengWindowSwfObject.sendToSwf('playVid');   //当视窗全部浮出后，调播放器放法去播放视窗素材
			}
			if(ifeng.Util.browser().IE6){
				ifeng.Util.myAttachEventfunction(window,'scroll',ifengWindowScrollFn);//_.fnScroll ifenggWindowScrollFn
				ifeng.Util.myAttachEventfunction(window,'resize',_.fnResize);
			}
		}
	   },50);
	},	
	ifengWindowClose:function(){//关闭视窗
		var _ = this;
		if(_.options.swfUrl){
			_.viewDiv.style.display = 'none';
			clearTimeout(_.clearTimePlayTime);
			if(typeof _.clearTimeoutswfPlayTime != 'undefined'){
				clearTimeout(_.clearTimeoutswfPlayTime);
			}
		}else{
			_.viewDiv.style.height = '0px';
			_.viewDiv.style.overflow = 'hidden';
			_.ifengWindowSwfObject.sendToSwf('pauseVid');//停止声音
		}
		
		if(ifeng.Util.browser().IE6){
			
			function removemyAttachEvent(obj,evt,fn){
					if(obj.removeEventListener){
						obj.removeEventListener(evt,fn,false);
					}
					else if(obj.detachEvent){
						obj.detachEvent("on"+evt,fn);
					}
					else{
						obj["on"+evt]=null;
					}
			}		
		}		
		//_.displaySmall();
	},
	displaySmall : function(){
		var _ = this;
		_.viewDivSmall.style.display = 'block';
	}
};

var Player = function(settings) {
	this.settings = ifeng.Util.merge({ swfurl : "", width : 300, height : 225, id : "" }, settings);
	this.params = {};
	this.variables = {};
	this.flashvars = '';
};
Player.prototype = {
	addParam: function(name, value) {
		this.params[name] = value;
	},
	addVariable: function(name, value) {
		this.variables[name] = value;
	},
	getVariables: function() {
		var a = [], o = this.variables;
		for(var i in o) {
			a.push(i + "=" + o[i]);
		}
		return a.join("&");
	},
	getParamString: function(isIE) {
		var a = [], o = this.params;
		if(isIE) {
			for(var i in o) {
				a.push('<param name="' + i + '" value="' + o[i] + '">');
			}
		}else {
			for(var i in o) {
				a.push(i + "=" + o[i] + " ");
			}
		}
		return a.join("");
	},
	addFlashVars: function(str) {
		this.flashvars = str;
	},
	//与flash程序进行交互调用
	callExternal: function(movieName, method, param, mathodCallback) {
		var o = navigator.appName.indexOf("Microsoft") != -1 ? window[movieName] : document[movieName];
		o[method](param, mathodCallback);
	},
	play : function() {
		var fls = this.getVersion();
		if (!(parseInt(fls[0] + fls[1] + fls[2]) > 901)) {
			return '<a style="display:block;height:31px;width:165px;line-height:31px;font-size:12px;text-decoration:none;text-align:center;margin:10px auto;border:2px outset #999;" href="http://get.adobe.com/flashplayer/" target="_blank">???????Flash??????</a>';
		}
		var f = [];
		if (!!window.ActiveXObject) {
			f.push('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" width="');
			f.push(this.settings.width);
			f.push('" height="');
			f.push(this.settings.height);
			f.push('" id="');
			f.push(this.settings.id);
			
			f.push('"><param name="movie" value="');
			f.push(this.settings.swfurl);
			f.push('"><param name="flashvars" value="');
			f.push(!this.flashvars ? this.getVariables() : this.flashvars);
			f.push('">');
			f.push(this.getParamString(true));
			f.push("</object>");
		} else {
			f.push('<embed pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"');
			f.push(' id="');
			f.push(this.settings.id);
			f.push('" name="');
			f.push(this.settings.id);
			f.push('" src="');
			f.push(this.settings.swfurl);
			f.push('" height="');
			f.push(this.settings.height);
			f.push('" width="');
			f.push(this.settings.width);
			f.push('" flashvars="');
			f.push(!this.flashvars ? this.getVariables() : this.flashvars);
			f.push('" ');
			f.push(this.getParamString(false));
			f.push(">");
		}
		return f.join("");
	},
	getVersion : function() {
		var b = [ 0, 0, 0 ];
		if(navigator.plugins && navigator.mimeTypes.length) {
			var plugins = navigator.plugins["Shockwave Flash"];
			if(plugins && plugins.description) {
				return plugins.description.replace(/^\D+/, "").replace(/\s*r/, ".").replace(/\s*[a-z]+\d*/, ".0").split(".");
			}
		}
		if(navigator.userAgent && navigator.userAgent.indexOf("Windows CE") != -1) {
			var c = 1, f = 3;
			while (c) {
				try {
					c = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + (++f));
					return [ f, 0, 0 ];
				} catch (d) {
					c = null;
				}
			}
		}
		try {
			var c = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		}catch (d) {
			try {
				var c = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
				b = [ 6, 0, 21 ];
				c.AllowScriptAccess = "always";
			} catch (d) {
				if (b.major == 6) return b;
			}
			try {
				c = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			} catch (d) {
			}
		}
		if (c) {
			b = c.GetVariable("$version").split(" ")[1].split(",");
		}
		return b;
	}
};
function ifengWindowGoPage(url){
	window.open(url);
}
var ifengWindowInstance = new ifeng.Ad.IfengWindow(googleAndBaiduDetailWindowConfig);
	ifengWindowInstance.run();
	function ifengWindowPlayComplete(){
		ifengWindowInstance.ifengWindowClose();
	}
	function ifengWindowScrollFn(){
		ifengWindowInstance.fnScroll();
	}
	function ifengWindowTofloatTheFlash(){
		ifengWindowInstance.tofloatTheFlash();
	}
	var ifengWindowUserAgent = navigator.userAgent.toLowerCase();
	if(/firefox/.test(ifengWindowUserAgent) == true && /3.6.19/.test(ifengWindowUserAgent) == true){
		ifengWindowTofloatTheFlash();
	}