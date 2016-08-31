

var _l_scroll = function(opt){
	var _t = this;
	opt = opt?opt:{}; 
	if(!opt.container)
	{
		return false;
	}
	_t.container = document.getElementById(opt.container);
	
	_t.scroll_fn();
}
_l_scroll.prototype = {
	scroll_fn:function(){
		var _t = this;
		//没有互动，不创建分页
		_t.scroll_objs = _t.container.children;
		if(_t.scroll_objs.length==0){
			return false;
		}

		var oP = document.createElement('p');
		oP.setAttribute('id','xuanIPage');
		oP.setAttribute('class','xuanIPage');
		_t.container.appendChild(oP);

		 _t.scroll_box =[];
		for (var i = 0; i < _t.container.children.length; i++) {
			_t.scroll_box[i]=_t.container.children[i];
		};
		_t.scroll_box.splice(_t.scroll_box.length-1,1);
		
		//没有互动或者只有一个的情况不轮播
		if(_t.scroll_box.length==1){
			return false;
		}

		var html = '';
		for(var i=0;i<_t.scroll_box.length;i++){
			html += '<span _index="'+ i +'"></span>';
		}
		var xuanIPage = document.getElementById('xuanIPage');
		xuanIPage.innerHTML = html;
		var aSpan = xuanIPage.getElementsByTagName('span');

		var num = 0;
		var timer = null;
		function divTab(){
			if(num == _t.scroll_box.length){
				num = 0;
			}
			for(var i=0; i<_t.scroll_box.length;i++){
				_t.scroll_box[i].style.display = 'none';
				aSpan[i].className = '';
			}
			_t.scroll_box[num].style.display = 'block';
			aSpan[num].className = 'hover';
			num++;
		}
		divTab(num);
		timer = setInterval(divTab,3000);
		for(var i=0;i<aSpan.length;i++){
			aSpan[i].onclick = function(){
				var _t = this;
				clearInterval(timer);
				num = _t.getAttribute('_index');
				divTab(num);
				timer = setInterval(divTab,3000);
			};
			_t.scroll_box[i].onmouseover = function(){
				clearInterval(timer);
			};
			_t.scroll_box[i].onmouseout = function(){
				timer = setInterval(divTab,3000);
			};
		}
	}

}