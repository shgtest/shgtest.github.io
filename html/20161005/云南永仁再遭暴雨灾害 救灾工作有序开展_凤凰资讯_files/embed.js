if (typeof(embed_hzh) == 'undefined') {
    var embed_hzh = {};
    embed_hzh.flag = 0;
} else {
    embed_hzh.flag = 1;
}

embed_hzh.surround_num = 600; // 环绕文字最优字符总数
embed_hzh.str_min_num = 1200; // 要求连续字符总数
embed_hzh.str_sum = 0;
embed_hzh.str_temp = 0;
embed_hzh.p_num = 0; //正文页p标签节点个数
embed_hzh.nodes = []; //所有子节点
embed_hzh.p_node = []; //子节点的p标签数组（不包含孙节点）
embed_hzh.img_num = null;
embed_hzh.$ = function(vArg){
    this.elements = [];
    switch(vArg.charAt(0)){
        case '#': //id
            var obj = document.getElementById(vArg.substring(1));
            return obj;
            break;
        case '.': //class
            this.elements = embed_hzh.getClass(document,vArg.substring(1));
            return this.elements;
            break;
        default: //tagName
            this.elements = document.getElementsByTagName(vArg);
            return this.elements;
    }
}
embed_hzh.getClass = function(oParent,sClass){
    var parent = oParent || document;
    var re = new RegExp('\b'+sClass+'\b');
    var aEles = parent.getElementsByTagName('*');
    var arr = [];
    for(var i=0; i<aEles.length; i++){
        if(re.test(aEles[i].className)){arr.push(aEles[i]);}
    }
    return arr;
}

embed_hzh.main_container = embed_hzh.$("#main_content"); //正文主容器1
if (!embed_hzh.main_container) embed_hzh.main_container = embed_hzh.$("#artical_real"); //正文主容器2
embed_hzh.className = 'embedHzh';
embed_hzh.cssText = 'width:200px; height:300px; margin:10px 20px 10px 0px; float:left; display:inline; overflow:hidden; clear:both; padding:4px; border:1px solid #CDCDCD;';

embed_hzh.removeHTMLTag = function(str) {//过滤字符串里的tag，空白等
    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
    return str;
}
embed_hzh.Len = function(str){ //计算字符数
    var i,sum;
    sum=0;
    for(i=0;i<str.length;i++){
        if ((str.charCodeAt(i)>=0) && (str.charCodeAt(i)<=255))
            sum=sum+1;
        else
            sum=sum+2;
    }
    return sum;
}
embed_hzh.insertAfter = function(newElement,targetElement) { //封装的后插函数
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        //如果最后的节点是目标元素，则直接添加。
        parent.appendChild(newElement);
    }else {
        //如果不是，则插入在目标元素的下一个兄弟节点的前面。也就是目标元素的后面。
        parent.insertBefore(newElement,targetElement.nextSibling);
    }
}
embed_hzh.createHzh = function(){ //创建画中画广告容器（div标签）
    var oDiv = document.createElement("div");
    oDiv.id = "embed_hzh_div";
    oDiv.className = embed_hzh.className;
    oDiv.style.cssText = embed_hzh.cssText;
    return oDiv;
}
embed_hzh.createSpanHzh = function(){ //创建画中画广告容器（span标签）
    var oDiv = document.createElement("span");
    oDiv.id = "embed_hzh_div";
    oDiv.className = embed_hzh.className;
    oDiv.style.cssText = embed_hzh.cssText;
    return oDiv;
}
embed_hzh.insertAd_after = function(insert_p){ //后插广告
    var cur_p = insert_p;
    embed_hzh.insertAfter(embed_hzh.createHzh(),cur_p);
}
embed_hzh.insertSpanAd_after = function(insert_p){ //后插广告(span)
    var cur_p = insert_p;
    embed_hzh.insertAfter(embed_hzh.createSpanHzh(),cur_p);
}
embed_hzh.insertAd_before = function(thisDiv){ //前插广告
    var parent = thisDiv.parentNode;
    parent.insertBefore(embed_hzh.createHzh(),thisDiv);
}
embed_hzh.insertClear =function(insert_p){ //插入清除浮动div
    //清浮动div
    var oDivClear = document.createElement("div");
    oDivClear.style.fontSize = "0px";
    oDivClear.style.height = "0px";
    oDivClear.style.clear = "both";
    var last_p = insert_p;
    embed_hzh.insertAfter(oDivClear,last_p);
}

