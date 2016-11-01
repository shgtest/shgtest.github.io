(function () {
    if (!document.body) {
        return setTimeout(arguments.callee, 50)
    }
    var tadConfig = {
        sdkId: window.tadSdkId,
        spaceKey: window.tadSpaceKey,
        width: window.width,
        height: window.height,
        noFilledAdxId: window.tadNoFilledAdxId,
        referer:window.referer
    }

    /**
     * 工具类
     */
    function uuid(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    }

    function GetRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }

    function addCookie(sName, sValue, day) {
        var date = new Date();
        date.setDate(date.getDate() + day);
        document.cookie = escape(sName) + '=' + escape(sValue) + ';expires=' + date.toGMTString();//escape()汉字转成unicode编码,toGMTString() 把日期对象转成字符串
    }

    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=")
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1
                c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    }

    /**
     * 工具类结束
     */
    //先生成div
    var divId = "tadseeker" + GetRandomNum(0, 10000);
    tadConfig.divId = divId;
    document.write("<div id='" + divId + "' style='position: relative;'></div>");
    var hwuid = getCookie("tadseekerHwuid");
    if (hwuid == "") {
        hwuid = uuid(32, 10);
        addCookie("tadseekerHwuid", hwuid, 12);
    }
    tadConfig.hwuid = hwuid;
    window.counter = GetRandomNum(100, 100000);
    var cbnum = "cb" + window.counter++;
    var sendRequestFunction = "sendRequest"+ cbnum;
    var cbname = sendRequestFunction + "." + cbnum;


    function sendRequest() {
        var path = "http://ssp.idgtechnetwork.com.cn/jssdk/pc/getAd.do?sdkId=" + tadConfig.sdkId + "&adSlotId=" + tadConfig.spaceKey + "&HWUID=" + tadConfig.hwuid + "&noFilledAdxId=" + tadConfig.noFilledAdxId;
        // var path="http://localhost:8080/pc/mock.do";
        if (path.indexOf("?") === -1) {
            path += "?callback=" + cbname;
        } else {
            path += "&callback=" + cbname;
        }
        var script = document.createElement("script");
        sendRequest[cbnum] = function (response) {
            try {
                if (typeof(response.adxId)!="undefined"&&response.adxId != "") {
                    initAdFrame(response.ldp);
                }else{
                    if(typeof(response.id)!="undefined"&&response.id!=""){
                        initSelfAd(response);
                    }
                }
            } finally {
                delete sendRequest[cbnum];
                script.parentNode.removeChild(script);
            }
        };
        script.src = path;
        document.body.appendChild(script);
    }
    function createLogo() {
        var tagImg=document.createElement("img");
        tagImg.setAttribute("src","http://ssp.idgtechnetwork.com.cn/static/ad/adIcon.png");
        tagImg.style.position="absolute";
        tagImg.style.left="0px";
        tagImg.style.bottom="0";
        tagImg.style.zIndex="1000";
        tagImg.style.opacity="1";
        tagImg.style.width="38px";
        tagImg.style.height="18px";
        return tagImg;
    }
    window[sendRequestFunction] = sendRequest;
    function initAdFrame(ldp) {
        var tagIframe = document.createElement("iframe");
        tagIframe.id = tadConfig.divId + "x";
        tagIframe.name = tadConfig.divId + "x";
        tagIframe.setAttribute("frameBorder", "0");
        tagIframe.setAttribute("scrolling", "no");
        tagIframe.setAttribute("marginwidth", "0");
        tagIframe.setAttribute("marginheight", "0");
        tagIframe.setAttribute("vspace", "0");
        tagIframe.setAttribute("hspace", "0");
        tagIframe.setAttribute("allowtransparency", "true");
        tagIframe.setAttribute("scrolling", "no");
        tagIframe.setAttribute("allowfullscreen", "true");
        tagIframe.setAttribute("width", tadConfig.width);
        tagIframe.setAttribute("height", tadConfig.height);
        var ref="";
        if(typeof(tadConfig.referer) != "undefined" &&tadConfig.referer!="") {
            ref=tadConfig.referer;
        }else{
            ref=document.referrer;
        }

        if(ref!=""){
            ldp+="&ref="+encodeURIComponent(ref);
        }
        tagIframe.setAttribute("src", ldp);
        document.getElementById(tadConfig.divId).setAttribute("width",tadConfig.width);
        document.getElementById(tadConfig.divId).setAttribute("height",tadConfig.height);
        document.getElementById(tadConfig.divId).style.position="relative";
        document.getElementById(tadConfig.divId).appendChild(createLogo());
        document.getElementById(tadConfig.divId).appendChild(tagIframe);
    }
    //自建广告
    /**
     * 判断广告类型
     * @param response
     * @return adType
     */
    function checkAdType(response) {
        var seatbid=response.seatbid;
        if(seatbid.length>0){
            var obj=seatbid[0];
            var bid=obj.bid;
            if(bid.length>0){
                var ad=bid[0];
                if(typeof(ad)!="undefined"){
                    var ext=ad.ext;
                    if(ad.adm.length>0){
                        if(typeof(ext.title)!='undefined'&&ext.title!=''){
                            return 'info';
                        }else{
                            return 'banner';
                        }
                    }
                }
            }
        }
        return '-1';
    }

    function getAdFromResponse(response) {
        var seatbid=response.seatbid;
        if(seatbid.length>0){
            var obj=seatbid[0];
            var bid=obj.bid;
            if(bid.length>0){
                var ad=bid[0];
                return ad;
            }
        }
        return '-1';
    }

    //发送曝光
    var cbPmNum = "cbPm" + window.counter++;
    var sendPmFunction = "sendPm"+cbnum;
    var cbPmName = sendPmFunction + "." + cbPmNum;
    function sendPm(pm) {
        var path=pm;
        if (path.indexOf("?") === -1) {
            path += "?callback=" + cbPmName;
        } else {
            path += "&callback=" + cbPmName;
        }
        var script = document.createElement("script");
        script.src = path;
        document.body.appendChild(script);
    }
    window[sendPmFunction] = sendPm;
    //发送点击
    var cmnum = "cbCm" + window.counter++;
    var sendCmRequest = "sendCm"+ cmnum;
    var cbCmName = sendCmRequest + "." + cmnum;
    function sendCm(cm){
        var path=cm;
        if (path.indexOf("?") === -1) {
            path += "?callback=" + cbname;
        } else {
            path += "&callback=" + cbname;
        }
        var script = document.createElement("script");
        script.src = path;
        document.body.appendChild(script);
    }

    window[sendCmRequest]=sendCm;
    function doCms(){
        for(var i=0;i<tadConfig.cms.length;i++){
            try{
                sendCm(tadConfig.cms[i]);
            }catch(e){

            }
        }
        //点击发送完毕后，进行跳转
        window.open(tadConfig.ldp);
    }
    window[sendCmRequest+"doCms"]=doCms;
    function createBanner(ad) {
        var tagIframe = document.createElement("iframe");
        tagIframe.id = tadConfig.divId + "x";
        tagIframe.name = tadConfig.divId + "x";
        tagIframe.setAttribute("frameBorder", "0");
        tagIframe.setAttribute("scrolling", "no");
        tagIframe.setAttribute("marginwidth", "0");
        tagIframe.setAttribute("marginheight", "0");
        tagIframe.setAttribute("vspace", "0");
        tagIframe.setAttribute("hspace", "0");
        tagIframe.setAttribute("allowtransparency", "true");
        tagIframe.setAttribute("scrolling", "no");
        tagIframe.setAttribute("allowfullscreen", "true");
        tagIframe.setAttribute("width", tadConfig.width);
        tagIframe.setAttribute("height", tadConfig.height);
        document.getElementById(tadConfig.divId).setAttribute("width",tadConfig.width);
        document.getElementById(tadConfig.divId).setAttribute("height",tadConfig.height);
        document.getElementById(tadConfig.divId).style.position="relative";
        document.getElementById(tadConfig.divId).appendChild(tagIframe);
        document.getElementById(tadConfig.divId).appendChild(createLogo());
        //开始创建广告内容
        var tagAd=document.createElement("img");
        tagAd.setAttribute("src",ad.adm[0]);
        tagAd.setAttribute("style","width:"+tadConfig.width+"px;height:"+tadConfig.height+"px;cursor:pointer;");
        tagAd.setAttribute("onclick","window.parent."+sendCmRequest+"doCms"+"();");
        window.frames.frames[tagIframe.id].document.body.appendChild(tagAd);
        //发送曝光
        var ext=ad.ext;
        tadConfig.cms=ext.cm;
        tadConfig.ldp=ext.ldp;
        for(var i=0;i<ext.pm.length;i++){
            sendPm(ext.pm[i]);
        }
    }

    function createInfo(ad) {

    }

    function initSelfAd (response){
        var adType=checkAdType(response);
        if(adType!='-1'){
            if(adType=='banner'){
                createBanner(getAdFromResponse(response));
            }else if(adType=='info'){

            }
        }
    }

    sendRequest();
})();
// }).call(this);
/**
 * Created by WQWBUU on 16/8/1.
 */
