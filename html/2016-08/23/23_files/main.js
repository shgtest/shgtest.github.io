$(function(){
	var lunBo = function( container ){
	  var _this = this;
	  var $this = $(this);
	  var $container = $(container);
	  var width = $container.width();

	  $container.each(function(i,v){
		var $v = $(v);
		var lb_i = $v.children(".lb_wapper").children(".lb_li");
		var length = lb_i.length;
		//var width = lb_i.width();
		lb_i.css("width",(width+"px"))
		$v.children(".lb_wapper").css("width",(100*length+"%"));
		var lis='<li class="lb_o lb_o_active"></li>'; 
		if(length>1){
		  for(var i = 0; i<length-1 ; i++){
			lis += '<li class="lb_o"></li>';
		  }
		}
		$v.append('<ol class="lb_o_c clearfix">'+lis+'</ol>')
		$(".lb_o_c").css({"width":(12*length),"left":(-12*length/2)});
		$v.find(".lb_li").eq(0).addClass("lb_li_active")
		$v.find(".lb_o").eq(0).addClass("lb_o_active")

		$v.on("mouseover",function(){
		  $(this).addClass("isHover");
		}).on("mouseout",function(){
		  $(this).removeClass("isHover");
		})

		var lbF = function(){
		  /*
		  if( $v.hasClass("isHover") ){
			return false;
		  }
		  */
		  var $act = $v.find(".lb_o_active");
		  //console.log($act.index())

		  if($act.index() < $v.find(".lb_o").length-1){
			$act.next().trigger("mouseover");
		  }else{
			$act.siblings().eq(0).trigger("mouseover");
		  }
		}

		var run = function(){
		  var index = $v.find(".lb_li_active").index();
		  var width =$v.children(".lb_wapper").children(".lb_li").width();
		  var i = (index == ($v.find(".lb_li").length-1)) ? 0 : ++index;
		  $(".lb_li_active").removeClass("lb_li_active");
		  $(".lb_li").eq(i).addClass("lb_li_active")
		  /*
		  $v.children(".lb_wapper").stop().animate({"left":"-"+width*i+"px"});
		  $(".lb_o_active").removeClass("lb_o_active");
		  $(".lb_o").eq(i).addClass("lb_o_active")
		  */
		}

		setInterval(lbF,4000)
		//setInterval(run,2000)
	  })

	  $(".lb_o").on("mouseover",function(){
		var index = $(this).index();
		var width = $(this).parents(".lb_container").children(".lb_wapper").children(".lb_li").width();
		$(this).siblings(".lb_o_active").removeClass("lb_o_active");
		$(this).addClass("lb_o_active");
		$(this).parents(".lb_container").children(".lb_wapper").stop().animate({"left":"-"+width*index+"px"});
	  });

	}
	var lb = new lunBo(".lb_container");

	//点赞
	var zan = function(data,callback){
		//异步请求获取点赞个数
		$.ajax({
			type: 'get',
			url: "/cloudc/comment/like.htm" ,
			data: data ,
			success: function(data){
				if(data[0].code=="200"){
					$(".operation-num").html(data[0].value);
				} 
			}
		});
	}

	var contentId = $(".operation-zan").attr("contentId");
	$(".operation-zan").on("click",function(){
		zan({contentId:contentId})
	});
	//isquery:true  查询
	zan({contentId:contentId,isquery:true})
							   
	$(document).ready(function(){
		//文内图片样式重订

		var handlePic = function(v){
			//文字详情页共两版设计 news-page2为宽版   按940处理
			var iWidth = $("body").hasClass("news-page2") ? 940 : 660 ;
			if( $(v).width() > iWidth){
				$(v).css({"width":"100%","padding": "12px 0"});
				if($(v).parent()[0].tagName === "P"){
					$(v).parent().css({"text-indent":"0px"})
				}					  
			}
			$(v).css({"display":"block"});
		}

		window.onload = function(){
			if(!$(".paging-photo").length ){
				$(".news-mian img").each(function(i,v){
					if($(v).parent().hasClass("ui-gallery")){
						return ;
					}
					handlePic(v);
				});	
			}else{			//第二套图集样式

				var $cfo = $(".foto-wap").html();

				$(".news-mian > p").each(function(i,v){
					var $img = 	$(v).find("img");
					if($img.length){
						handlePic($img[0]);
						$(v).addClass("potot-wapper");
						$(v).append( $cfo );
						$(v).find(".foto-op").show();
						/*
						$(v).on("mouseover",function(){
							$(v).find(".foto-op").fadeIn();
						}).on("mouseleave",function(){
							$(v).find(".foto-op").fadeOut();
						});
						*/
						var height = $img.height();
						$(v).find(".foto-op").css({"height":"100%"});   /*"top":(height/2-30+"px"),*/
					}
				});
			}
		}
		//视频栏目显示（默认隐藏）
		$(".news-mian object").each(function(i,v){
			$(v).css({"display":"block","width":"100%"});
		});
	});

	//单栏详情页模板中视频高度调整
	if( $(".news-page2").length ){
		if($(".edui-faked-video").length){
			$("object.edui-faked-video").each(function(i,v){
				$(v).css({"height":"494px"})
			})
		}
	}

	//隐藏无内容模块
	var hideDiv = function( v ){
		var $t = $(v);
		if( $t.length && $t.html() == "" ){ $t.hide() }
	}
	var mDivArr = ["#xuan_news_face","#xuan-hd"]
	$(mDivArr).each(function(i,v){
		hideDiv(v)
	});

	if( $(".news-page-error").length ){
		var cont = 3;
		var html = '<div class="e1">哎呀，出错了！</div>'+
				   '<div class="e2">您访问的页面出现错误，'+
					 '<span id="count-down">'+cont+'</span> 秒后自动跳转到'+
			         '<a href="/index.html" class="index-page">首页</a>。'+
				   '</div>';
		document.getElementById("error-wap").innerHTML = html;
		setInterval(function(){
			cont > 1 ? (function(){document.getElementById("count-down").innerHTML = --cont;    })() :(function(){window.location.href = "HTTP://"+window.location.hostname})();
		},1000);	
	}

});