//步骤1：筛选出所有子节点(不包含文本节点)
for(var i=0;i<embed_hzh.main_container.childNodes.length;i++){
    if (embed_hzh.main_container.childNodes[i].nodeType == 1){
        embed_hzh.nodes.push(embed_hzh.main_container.childNodes[i]);
    }
}

//步骤2：
for(var i=embed_hzh.nodes.length-1;i>=0;i--){
    var zhengwen_img_arr = embed_hzh.nodes[i].getElementsByTagName("img");
    var zhengwen_p_script_arr = [];
    var zhengwen_p_align = false;
    if(embed_hzh.nodes[i].nodeName.toLowerCase() == 'p'){
        zhengwen_p_script_arr = embed_hzh.nodes[i].getElementsByTagName("script");
        if(embed_hzh.nodes[i].getAttribute("align")=='center'){
            zhengwen_p_align = true;
        }
    }
    var zhengwen_table_node = embed_hzh.nodes[i].nodeName.toLowerCase();
    var zhengwen_child_table_node = embed_hzh.nodes[i].getElementsByTagName("table");
    var zhengwen_node_class = embed_hzh.nodes[i].className;
    var nodeClassTag = false;
    //黑名单容器class
    var classList = [embed_hzh.className];
    for(var k=0;k<classList.length;k++){
        if(zhengwen_node_class==classList[k]){
            nodeClassTag = true;
            break;
        }
    }

    //筛选出主容器内第一个白名单子节点在整个子节点中的位置（排除含有jpg图片，script标签，table标签，微博容器，“p标签里有居中属性”以及它以上的节点）
    //zhengwen_img_arr[0].src.indexOf(".jpg")!=-1 || zhengwen_img_arr[0].src.indexOf(".png")!=-1
    //(/(jpg|jpeg|png|gif)$/.test(zhengwen_img_arr[0].src.toLowerCase()))
    if((zhengwen_img_arr[0] && !/a3b16c297669889\.jpg/.test(zhengwen_img_arr[0].src.toLowerCase()) && !/logo\.gif$/.test(zhengwen_img_arr[0].src.toLowerCase()) && /(jpg|jpeg|png|gif)$/.test(zhengwen_img_arr[0].src.toLowerCase()))
        || zhengwen_table_node=="table"
        || zhengwen_child_table_node[0]
        || zhengwen_p_script_arr[0]
        || zhengwen_p_align==true
        || nodeClassTag == true){
        embed_hzh.img_num = i+1;
        //如果从后向前查找第一个节点中就带有图片，则忽略此节点继续向后查找下一个图片位置
        if(embed_hzh.img_num != embed_hzh.nodes.length){
            break;
        }else{
            embed_hzh.surround_num = 666; // 如果最后一个节点中带有非logo图片，为了用户体验考虑，环绕文字最优字符总数变为666
        }

    }else{
        embed_hzh.img_num = i;
    }
}
//步骤3：筛选剩余子节点中标签名为p的节点
for(var i=embed_hzh.img_num;i<embed_hzh.nodes.length;i++){
    if(embed_hzh.nodes[i].nodeName.toLowerCase() == 'p'){
        embed_hzh.p_node.push(embed_hzh.nodes[i]);
    }
}

if(embed_hzh.p_node.length>0){
    for(i=0;i<embed_hzh.p_node.length;i++){
        var html = embed_hzh.p_node[i].innerHTML;
        var txt = embed_hzh.removeHTMLTag(html);
        var p_str_num = embed_hzh.Len(txt);
        embed_hzh.str_sum += p_str_num;
        embed_hzh.p_num++;
    }
}

