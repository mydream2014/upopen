
global.webConfig = {
	title: '优品开源',
	page: {
		'/': '首页',
		'/index': '首页',
		'/error': '惊呆了',
		'/product': '产品介绍',
		'/talk' : '随便聊聊',
		'/wiki': '帮助中心',
		'/article/list': '文章列表',
		'/article/info': '文章详情',
		'/article/edit': '文章编辑',
		'/introduction': '关于我们'
		
	},
	basePath: 'http://www.upopen.com', //'http://www.demo.com', //
	min: '',//'/min',
	resSetting: function( req, path ){
		console.log( req.path + ' =========')
		return {
			title:       global.webConfig.page[ req.path ] + '-' + global.webConfig.title,
			basePath:    global.webConfig.basePath,
			min:         global.webConfig.min,  
			currentPage: ( path || '' ) + req.path.replace(/(\/[a-z|A-Z]*)?$/,function($1){ ;return $1 + $1}),
		}
	}
}

/**************************************
http request config
***************************************/
global.hostConfig = {
	hostname  : 'qjdchina.com',
	host      : '10.1.1.62',//'172.16.22.180',//'10.175.192.189',  //
	port      : 80,
	uploadDir : './assets/upload'   //file upload dir
}

/**************************************
redis config
***************************************/
global.redisConfig = {
	host      : '10.1.1.182', //host      : '172.16.22.180', //
	port      : 7777
}

module.exports = {};