KISSY.ready(function(S) {
	KISSY.use('dom,event,ajax,news-radio/main,video-switch/videoSwitch,df-user/user,df-news/df-comment/main',function(S,Dom,Evt,IO,RadioPlay,VideoSwitch,User,XuanComment){
		if(!window.HasDfComment){//模版上如果new过 就不执行，以后发布的模版不再单独调用评论组件，统一放到main里
			new XuanComment().init();
		 }
		new RadioPlay();//增加详情页中的音频按钮
		var vs = new VideoSwitch();//处理详情页中视频
		vs.init();
		var u = new User();

		/*登录*/
		Evt.on('.idx-lgn','click',function(){
			var that = this;
			if(Dom.hasClass(this,'active')){
				u.signOut();
			}else{
				S.use('login-intime/main',function(S,Lgn){
					new Lgn({});
				})
			}
			return false;
		});

		/*登录状态的回调*/
		function lgn_suc(d){
															  
			window._xh_df_user = {
				userName:d.content.username,
				nickName:d.content.nickname,
				userId:d.content.userid,
				wXNlwk:d.content.wXNlwk 
			};

			Dom.addClass('.idx-lgn','active');
			Dom.hide('.idx-reg');
			Dom.html('.idx-lgn','[退出]');
			Dom.hide('.user_info > span');
			var sp = Dom.prev('.idx-lgn');
			Dom.html(sp,'<a class="userPic" href="http://' + window._xh_df_user.userName + '.home.news.cn/" target="_blank"><img src="http://tpic.home.news.cn/userIcon/s/' + window._xh_df_user.userName + '" /></a>')
			Dom.show(sp);
		}
		/*未登录回调函数*/
		function lgn_out(){}
		u.checkLogin(lgn_suc,lgn_out);

		/*返回顶部*/
		Evt.on(".to-top", 'click',function(e){
			window.scrollTo(0,0);
		});
	});
});



