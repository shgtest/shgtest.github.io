/**
 * @author	zf
 * @version	1.0
 * @method	地方页面config配置文件
 */

var _tag = 'v1';
var XHHOST = 'http://tmisc.home.news.cn/cloudnews';

KISSY.config({
	base: XHHOST+'/res/build/',
	debug: true,
	combine: true,
	tag: _tag,
	packages: {
		'gallery': {
			base: XHHOST+'/res/gallery/',
			charset: 'utf-8',
			group: 'gallery',
			ignorePackageNameInUri: true
		},
		'login-intime': {
			base: XHHOST+'/res/dest/',
			charset: 'utf-8'
		},
		'collections': {
			base: XHHOST+'/res/dest/',
			charset: 'utf-8'
		},
		'common': {
			base: XHHOST+'/res/dest/',
			group: 'common',
			charset: 'utf-8'
		},
		'xuan-qa': {
			base: XHHOST+'/res/dest/',
			group: 'xuan',
			charset: 'utf-8'
		},
		'news-radio': {
			base: XHHOST+'/res/dest/',
			charset: 'utf-8'
		},
		'xuan-hd': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			group: 'xuan',
			charset: 'utf-8'
		},
		'xuan-face': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			group: 'xuan',
			charset: 'utf-8'
		},
		'xuan-chart': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			group: 'xuan',
			charset: 'utf-8'
		},
		'xuan-cloud': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			group: 'xuan',
			charset: 'utf-8'
		},
		'xuan-store': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			group: 'xuan',
			charset: 'utf-8'
		},
		'xuan-timeline': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			group: 'xuan',
			charset: 'utf-8'
		},
		'xuan-attr': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			group: 'xuan',
			charset: 'utf-8'
		},
		'xuan-share': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			group: 'xuan',
			charset: 'utf-8'
		},
		'common': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			charset: 'utf-8'
		},
		'list': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			charset: 'utf-8'
		},
		'nav': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			charset: 'utf-8'
		},
		'dingyue': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			charset: 'utf-8'
		},
		'right': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			charset: 'utf-8'
		},
		'ads': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/ads',
			ignorePackageNameInUri : true,
			charset: 'utf-8'
		},
		'xuan-debate': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			charset: 'utf-8'
		},
		'xuan-wiki': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			charset: 'utf-8'
		},
		'detail': {
			base: XHHOST+'/df-news/',
			charset: 'utf-8'
		},
		'df-news':{
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			// base:'/src/',//本地调试
			ignorePackageNameInUri : true,
			charset:'utf-8'
		},
		'tag-news':{
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			// base:'/src/',//本地调试
			ignorePackageNameInUri : true,
			charset:'utf-8'
		},
		'video-switch': {	  //返回视频播放器dom pc端返回调用flash插件 移动端返回video标签
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			charset: 'utf-8'
		},
		'df-user': {	      //封装判断地方频道用户登录、退出接口
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			charset: 'utf-8'
		},
		//以下为老命名，不推荐使用，将来会被删除
		'js': {
			base: XHHOST+'/ln-xuanzhi/subnews/xh_shanxi/src/',
			charset: 'utf-8'
		},
		'news-detail': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			charset: 'utf-8'
		},
		'photo-detail': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/',
			charset: 'utf-8'
		},
		'foto': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/photo-detail',
			ignorePackageNameInUri : true,
			charset: 'utf-8'
		},
		'photo-gallary': {
			base: XHHOST+'/ln-xuanzhi/subnews/src/photo-detail',
			charset: 'utf-8'
		}
    }
});