window.F = window.F ||{};
window.F.config = {
	timeStrart : (new Date()).getTime(),
	ctrlname : 'vplay_'
};

window.F.tool = window.F.tool || {};
F.tool.stat = F.tool.stat || {};
//url_referer
media_referer = "http://vas.fun.tv/market/ext/open_vv.html";

//url_mapping
result = /(m|g|v)-(\d+)/.exec(location.href);
var media = {};
media.url = encodeURIComponent(location.href);
media.hashid = window.parent.hashid;
media.videoid = (result ? result[2] : "");//vplay.videoid
media.mediatype = '%7C%7C%7C%7C';//F.config.mediatype

(function(){
	var key = '_pvlog', lt = 0, dckey = '_dclog', keyVals = ['type', 'param', 'root', 'isStat'];
	var getLog = function(){
		//将获取的cookie数解析成json对象
		var data = T.json.parse(F.cookie.get(key).toString()), ret = [];
		//如果没有C或者C不是一个数组 就返回一个空数组
		if(!data || !T.isArray(data)) return [];

		var item, val;
		for (var i = 0; i < data.length; i++){
			item = {};
			for(var k = keyVals.length - 1; k >= 0; k--){
				val = data[i][k];
				item[keyVals[k]] = val == undefined ? '' : val;
			}
			ret.push(item);
		}
		return ret;
	};
	var setLog = function(option){
		//声明变量C 赋值函数getLog()返回值
		var data = getLog(), ret = [];
		data.push(option);

		var item, val;
		for (var i = 0; i < data.length; i++){
			item = [];
			for(var k = keyVals.length - 1; k >= 0; k--){
				val = data[i][keyVals[k]];
				item[k] = val == undefined ? '' : val;
			}
			ret.push(item);
		}

		//设置cookie值 有效期为1天
		F.cookie.set(key, T.json.stringify(ret), 1);
	};
	
	F.tool.pvManager = {

		/*
		 * add,send为对象方法
		 * add添加一个委托
		 * */
		add:function(type, param, root){
			var arg = arguments, option;
			option = T.isString(type) ? 
						{type: arg[0], param: arg[1], root: arg[2]}
						: type || {};
			
			option.param = option.param || {};

			// 500毫秒连续添加将会被抛弃 ps: fl不太理解这, 是防止cookie大量写入?
			var t = (new Date()).getTime();
			if(t - this.lt < 500) return this;
			lt = t;
			
			// 如果是被嵌套的时候, 无法写cookie直接发送上报
			if (window != top) {
				F.tool.pv.send(option);
			} else {
				setLog(option);
			}
			return this;
		},
		send:function(){
			var datas = getLog(), item;
			if(!datas.length) return this;

			for(var i = 0; i < datas.length; i++){
				item = datas[i];
				if (item.length < 2) continue;
				F.tool.pv.send(item);
			}
			//设置cookie为回话cookie
			F.cookie.set(key, '', -365);
			return this;
		}
	};
})();
(function(){
	var logKey = 'track_log', trackKey = 'track_click', map = {}, trackBlock = '';
	var sendHandle = function(option){
		option = T.extend({
				param : {},
				root : 'website',
				domain : 'http://stat.funshion.net/',
				split : '&'
			}, option || {});
		option.root = option.root || 'website';

		var param = option.param || {},
			paramStrs = option.paramBefore || ['mac='+F.cookie.get('Mac'), 'userid='+F.user.userid, 'fpc='+F.cookie.get('_fpc')],
			path = option.path || (option.domain + option.root + '/' + option.type + "?"),
			paramAfter = option.paramAfter || [],
			encodeFun = encodeURIComponent;
		
		// 用于新版数据上报的特殊处理
		if (option.isStat) {
			paramStrs = [];
			option.split = '*_*';
			paramAfter = [];
			encodeFun = function(str){return str};
		}
		
		var val;
		for(var key in param){
			if(typeof param[i] == 'function') continue;
			val = param[key] == undefined ? '' : param[key];
			paramStrs.push(key.toString() + "=" + encodeFun(val.toString()));
		}
		for(var i = 0; i < paramAfter.length; i++){
			paramStrs.push(paramAfter[i]);
		}

		F.tool.pv.dispatch(path + paramStrs.join(option.split));
		return false;
	}

	F.tool.pv = {
		send:function(type, param, root){
			var arg = arguments, option;
			if (T.isString(type)) {
				option = {type: arg[0], param: arg[1], root: arg[2]};
			}else {
				option = type || {};
			}

			sendHandle(option);
		},
		dispatch : function(url){
			if(!url) return;
			setTimeout(function(){
				//创建一个dom节点
				var img = T.dom.create('img', {src:url});
				img.onload = function(){
					img;
				}
			},200);
		}
	}
	F.tool.FTH = {
		empty : function(){
			map.target = '';
			delete map.type;
			F.cookie.set(logKey, '', -365);
			return this;
		}
	};

	F.tool.pv.referrer = function(){
		// 获取来源页地址, 当搜索页使用js跳转过来时, 只能使用opener来获取前一个页面.
		var ref = '';
		try{
			ref = (document.referrer.length > 0) ? document.referrer : (window.opener && opener.location && opener.location.href) ? opener.location.href : '';
		}catch(e){}
		return ref;
	};

})();

