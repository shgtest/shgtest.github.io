//IWT_ID_READY_REQUEST_ONCE='http://irs01.net/idex.js';
(function(e,t){function o(e){var t;while(t=e.shift())t()}function u(){s.loading=1;var u,l="";try{u=e.navigator.plugins["Shockwave Flash"]||e.ActiveXObject,l=u.description||(new u("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version")}catch(c){}l=(l.match(/\d+/g)||[0])[0];if(l<10){s._available=0,o(r);return}s._available=1,e[i]=function(){var t=arguments;setTimeout(function(){a.apply(e,t)},0)};var h=setInterval(function(){t.body&&(clearInterval(h),f(),setTimeout(function(){s.inited||(s._available=0,n.length=0,o(r))},1e4))},50)}function a(t,i){switch(t){case"onecall":if(!e[i])return;e[i].apply(e,[].slice.call(arguments,2)),e[i]=null;break;case"error":s._available=s.inited=0,o(r);break;case"load":s._available=s.inited=1,r.length=0,o(n)}}function f(){var e=t.createElement("div");e.setAttribute("style","display:block;position:absolute;right:0;bottom:0;border:none;"),t.body.firstChild?t.body.insertBefore(e,t.body.firstChild):t.body.appendChild(e),e.innerHTML='<object id="'+l()+'" data="'+s.SWF_URL+'" type="application/x-shockwave-flash" width="10" height="10" style="position:absolute;right:0;bottom:0;"><param name="movie" value="'+s.SWF_URL+'" /><param name="wmode" value="transparent" /><param name="version" value="10" /><param name="allowScriptAccess" value="always" /><param name="flashvars" value="jsproxyfunction='+i+'" /></object>',s.swf=e.firstChild}function l(){return"_"+(Math.random()*1e18).toString(36).slice(0,5).toUpperCase()}function c(){}function h(e){var t=[],n,r;for(n in e)r=e[n],r&&t.push(n+"="+r);return t.join("&")}function p(t,n){var r=l(),i;e[r]=function(){try{n.apply(e,arguments),i.parentNode.removeChild(i)}catch(t){}e[r]=null},t+="&jsonp="+r,i=d(t)}function d(e){var n=t.createElement("script"),r=t.getElementsByTagName("head")[0];return n.type="text/javascript",n.src=e,r.firstChild?r.insertBefore(n,r.firstChild):r.appendChild(n),n}function b(t,n,r){var i={_iwt_id:r,_iwt_cid:g,_iwt_UA:t.UA},o,u;if(window.gvl!='danube'){if(t.WITH_REF){try{o=e.top.document.referrer}catch(a){try{o=e.parent.document.referrer}catch(a){o=document.referrer}}i.ref=o}i.ref=window.location.href;}i=h(i);if(n&&(u=n.length)){while(u--)n[u]=encodeURIComponent(n[u]);i+="&p="+n}p(y.API_URL+i,function(e){s.set("_iwt_id",e),w()})}function w(){e.IWT_ID_READY_REQUEST_ONCE&&(d(e.IWT_ID_READY_REQUEST_ONCE),w=c)}var n=[],r=[],i=l(),s={SWF_URL:"http://irs01.net/MTFlashStore.swf#",_available:1,_jpf:i,get:function(e,t){return s._sendFlashMsg(t,"jGetItem",e)},set:function(e,t,n){return s._sendFlashMsg(n,"jSetItem",e,t)},_sendFlashMsg:function(t,n,r,i){t=t||c;var o=l(),u=arguments.length,a=s.swf;e[o]=t,u==2?a[n](o):u==3?a[n](r,o):a[n](r,i,o)},initSWF:function(e,t){if(!s._available)return t&&t();if(s.inited)return e&&setTimeout(e,0);e&&n.push(e),t&&r.push(t),s.loading||u()}},v="_iwt_cid=",m=location.search.indexOf(v),g=m>-1?location.search.slice(m+v.length).split("&",1)[0]:"",y={FC:s,API_URL:"http://irs01.com/irt?",track:function(e,t){e.NO_FLS?b(e,t):s.initSWF(function(){s.get("_iwt_id",function(n){b(e,t,n)})},function(){b(e,t)})}};e._iwt=y;if(e._iwtTQ){var E=e._iwtTQ,S;while(S=E.shift())y.track(S[0],S[1])}})(this,document);