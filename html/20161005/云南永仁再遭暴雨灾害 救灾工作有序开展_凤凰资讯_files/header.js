define('header',['public_login'], function () {
    var win = window;
    var doc = document;
    var getCookie = function(name) {
        var cookie = "; " + document.cookie;
        var pointer = cookie.indexOf("; " + name + "=");
        var nextPointer = cookie.indexOf(";", pointer + 2);
        if (pointer >= 0) {
            return decodeURIComponent(cookie.substring(pointer + name.length + 3, nextPointer > 0 ? nextPointer : cookie.length))
        }
        ;
        return ""
    };
    var clearCookie = function(name, path, domain) {
        var cStrArr = [];
        cStrArr.push(name + '=');
        cStrArr.push((path) ? '; path=' + path : '');
        cStrArr.push((domain) ? '; domain=' + domain : '');
        cStrArr.push('; expires=Thu, 01-Jan-70 00:00:01 GMT');
        document.cookie = cStrArr.join('')
    };
    var timestampIndex = 0;
    var jsonp = function(options) {
        var cache = typeof options.cache !== "undefined" ? cache : false;
        var url = options.url;
        var success = options.success;
        var data = [];
        var scope = options.scope || win;
        var callback;
        if (typeof options.data === "object") {
            for (var k in options.data) {
                data.push(k + "=" + encodeURIComponent(options.data[k]))
            }
        }
        ;
        if (typeof options.callback === "string" && options.callback !== "") {
            callback = options.callback
        } else {
            callback = "f" + new Date().valueOf().toString(16) + timestampIndex;
            timestampIndex++
        }
        ;
        data.push("callback=" + callback);
        if (cache === false) {
            data.push("_=" + new Date().valueOf() + timestampIndex);
            timestampIndex++
        }
        ;
        if (url.indexOf("?") < 0) {
            url = url + "?" + data.join("&")
        } else {
            url = url + "&" + data.join("&")
        }
        ;
        var insertScript = doc.createElement("script");
        insertScript.src = url;
        win[callback] = function() {
            success.apply(scope, [].slice.apply(arguments).concat("success", options))
        };
        insertScript.onload = insertScript.onreadystatechange = function() {
            if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                insertScript.onload = insertScript.onreadystatechange = null;
                insertScript.parentNode.removeChild(insertScript)
            }
        };
        var oScript = doc.getElementsByTagName("script")[0];
        oScript.parentNode.insertBefore(insertScript, oScript)
    };
    var init = function() {
        initLogin();
        checkLogin()
    };
    var initLogin = function() {
        window['REG_LOGIN_CALLBACK'](3, function() {
            window.location.reload();
        });
        window['REG_LOGIN_CALLBACK'](1, function(optionsORname) {
            showBox(true);
            //var sid = getCookie('sid');
            //sendCount(sid);
        });
        document.getElementById('js_login_exit').onclick = function() {
            window['GLOBAL_LOGIN_OUT']()
        };
        if(device.type == 'mobile' || device.type == 'pad'){
            document.getElementById('js_login_btn').onclick = function() {
                window.location.href = 'http://id.ifeng.com/muser/login?cb=' + window.location.href;
                return false;
            }
        } else {
            document.getElementById('js_login_btn').onclick = function() {
                window['GLOBAL_LOGIN']();
                return false;
            } 
        }

    };
    var checkLogin = function() {
        var sid = getCookie('sid');
        //sendCount(sid);
        if (sid !== '') {
            jsonp({url: 'https://id.ifeng.com/api/checklogin',data: {sid: sid},success: function(result) {
                    showBox(!!result.code)
                }})
        } else {
            showBox(false)
        }
    };
	/*
    var sendCount = function(userSid) {
        var sendUrl = 'http://18.ifeng.com/count?sid=' + userSid;
        var sendInsertScript = doc.createElement("script");
        sendInsertScript.src = sendUrl;
        var oScript = doc.getElementsByTagName("script")[0];
        oScript.parentNode.insertBefore(sendInsertScript, oScript)
    };
	*/
    var renderUserName = function() {
        var sid = getCookie('sid');
		var userName = sid ? decodeURIComponent(sid.substring(32)) : decodeURIComponent(getCookie('IF_USER'));
		doc.getElementById('js_userInfo_name').innerHTML = userName;

    };
    var showBox = function(isLogin) {
        doc.getElementById('js_unlogin_box').style.display = 'none';
        doc.getElementById('js_userInfo_box').style.display = 'none';
        if (isLogin) {
            doc.getElementById('js_userInfo_box').style.display = '';
            renderUserName();
        } else {
            clearCookie('sid', '/', '.ifeng.com');
            doc.getElementById('js_unlogin_box').style.display = ''
        }
    };
    return init;
})