if (embed_hzh.p_node.length > 1
    && embed_hzh.str_sum >= embed_hzh.str_min_num
    && embed_hzh.str_sum >= embed_hzh.surround_num) {
    //字符总数大于hzh.surround_num，从后向前遍历选出的p里的字符数，总和超过环绕文字最优字符总数后，广告插在该p的前面
    for(var i=embed_hzh.p_num-1; i>=0; i--)
    {
        var txt_last = embed_hzh.removeHTMLTag(embed_hzh.p_node[i].innerHTML);
        var txt_last_num = embed_hzh.Len(txt_last);
        embed_hzh.str_temp += (parseInt(txt_last_num/30) + 1)*30;
        if(embed_hzh.str_temp < embed_hzh.surround_num){
            embed_hzh.p_num--;
        } else {
            if (embed_hzh.flag == 1 && !iNiceBrowser.IPAD){
                embed_hzh.insertClear(embed_hzh.p_node[embed_hzh.p_node.length-1]);
                embed_hzh.insertAd_before(embed_hzh.p_node[embed_hzh.p_num-1]);
            }
            var m = new Image();
            m.src = 'http://dolphin.deliver.ifeng.com/c?z=ifeng&la=0&si=2&ci=29&cg=1&c=1&or=196&l=592&bg=592&b=589&u=http://y0.ifengimg.com/34c4a1d78882290c/2012/0528/1x1.gif';
            break;
        }
    }
}

embed_hzh.showAD = function(identifier, src, click, width, height, isActive) {
    var type = INice.ext(src);
    var od = document.getElementById(identifier);
    var isActive = typeof(isActive) == 'undefined'?0:isActive;
    if (type == 'swf') {
        var id = "flash_click_" + Math.ceil(Math.random() * 1000000);
        var flash_html = '<object  width="' + width + 'px" height="' + height + 'px" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" id="flash_swf_' + id + '"><param name="wmode" value="opaque"/><param name="movie" value="' + src + '"><embed  width="' + width + 'px" height="' + height + 'px" wmode="opaque" src="' + src + '" type="application/x-shockwave-flash"></embed></object>';
        flash_html = '<div style="clear: both; margin: 0 auto; width:' + width + 'px;height:' + height + 'px;" id="flash_outer_2_' + id + '"><div style="width:' + width + 'px;height:' + height + 'px;position:relative;" id="flash_outer_1_' + id + '">' + flash_html;
        if (!isActive) { // 是否互动
            flash_html += '<div style="position:absolute; top:0px; left:0px;z-index:3;"><a href="' + click + '" target="_blank"><img style="width:' + width + 'px;height:' + height + 'px;border:0px" src="http://y0.ifengimg.com/34c4a1d78882290c/2012/0528/1x1.gif"></a></div>';
        }
        flash_html += '</div></div><div class="clear"></div>';
        od.innerHTML = flash_html;
    } else if (type == 'jpg' || type == 'gif') {
        od.innerHTML = '<a href="' + click + '" target="_blank"><img src="' + src + '" border="0" width="' + width + '" height="' + height + '" /></a>';
    } else if (type == 'htm' || type == 'html') {
        od.innerHTML = '<iframe id="ifm_' + identifier + '" frameborder="0" scrolling="no" width="' + width + '" height="' + height + '"></iframe>';
        document.getElementById('ifm_' + identifier).src = src;
    } else if (type == 'js') { // 使用外链js需技术测试确认。
        var jsurl = ary[n][0];
        var adScript = document.createElement('script');
        adScript.src = jsurl;
        document.getElementsByTagName('head')[0].appendChild(adScript);
    }
};

embed_hzh.embed_hzh_div = embed_hzh.$("#embed_hzh_div");
if (embed_hzh.embed_hzh_div && (typeof iNiceBrowser != "undefined" && iNiceBrowser.IPAD == false)) {
    embed_hzh.showAD('embed_hzh_div', embed_hzh.ad_url, embed_hzh.ad_click, 200, 300);
}
embed_hzh = undefined;