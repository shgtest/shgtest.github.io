/*
creatTime: 2014.6.17,
author: xh_lsj,
module: 互动嵌入原生JS实现JSONP,
v-1.02: 2015.3.26  辩论、投票两个模块放一起
v-1.03: 2015.4.23  解决冲突问题，简化代码
v-1.04: 2015.6.1  添加调查模块
v-1.05: 2015.8.6  添加话题、问答两个模块
*/


function includeDebate(opt){
	var _t = this;
	opt = opt?opt:{}; 
	if(!opt.container)
	{
		return false;
	}
	_t._conbox = document.getElementById(opt.container);

	if(!_t._conbox){

		return false;
	}
	_t.parentbox = _t._conbox.parentNode;
	_t._app_type = opt.type?opt.type:'default';
	_t._groupid = _t._conbox.getAttribute('data-id');
	_t._app_url = _t._conbox.getAttribute('data-url');
	_t._data_type = opt.channel?opt.channel:'';

	if(!Number(_t._groupid)){
		_t.parentbox.removeChild(_t._conbox);
		return false;
	}

	if(_t._data_type == 'debate'){
		_t.creat_script_fn('http://forum.home.news.cn/api/debate/getDebateP.do');
		return false;
	}else
	if(_t._data_type == 'vote'){
		_t.creat_script_fn('http://vote.home.news.cn/poll/getPollP.do');
		return false;
	}else if(_t._data_type == 'survey'){
		_t.creat_script_fn('http://vote.home.news.cn/survey/');
		return false;
	}else if(_t._data_type == 'topic'){
		_t.creat_script_fn('http://vote.home.news.cn/api/topic/detail');
		return false;
	}else if(_t._data_type == 'QA'){
		_t.creat_script_fn('http://vote.home.news.cn/api/faq/detail');
		return false;
	}
}
includeDebate.prototype = {
	creat_script_fn: function(_url)
	{
		var _t = this;
		//创建script标签并加入到页面中
		var oHead = document.getElementsByTagName('head')[0];
		var oS = document.createElement('script');
		if(_t._data_type == 'survey'){
			oS.setAttribute('src', encodeURI(_url +_t._groupid+ '?tm='+ new Date().getTime()+'&callback=success_'+_t._data_type));        
		}else{
			oS.setAttribute('src', encodeURI(_url +'?id='+_t._groupid+ '&tm='+ new Date().getTime()+'&callback=success_'+_t._data_type));        
		}
		oS.setAttribute('id','id_'+_t._data_type);
		oHead.appendChild(oS);
		window['success_'+_t._data_type] = function(data){
			if(_t._data_type == 'debate'){
				_t.success_debate(data);
				oHead.removeChild(document.getElementById('id_debate'));
			}else
			if(_t._data_type == 'vote'){
				_t.success_vote(data);
				oHead.removeChild(document.getElementById('id_vote'));
			}else
			if(_t._data_type == 'survey'){
				_t.success_survey(data);
				oHead.removeChild(document.getElementById('id_survey'));
			}if(_t._data_type == 'topic'){
				_t.success_topic(data);
				oHead.removeChild(document.getElementById('id_topic'));
			}if(_t._data_type == 'QA'){
				_t.success_QA(data);
				oHead.removeChild(document.getElementById('id_QA'));
			}
			else{
				return false;
			}
		}

	},
	//辩论回调函数
	success_debate:function(_opt){
		var _t = this;
		if(_opt.data ==''){
			_t.parentbox.removeChild(_t._conbox);
			return false;
		}
		//0成功 1失败
		if(_opt.code == 0){
			window.includeDebateGlobal = _opt;
			//定义链接路径
			var link = 'http://forum.home.news.cn/debate/detail_rank.do?id=' + _opt.data.id;        //跳转详情页链接
			var linkAttr =' target="_blank"';                                           //新页面打开
			//判断是否手机端
			if(_t._app_type == 'app')
			{
				link = 'javascript:window.open(\''+_t._app_url+'\');';						//手机端打开地址
				linkAttr = '';
			}
			var totalCount = parseInt(_opt.data.positiveCount) + parseInt(_opt.data.negativeCount);
			var pCount,nCount;

			if(totalCount == 0){
				pCount = 0;
				nCount = 0;
			}else{
				pCount = Math.round((_opt.data.positiveCount/totalCount)*100);
				nCount = 100 - pCount;
			}
			
			var html = '';
			html += '<div class="xDCon"><a href="http://xuan.news.cn/hd/index.html" class="xDTag" target="_blank">辩论</a><p class="xDTit">';
			
			//判断是否结束
			if (_opt.data.status == '4' || _opt.data.isEnd == 'true')
			{
				html += '<span class="xDStatus">已结束</span>';
			}

			html += '<a href="' + link + '"'+linkAttr+'>'+_opt.data.title +'</a></p>';
			
			if(_opt.data.content){
				html += '<p class="xDDesp">'+_opt.data.content +'</p>';
			}
			html += '<p class="xDBar"><span id="xDBarCount"></span></p><p class="xDPoint"><span class="xDPointOne">' + pCount +'%' + _opt.data.positive;
			html += '</span><span class="xDPointTwo">' + nCount +'%' + _opt.data.negative;
			html += '</span></p></div><div class="xDJoin"><a href="' + link + '"'+linkAttr;

			if (_opt.data.status == '4' || _opt.data.isEnd == 'true')
			{
				html += '>立即<br />查看</a></div>';
			}else{
				html += '>立即<br />参与</a></div>';
			}

			_t._conbox.innerHTML = html;
			var oBar = document.getElementById('xDBarCount');
			oBar.style.width = pCount + '%';
		}else{
			_t.parentbox.removeChild(_t._conbox);
			return false;
		}
		
	},
	//投票回调函数
	success_vote:function(_opt){
		var _t = this;

		if(_opt.data ==''){
			_t.parentbox.removeChild(_t._conbox);
			return false;
		}

		window.includeVoteGlobal = _opt;
		//200成功 500失败
		if(_opt.code == 200){
			//定义链接路径
			var link = 'http://hd.xuan.news.cn/poll/detail.do?id=' + _opt.data.id;
			var linkAttr =' target="_blank"';
			//判断是否手机端
			if(_t._app_type == 'app')
			{
				link = 'javascript:window.open(\''+_t._app_url+'\');';
				linkAttr = '';
			}
			var html = '';
			html += '<div class="xVCon"><a href="http://xuan.news.cn/hd/vote.html" class="xVTag" target="_blank">投票</a><p class="xVTit">' ;
			
			//判断是否结束
			if(_opt.data.progress=='0'){
				html += '<span class="xVStatus">未开始</span>';
			}
			if(_opt.data.progress=='2'){
				html += '<span class="xVStatus">已结束</span>';
			}
			html += '<a href="' + link + '"'+linkAttr+'>' + _opt.data.title;
			html += '</a></p><p class="xVTopic"><span class="xVTxt">'+ _opt.data.xhPollOptionList[0].content;
			html += '</span><span class="xVCountO" id="xVCountO"></span></p><p class="xVTopic"><span class="xVTxt">' + _opt.data.xhPollOptionList[1].content;
			html += '</span><span class="xVCountT" id="xVCountT"></span></p>';
			if(_opt.data.xhPollOptionList.length > 2){
				html += '<p class="xVTopic">…</p>';
			}
			html += '</div><div class="xVJoin"><a href="'  + link + '"'+linkAttr;

			if(_opt.data.progress=='0' || _opt.data.progress=='2'){
				html += '>立即<br />查看</a></div>';
			}else{
				html += '>立即<br />参与</a></div>';
			}

			_t._conbox.innerHTML = html;
			var point1 = _opt.data.xhPollOptionList[0].count;
			var point2 = _opt.data.xhPollOptionList[1].count;
			var oCount1 = document.getElementById('xVCountO');
			var oCount2 = document.getElementById('xVCountT');
			if(point1 == point2){
				oCount1.style.width = '30%';
				oCount2.style.width = '30%';
			}else if(point1 > point2){
				oCount1.style.width = '35%';
				oCount2.style.width = '25%';
			}else if(point1 < point2){
				oCount1.style.width = '25%';
				oCount2.style.width = '35%';
			}else{
				return false;
			}
		}else{
			_t.parentbox.removeChild(_t._conbox);
			return false;
		}
	},
	//调查回调函数
	success_survey:function(_opt){
		var _t = this;
		if(!_opt.data || _opt.data ==''){
			_t.parentbox.removeChild(_t._conbox);
			return false;
		}

		window.includeSurveyGlobal = _opt;
		//200成功 500失败
		if(_opt.code == 200){
			//定义链接路径
			var link = 'http://hd.xuan.news.cn/survey/detail/' + _opt.data.id;
			var linkAttr =' target="_blank"';
			//判断是否手机端
			if(_t._app_type == 'app')
			{
				link = 'javascript:window.open(\''+_t._app_url+'\');';
				linkAttr = '';
			}
			var html = '';
			html += '<div class="xSCon"><a href="http://xuan.news.cn/hd/investigate.html" class="xSTag" target="_blank">调查</a><p class="xSTit">' ;
			
			//判断是否结束  0未开始   1进行中   -1全部
			if(_opt.data.progress=='0'){
				html += '<span class="xSStatus">未开始</span>';
			}
			html += '<a href="' + link + '"'+linkAttr+'>' + _opt.data.title;
			html += '</a></p><div class="xSCWrap"><div class="xSDesp">'+ _opt.data.descp;
			html += '</div><div class="xSQues"><p class="xSQuesC">' + _opt.data.questionCount + '</p><p class="xSQuesT">题目数</p></div></div>';
			html += '</div><div class="xSJoin"><a href="'  + link + '"'+linkAttr;

			if(_opt.data.progress=='0' || _opt.data.progress == '-1'){
				html += '>立即<br />查看</a></div>';
			}else{
				html += '>立即<br />参与</a></div>';
			}

			_t._conbox.innerHTML = html;
			
		}else{
			_t.parentbox.removeChild(_t._conbox);
			return false;
		}
	},
	//话题回调函数
	success_topic:function(_opt){
		var _t = this;
		if(!_opt.data || _opt.data ==''){
			_t.parentbox.removeChild(_t._conbox);
			return false;
		}

		window.includeTopicGlobal = _opt;
		//200成功 500失败
		if(_opt.code == 200){
			//定义链接路径
			var link = 'http://hd.xuan.news.cn/topic/detail/' + _opt.data.id;
			var linkAttr =' target="_blank"';
			//判断是否手机端
			if(_t._app_type == 'app')
			{
				link = 'javascript:window.open(\''+_t._app_url+'\');';
				linkAttr = '';
			}
			var html = '';
			html += '<div class="xTCon"><a href="http://xuan.news.cn/hd/topic.html" class="xTTag" target="_blank">话题</a><p class="xTTit">' ;
			
			//状态位(0初始状态，1编辑状态，2审核成功,3已关闭, 4已删除)
			if(_opt.data.status=='3'){
				html += '<span class="xTStatus">已关闭</span>';
			}
			html += '<a href="' + link + '"'+linkAttr+'>' + _opt.data.title;
			html += '</a></p><div class="xTCWrap">'+ _opt.data.descp;
			html += '</div></div><div class="xTJoin"><a href="'  + link + '"'+linkAttr;

			if(_opt.data.status=='2'){
				html += '>立即<br />参与</a></div>';
			}else{
				html += '>立即<br />查看</a></div>';
			}

			_t._conbox.innerHTML = html;
			
		}else{
			_t.parentbox.removeChild(_t._conbox);
			return false;
		}
	},
	//问答回调函数
	success_QA:function(_opt){
		var _t = this;
		if(!_opt.data || _opt.data ==''){
			_t.parentbox.removeChild(_t._conbox);
			return false;
		}

		window.includeQAGlobal = _opt;
		//200成功 500失败
		if(_opt.code == 200){
			//定义链接路径
			var link = 'http://hd.xuan.news.cn/faqs/detail/' + _opt.data.id;
			var linkAttr =' target="_blank"';
			//判断是否手机端
			if(_t._app_type == 'app')
			{
				link = 'javascript:window.open(\''+_t._app_url+'\');';
				linkAttr = '';
			}
			var html = '';
			html += '<div class="xQACon"><a href="http://xuan.news.cn/hd/interlocution.html" class="xQATag" target="_blank">问答</a><p class="xQATit">' ;
			
			//status 审核状态： 0待审 1已审 3关闭 4删除
			if(_opt.data.status=='3'){
				html += '<span class="xQAStatus">已关闭</span>';
			}
			html += '<a href="' + link + '"'+linkAttr+'>' + _opt.data.title;
			html += '</a></p><div class="xQACWrap"><div class="xQADesp">'+ _opt.data.descp;
			html += '</div><div class="xQAQues"><p class="xQAQuesC">' + _opt.data.questionCount + '</p><p class="xQAQuesT">题目数</p></div></div>';
			html += '</div><div class="xQAJoin"><a href="'  + link + '"'+linkAttr;

			if(_opt.data.status=='1'){
				html += '>立即<br />参与</a></div>';
			}else{
				html += '>立即<br />查看</a></div>';
			}

			_t._conbox.innerHTML = html;
			
		}else{
			_t.parentbox.removeChild(_t._conbox);
			return false;
		}
	}
};


