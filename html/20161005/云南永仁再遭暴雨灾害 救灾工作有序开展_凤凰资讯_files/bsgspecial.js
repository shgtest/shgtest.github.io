var ifengCouplet = function(Obj){
	//ie6下防抖动
	document.body.style.cssText += '_background-image: url(about:blank);_background-attachment: fixed;';
	var _ = this;
	Obj['top'] == 'undefined' ? 0 : Obj['top'];
	_.leftCouplet = _.createElement('div',{'width':Obj['bigWidth'] + 'px', zIndex:Obj.zIndex, 'height':'auto', position:'fixed',display:'block', top:Obj['top'] + 'px', left:Obj['left'] + 'px'}, 'leftCoupletId');
	_.rightCouplet = _.createElement('div',{width:Obj['bigWidth'] + 'px', zIndex:Obj.zIndex, height:'auto', position:'fixed', display:'block', top:Obj['top'] + 'px', right:Obj['right'] + 'px'}, 'rightCoupletId');
	_.bigContentRight = _.createElement('div',{width:Obj['bigWidth'] + 'px', height:'0px', overflow:'hidden', position:'relative'}, 'bigContentRightId');
	_.bigContentLeft = _.createElement('div',{width:Obj['bigWidth'] + 'px', height:'0px', overflow:'hidden', position:'relative'}, 'bigContentLeftId');

	document.body.insertBefore(_.leftCouplet, document.body.childNodes[0]);
	document.body.insertBefore(_.rightCouplet, document.body.childNodes[0]);
	_.getElementId('rightCoupletId').appendChild(_.bigContentRight);
	_.getElementId('leftCoupletId').appendChild(_.bigContentLeft);
	if(_.ext(Obj.coupletSourceBig) == 'swf'){
		if(Obj.isInteractionBig == 0){
			_.sourseHtmlBig =  '<div style="width:' + Obj.bigWidth + 'px; height:' + Obj.bigHeight + 'px;"><object width="'+ Obj.bigWidth +'" height="'+ Obj.bigHeight +'" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">'+
				'<param value="'+ Obj.coupletSourceBig +'" name="movie">'+
				'<param value="high" name="quality">'+
				'<param value="opaque" name="wmode">'+
				'<embed width="'+ Obj.bigWidth  +'" height="'+ Obj.bigHeight +'" wmode="opaque" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" quality="high" src="'+ Obj.coupletSourceBig +'"></object></div>'+
				'<a href="'+Obj.clickUrl+'" target="_blank" style="width:'+Obj.bigWidth +'px;height:'+Obj.bigHeight+'px;background:red;position:absolute; top:0; left:0;cursor:pointer;filter:alpha(opacity='+0+');-moz-opacity:0;opacity:0;"></a>';
		} else if(Obj.isInteractionBig == 1){
			Obj.clickUrl = Obj.clickUrl.replace(/&/g, '%26');
			_.sourseHtmlBig =  '<div style="width:' + Obj.bigWidth  + 'px; height:' + Obj.bigHeight + 'px;"><object width="'+ Obj.bigWidth  +'" height="'+ Obj.bigHeight +'" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">'+
				'<param value="'+ Obj.coupletSourceBig +'?clickTag='+ Obj.clickUrl +'" name="movie">'+
				'<param value="high" name="quality">'+
				'<param value="opaque" name="wmode">'+
				'<embed width="'+ Obj.bigWidth  +'" height="'+ Obj.bigHeight +'" wmode="opaque" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" quality="high" src="'+ Obj.coupletSourceBig +'?clickTag='+ Obj.clickUrl +'"></object></div>';
		}
	}else if(_.ext(Obj.coupletSourceBig) == "jpg" || _.ext(Obj.coupletSourceBig) == "png" || _.ext(Obj.coupletSourceBig) == "gif"){
		_.sourseHtmlBig = '<div style="width:' + Obj.bigWidth + 'px; height:' + Obj
			.bigHeight + 'px;"><a href="'+Obj.clickUrl+'" target="_blank" style="cursor:pointer;"><img src = "'+ Obj.coupletSourceBig +'"/></a></div>';
	}else{
		_.sourseHtmlBig = '<div style="width:' + Obj.bigWidth  + 'px; height:' + Obj
			.bigHeight + 'px;"><iframe src="' + Obj.coupletSourceBig + '" width="' + Obj.bigWidth + '" height="' + Obj.bigHeight + '" scrolling="no" frameborder="0"/></iframe></div>';
	}
	_.getElementId('bigContentLeftId').innerHTML = '<div style="background:#eee;width:' + Obj.bigWidth + 'px;height:15px;"><span style="float:right;cursor:pointer;text-decoration:underline;height:15px; line-height:15px;" id="coupletLeftCloseBtn">关闭</span></div>' + _.sourseHtmlBig ;
	_.getElementId('bigContentRightId').innerHTML = '<div style="background:#eee;width:' + + Obj.bigWidth + 'px;height:15px;"><span style="float:left;cursor:pointer;text-decoration:underline;height:15px; line-height:15px;" id="coupletRightCloseBtn">关闭</span></div>' + _.sourseHtmlBig ;
//ie6下刷新时滚动条在页面顶部及中间位置，都不会执行onsrcoll，其它浏览器刷新时滚动条如在最顶部，不会执行onscroll，在中间会执行onscroll
	if(_.browser().IE6) {
		ieFunScroll();
		_.addEventFunction(window,'scroll',ieFunScroll);
	}else{
		_.addEventFunction(window,'scroll',otherBrowFunScroll);
		var otherBrowscrollTop = document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop;
			_.displayBig(Obj);
	}
	function otherBrowFunScroll(){
		var otherBrowscrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
			_.displayBig(Obj);
	}
	function ieFunScroll(){
		var ieScrollTop = parseInt(document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
		_.getElementId('leftCoupletId').style.top = _.getElementId('rightCoupletId').style.top = ieScrollTop + Obj['top'] + 'px';
			_.displayBig(Obj);
	}
	_.getElementId('coupletLeftCloseBtn').onclick = _.getElementId('coupletRightCloseBtn').onclick = function(){
		_.hiddenBig(Obj);
		_.removeHandler(window,'scroll',otherBrowFunScroll,ieFunScroll);
	};
};
ifengCouplet.prototype = {
	displayBig : function(Obj){
		var _ = this;
		_.getElementId('bigContentLeftId').style.height = _.getElementId('bigContentRightId').style.height = Obj.bigContentHeight + 'px';
		_.getElementId('leftCoupletId').style.width = _.getElementId('rightCoupletId').style.width = _.getElementId('bigContentRightId').style.width = Obj.bigWidth + "px";
	},
	getElementId : function(targetId) {
		return document.getElementById(targetId);
	},
	hiddenBig : function(Obj){
		var _ = this;
		_.getElementId('bigContentLeftId').style.height = _.getElementId('bigContentRightId').style.height = '0px';
	},
	createElement : function(target, styleObj, Id) {
		var _ = this;
		var element = document.createElement(target);
		if(styleObj['position'] == 'fixed' && _.browser().IE6) {
			styleObj['position'] = 'absolute';
		}
		for(var i in styleObj) {
			element.style[i] = styleObj[i];
		}
		if(typeof Id != 'undefined'){
			element.id = Id;
		}
		return element;
	},
	addEventFunction : function(obj,evt,fn){
		if (obj.addEventListener) {
			obj.addEventListener(evt, fn, false);
		} else if (obj.attachEvent) {
			obj.attachEvent("on" + evt, fn);
		} else {
			obj["on" + evt] = fn;
		}
	},
//清除事件
	removeHandler:function(element,type,handler1,handler2){
		if(element.removeEventListener){
			element.removeEventListener(type,handler1,false);
		}
		else if(element.detachEvent){
			element.detachEvent("on"+type,handler2);
			element.detachEvent("on"+type,handler1);
		}
		else{
			element["on"+type]=null;
		}
	},
	browser : function() {
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
	},
	ext : function(s) {
		var pairs;
		var file;
		var s = s.replace(/(\\+)/g, '#');
		pairs = s.split('#');
		file = pairs[pairs.length - 1];
		pairs = file.split('.');
		ext = pairs[pairs.length - 1];
		return ext.toLowerCase();
	}
};

var instance = new ifengCouplet({
	coupletSourceBig : ifengcouplet_set.sourceBig ? ifengcouplet_set.sourceBig : ifengcouplet_default.sourceBig,//大素材地址
	clickUrl : ifengcouplet_set.clickUrl ? ifengcouplet_set.clickUrl : ifengcouplet_default.clickUrl,     //点击地址
	bigWidth : ifengcouplet_set.bigWidth ? parseInt(ifengcouplet_set.bigWidth) : parseInt(ifengcouplet_default.bigWidth),
	bigHeight : ifengcouplet_set.bigHeight ? parseInt(ifengcouplet_set.bigHeight) : parseInt(ifengcouplet_default.bigHeight),
	bigContentHeight : ifengcouplet_set.bigContentHeight ? parseInt(ifengcouplet_set.bigContentHeight) : parseInt(ifengcouplet_default.bigContentHeight),
	top : ifengcouplet_set.top ? parseInt(ifengcouplet_set.top) : parseInt(ifengcouplet_default.top),
	left : ifengcouplet_set.left ? parseInt(ifengcouplet_set.left) : parseInt(ifengcouplet_default.left),
	right : ifengcouplet_set.right ? parseInt(ifengcouplet_set.right) : parseInt(ifengcouplet_default.right),
	isInteractionBig : ifengcouplet_set.isInteractionBig ? parseInt(ifengcouplet_set.isInteractionBig) : parseInt(ifengcouplet_default.isInteractionBig),   //大素材，0为不互动，1为互动
	zIndex : ifengcouplet_set.zIndex ? parseInt(ifengcouplet_set.zIndex) : parseInt(ifengcouplet_default.zIndex),
	theFirstScreen : ifengcouplet_set.theFirstScreen ? parseInt(ifengcouplet_set.theFirstScreen) : parseInt(ifengcouplet_default.theFirstScreen)     //大素材定位出现的位置
});