(function(){
	var pgPv = {
		rprotocol : '4',
		firstname : 'website',
		secondname : 'pv',
		protocol : [
			"rprotocol",         // 日志请求协议版本号，由前端发送，表明前端发送的版本号
			"clientFlag",	//网站or内嵌
			"fck",               // 由js代码加入cookie的唯一标识，用以标识唯一用户
			"mac",               // mac地址，安装风行客户端的机器来获取
			"userid",            // 登录用户注册id，如果未登录为0
			"fpc",               // 策略、运营商和地域用户的地址，策略，isp信息
			"version",           // 风行版本号
			"sid",               // 当前会话ID，由js生成，算法跟fck类似，生命周期定义为30分钟
			"pvid",              // 页面ID，每次刷新页面生成一个新值（UUID算法）
			"config",            // 页面唯一标示，页面分类
			"url",               // 当前url地址
			"referurl",          // 前链url
			"channelid",         // 合作渠道id
			"vtime",             // 页面请求耗时   
			"ext",               // 扩展字段pagetype=?&（key=value）
			"step",              // 格式：用户史来pv计数器，各自维护
			"sestep",            // 格式：本次session的pv计数器，各自维护
			"seidcount",         // 用户史来session计数器，各自维护
			"ta",				 //	用户策略分类
			"mediatype"			 //	channel_id|subchannel_id|playlist_id|production_id|album_id
		]};
	
	var playView = {
		rprotocol : '2',
		firstname : 'website',
		secondname : 'play',
		protocol : [
			"rprotocol",         // 日志请求协议版本号，由前端发送，表明前端发送的版本号
			"clientFlag",	//网站or内嵌
			"fck",               // 由js代码加入cookie的唯一标识，用以标识唯一用户
			"mac",               // mac地址，安装风行客户端的机器来获取
			"userid",            // 登录用户注册id，如果未登录为0
			"fpc",               // 策略、运营商和地域用户的地址，策略，isp信息
			"version",           // 风行版本号
			"sid",               // 当前会话ID，由js生成，算法跟fck类似，生命周期定义为30分钟
			"pvid",              // 页面ID，每次刷新页面生成一个新值（UUID算法）
			"config",            // 页面唯一标示，页面分类
			"url",               // 当前url地址
			"referurl",          // 前链url
			"channelid",         // 合作渠道id
			"mediatype",
			"target",
			"hashid",
			"vvid",
			"lian",
			"platform",
			"videolength",
			"format",
			"ext",               // 扩展字段pagetype=?&（key=value）
			"playstep",              // 格式：用户史来pv计数器，各自维护
			"playsestep",            // 格式：本次session的pv计数器，各自维护
			"seidcount",         // 用户史来session计数器，各自维护
			"playerversion",
			"avtype",
			"vodtype",
			"viptype"
		]
	};

	var protocolSplit = '*_*';

	var stat = (function(){
		return {
			getRequest : function(config, data){
				data.rprotocol = config.rprotocol;
				var firstname = config.firstname || 'website', secondname = config.secondname || 'pv',
					url = 'http://stat.funshion.net/'+firstname+'/'+secondname + "?";

				if (config.timeout) {
					F.tool.pvManager.add({root : firstname, type: secondname, param : protocolIfy(config.protocol, data), isStat : 1});
					setTimeout(function(){F.tool.pvManager.send();}, config.timeout);
				}else {
					F.tool.pv.dispatch(url + protocolJoin(config.protocol, data).join(protocolSplit));
				}
			}
		};
		function protocolJoin(protocol, data){
			var params = [], key, val;
			for (var i = 0; i < protocol.length; i++) {
				key = protocol[i], val = data[key];
				params.push(key + '=' + (typeof val == 'undefined' ? '' : escapeSymbol(val)));
			}
			return params;
		}
		function protocolIfy(protocol, data){
			var params = {}, key, val;
			for (var i = 0; i < protocol.length; i++) {
				key = protocol[i], val = data[key];
				params[key] = (typeof val == 'undefined' ? '' : escapeSymbol(val));
			}
			return params;
		}
		function escapeSymbol(source){
			var map = {'#': '%23'};
			return String(source).replace(/#/ig, function(all) {
				return map[all];
			});
		}
	})();

	// 上报基础字段数据
	var statBaseData = function(param){
		var param2cookie = {'mac':'Mac', userid: 'userid', fpc: '_fpc', version: '_version'},
			param2attr = ['fck', 'sid', 'pvid'],_taScn = "|" + F.cookie.get('_scn'), queryUrl = media['url'], queryChannelid = 'Toolkit', queryHashid = media['hashid'],
			mediatype = media['mediatype'] || '||||',
			videoid = media['videoid'] || '',
		params = {
			config : F.config.ctrlname,
			mediatype : mediatype,
			target : videoid,
			hashid : queryHashid ? queryHashid : '',
			vvid : newGuid(),
			lian : '0', //是否连播|联播次数
			videolength : (Math.floor(Math.random()*2000)),
			format : 'tv', //当前播放码流|支持最高播放码流
			avtype : 1,
			vodtype : 3,
			viptype : 1,
			playerversion : '1.0.0.4',
			url : encodeURIComponent(queryUrl ? decodeURIComponent(queryUrl) : location.href),
			ta : _taScn,
			referurl : media_referer,
			channelid : queryChannelid || F.cookie.get("channelid") || F.cookie.get("alliance_id"),
			vtime : F.config.timeStrart ? (new Date()).getTime() - F.config.timeStrart : 0,
			ext : F.config.pvext || '',
			step : pvcount.get('step'),
			playstep : pvcount.get('playstep'),
			seidcount : pvcount.get('seidcount'),
			sestep : pvcount.get('sestep'),
			playsestep : pvcount.get('playsestep'),
			clientFlag :F.client.isClient() ? 2 : 5
		};
		for (var key in param2cookie){
			params[key] = F.cookie.get(param2cookie[key]);
		}
		if (params['userid'] == '') params['userid'] = 0;

		// 是否需要使用新的pvid
		var noCachePvid = (param && param.noCachePvid) ? true : false, attr = '';
		for (var i = 0; i < param2attr.length; i++){
			attr = param2attr[i];
			if (noCachePvid && attr == 'pvid') {
				params[attr] = paramHandle[attr].get(noCachePvid);
			} else {
				params[attr] = paramHandle[attr].get();
			}
		}
		T.extend(params, param || {});
		return params;
	};

	var pvStat = (function(){
		return {
			init : function(){
				sid.init();

			},
			send : function(param){
				var params = statBaseData(param);
				params.url = decodeURIComponent(params.url);
				stat.getRequest(pgPv, params);
			}
		}
	})();

	var playStat = (function(){
		return {
			init : function(){
				sid.init();
			},
			send : function(param){
				var params = statBaseData(param);
				params.url = decodeURIComponent(params.url);
				stat.getRequest(playView, params);
			}
		}
	})();

	var gmp = function(){return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)};
	var newGuid = function () {
		var guid = "";
		for (var i = 1; i <= 32; i++){
		  var n = Math.floor(Math.random()*16.0).toString(16);
		  guid +=   n;
		  if((i==8)||(i==12)||(i==16)||(i==20))
			guid += "-";
		}
		return guid;
	};

	var fck = {
		key : 'fck',
		create: function(){
			var val = parseInt(+new Date/1000) + (gmp() + gmp()).substr(0, 5);
			F.cookie.set(fck.key, val);
			return val;
		},
		get: function(){
			var val = F.cookie.get(fck.key);
			return val || fck.create();
		}
	};

	var sid = {
		key : 'pvsid',
		convkey : 'pvsid_cunv',
		cycle : 30*60,
		create: function(){
			var val = parseInt(+new Date/1000) + (gmp() + gmp()).substr(0, 5);
			sid.write(val);
			
			pvcount.set('seidcount', pvcount.get('seidcount') + 1);
			document.cookie = sid.convkey + '=1; path=/; domain=.fun.tv';
			pvcount.set('sestep', 0);
			return val;
		},
		write : function(val){
			F.cookie.set(sid.key, val, sid.cycle / (24*60*60));
		},
		get : function(){
			var val = F.cookie.get(sid.key), cunv = F.cookie.get(sid.convkey);
			return (cunv && val) || sid.create();
		},
		init : function(){
			// 只要页面有动静就刷新sid重写过期时间
			var sidendtime = new Date, sidwrite = sidendtime;
			T.on(document.body, 'mousemove', function(){sidendtime = new Date;});
			setInterval(function(){
				if (sidendtime > sidwrite){sidwrite = sidendtime; sid.write(sid.get());}
			}, sid.cycle*1000/2);
		}
	};

	var pvid = {
		guid : '',
		get : function(noCachePvid){
			var guid = '';
			if (!noCachePvid) {
				if (!pvid.guid) {
					guid = newGuid();
					pvid.guid = guid;
				} else {
					guid = pvid.guid;
				}
				pvcount.set('step', pvcount.get('step') + 1);
				pvcount.set('sestep', pvcount.get('sestep') + 1);
			} else {
				guid = newGuid();
				pvid.guid = guid;
			}
			return guid;
		}
	};

	// 控制pv数据上报中依赖的pv计数器与session计数器
	var pvcount = {
		cookie: 'pvcount',
		log : ['step', 'seidcount', 'sestep'],
		get : function(key){
			var val = F.cookie.get(pvcount.cookie), vals = val.split('|'),
				index = T.array.indexOf(pvcount.log, key);
			return parseInt(vals[index]) || 0;
		},
		set : function(key, val){
			var vals = F.cookie.get(pvcount.cookie).split('|'),
				index = T.array.indexOf(pvcount.log, key);
			for (var i = 0; i < pvcount.log.length; i++){
				vals[i] = parseInt(vals[i]) || 0;
			}
			if (index > -1) vals[index] = val;
			F.cookie.set(pvcount.cookie, vals.join('|'));
		}
	}

	var paramHandle = {pvid:pvid, sid:sid, fck:fck};

	T.ready(function(){
		pvStat.init();
		playStat.init();
	});

	F.tool.stat.pv = pvStat;
	F.tool.stat.play = playStat;

})();

T.ready(function(){
	F.tool.stat.pv.send();
	//延迟3s后报vv
	setTimeout(function(){
		F.tool.stat.play.send();
	}, 100);
});