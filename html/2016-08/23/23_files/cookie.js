/**
 * @author	jyn
 * @method	用于实现地方频道pc端与移动端自动跳转
 * @createtime	2016-05-10
 * @updatetime	2016-05-27
 * @version 1.1
 */

(function(){
	var isMobile = (/iPad|iPhone|Android|Windows Phone|Nokia/).test(navigator.userAgent);	  //当前访问设备为移动端
	var mobileUrl = (/_m\.html/ig).test(window.location.href);								  //移动端url地址
	var mobileIndexHref = (/index_m\.html\/$|index_m\.html$/).test( window.location.href );	  //移动端index页面
	var indexReg = new RegExp(/news\.cn\/$|xinhuanet\.com\/$|news\.cn$|xinhuanet\.com$/);	  //网站无index后缀首页
	var zt = (/\/zt\//ig).test(window.location.href);										  //专题稿
	var suffixPC = "?type=pc";																  //经过跳转后的pc页面
	var suffixMobile = "?type=mobile";														  //经过跳转后的mobile页面

	if(zt){
		if( isMobile && !mobileUrl ){
			var href = location.href.replace(/\.html/, '_m.html'+suffixMobile);
			location = href;
		}
		if( !isMobile && mobileUrl ){
			var href = location.href.replace(/\_m\.html/, '.html'+suffixPC);
			location = href;
		}
	}else{
		if( isMobile ){
			if( (/back_pc_df=true/).test(document.cookie) ){
				if( mobileUrl ){	  //移动端访问移动页面 判断是否需要返回pc端 
					if( mobileIndexHref ){	//是wap首页  跳转到pc页
						window.location.href = window.location.href.replace(/index_m.html/,"index.html"+suffixPC);
					}
				}else if( window.location.href == window.location.origin +"/" || window.location.href == window.location.origin +"/index.html"){
					document.cookie = "back_pc_df=false";
					window.location.href = window.location.origin +"/index_m.html"
				}
			}else{
				/*移动端访问pc页面执行*/
				if( !mobileUrl ){
					//有返回pc端cookie  
					if( indexReg.test(window.location.href) ){  //若当前是pc页  则跳转到对应的wap页
						window.location.href =	window.location.href+"index_m.html";
					}else if( (/index\.html/).test(window.location.href) ){					//首页或列表页
						window.location.href = window.location.href.replace(/index.html/ig,"index_m.html");
					}else if( (/_c.html|_v.html|_p.html/ig).test(window.location.href) ){	//详情页
						window.location.href =window.location.href.replace(/_c.html|_v.html|_p.html/ig,"_m.html");
					}else if( (/error\.html$/ig).test(window.location.href) ){				//error页
						window.location.href =window.location.href.replace(/error\.html/ig,"error_m.html");
					}
				}
			}
		}
	}
})();







