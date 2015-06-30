
var http  = require( 'http' ),
	util  = require( 'util' ),
	tool  = require( '../controls/tool' ),
	qs    = require( 'querystring' ),
	log4js       = require( 'log4js' ),
	//redis = require( '../controls/redis' );
	loan  = require( './loan' ),
	domain = require( 'domain' ),
	issue = require( './issue' ),
	talk = require( './talk' ),
	article = require( './article' ),
	kind = require( './kind' ),
	user  = require( './user' );

/******************************* log4js ***************************************/

var Domain = domain.create();

Domain.on( 'error', function( e ){
	tool.logInfo.error( '[index] req path redis error ============' );
	tool.logInfo.info( e );
});

exports.all = function( app ){
	
	/****************************************
	据访问路径设置权限
	****************************************/
	var Authority = [
			'/user/info',
			'/user/partners',
			'/user/join',
			'/user/joinSuccess',
			'/loan/list',
			'/loan/apply',
			'/loan/success',
			'/loan/failed',
			'/loan/status'
		],
		needMember = [
			'/user/info'	
		];

	function isOnline( key, cb ){
		tool.logInfo.info( '[index] isOnline ' + key );
		redis.get( key, function( reply ){
			tool.logInfo.info( '[index] isOnline get reply ' + reply );
			cb( reply );
		});
	}

	function checkAuthority( req, res, next ){
		
		var i = 0,
			scookie = tool.getCookie( req.headers.cookie, 'sso_cookie' );
		if( scookie == 'undefined' ){
			res.setHeader( 'Set-Cookie', 'sso_cookie=;path=/;' );
			scookie = null;
		}
		if( Authority.indexOf( req.path ) == -1 ){ //需要登录
			next();
			return;
		}
		if( !scookie ){
			tool.logInfo.info( '[index] has not sso_cookie ' + req.path + ':::::::' + req.method );
			res.redirect( '/' );
		} else {
			tool.logInfo.info( '[index] has sso_cookie ' + req.path + ':::::::' + req.method );
			Domain.run( function(){
				isOnline( scookie, function( ret ){
					if( !ret ){
						res.setHeader( 'Set-Cookie', 'sso_cookie=;path=/;' );
						tool.logInfo.info( '[index] has not redis ' + req.path + ':::::::' + req.method );
						res.redirect( '/' );
					} else {
						if( req.path == '/user/join' ){
							tool.logInfo.info( '[index] has redis ' + req.path + ':::::::' + req.method );
							next();
						} else if( ret.member == false ){
							tool.logInfo.info( '[index] has redis but is not member ' + req.path + ':::::::' + req.method );
							res.redirect( '/user/join' );
						} else {
							tool.logInfo.info( '[index] has redis and it will go to next ' + req.path + ':::::::' + req.method );
							next();
						}
					}	
				} );
			} );
			
		}
		tool.logInfo.info( '[index] this path do not need to login ' + req.path + ':::::::' + req.method );
		
	}
	
	app.use( function( req, res, next){

		console.log( req.path + ':::::::::::::' + req.method );
		tool.logInfo.info( req.path + ':::::::::::::' + req.method );
		res.header( "Content-Type", "text/html; charset=utf-8" );

		try {
			if( 0 && req.method == 'GET' ){
				checkAuthority( req, res, next );
			} else {
				tool.logInfo.info( '[index] this path do not need to try check need ' + req.path + ':::::::' + req.method );
				next();
			}
			
		} catch( e ){
			tool.tool.logInfo.error( ' [index] req.path checked error, is will go to index ' );
			tool.tool.logInfo.error( e );
			tool.tool.logInfo.error( '======================================================= ' );
			res.redirect( '/' );
		}

	});

	/***********************************************
	root

	G - /:     产品介绍
	G - index: 首页
	
	************************************************/

	app.get( '/', function( req, res ){
		
		res.render('index.ejs', global.webConfig.resSetting( { path: '/index' } ) );

	});

	app.get( '/index', function( req, res ){
		
		res.render('index.ejs', global.webConfig.resSetting( req ) );

	});

	app.get( '/demo', function( req, res ){
		
		res.render('demo.ejs', { title: global.webConfig.title, basePath: global.webConfig.basePath, currentPage: '/index/index' });

	});
	
	/***********************************************
	issue

	G - product:       产品介绍
	G - wiki:          帮助中心
	P - addWiki:       添加帮助
	G - legal:         法律声明
	G - protocol:      注册协议
	G - introduction:  公司简介
	G - news:          新闻
	G - aboutus:       关于我们
	
	************************************************/

	app.get( '/talk', function( req, res ){
		
		talk.list( req, res );

	});

	app.post( '/fetchTalk', function( req, res ){

		talk.fetchTalk( req, res );	
	
	});

	app.post( '/addTalk', function( req, res ){

		talk.addTalk( req, res );

	} );

	app.get( '/article/list', function( req, res ){
		
		article.list( req, res );

	});

	app.get( '/article/info', function( req, res ){
		
		article.info( req, res );

	});

	app.get( '/article/edit', function( req, res ){
		
		article.edit( req, res );

	});

	app.get( '/fetchArticle', function( req, res ){

		article.fetchArticle( req, res );	
	
	});

	app.get( '/fetchArticleInfo', function( req, res ){

		article.fetchArticleInfo( req, res );	
	
	});

	app.post( '/addArticle', function( req, res ){

		article.addArticle( req, res );

	} );

    app.post( '/updateArticle', function( req, res ){

		article.updateArticle( req, res );

	} );

	app.get( '/kind/list', function( req, res ){

		kind.list( req, res );	
	
	});

	app.get( '/fetchKind', function( req, res ){

		kind.fetchKind( req, res );	
	
	});

	app.get( '/incKind', function( req, res ){

		kind.incKind( req, res );	
	
	});

	app.post( '/addKind', function( req, res ){

		kind.addKind( req, res );

	} );

	/***********************************************
	issue

	G - product:       产品介绍
	G - wiki:          帮助中心
	P - addWiki:       添加帮助
	G - legal:         法律声明
	G - protocol:      注册协议
	G - introduction:  公司简介
	G - news:          新闻
	G - aboutus:       关于我们
	
	************************************************/

	app.get( '/product', function( req, res ){
		
		issue.product( req, res );

	} );

	app.get( '/wiki', function( req, res ){
		
		issue.wiki( req, res );

	} );

	app.post( '/addWiki', function( req, res ){
	
		issue.getWiki( req, res );

	})

	app.get( '/legal', function( req, res ){
		
		issue.legal( req, res );

	} );

	app.get( '/protocol', function( req, res ){
		
		issue.protocol( req, res );

	} );

	app.get( '/introduction', function( req, res ){
		
		issue.introduction( req, res );

	} );

	app.get( '/news', function( req, res ){
		
		issue.news( req, res );

	} );

	app.get( '/aboutus', function( req, res ){
		
		issue.aboutus( req, res );

	} );

	/***********************************************
	user

	G - info:               企业信息
	G - fetchUserParters:   贷款列表页面
	
	************************************************/

	app.get( '/user/info', function( req, res ){
		
		user.info( req, res );

	} );

	app.get( '/user/partners', function( req, res ){
		
		user.partners( req, res );

	} );

	app.get( '/user/findPwd', function( req, res ){
		
		user.findPwd( req, res );

	} );

	app.get( '/user/resetPwd', function( req, res ){
		
		user.resetPwdE( req, res );

	} );

	app.get( '/user/resetPwdSuccess', function( req, res ){
		
		user.resetPwdSuccess( req, res );

	} );

	app.get( '/user/join', function( req, res ){
		
		user.join( req, res );

	} );

	app.get( '/user/joinSuccess', function( req, res ){
		
		user.joinSuccess( req, res );

	} );
	
	app.get( '/user/fetchUserParters', function( req, res ){
		
		user.fetchUserParters( req, res );

	} );

	app.post( '/user/register', function( req, res ){
		
		user.register( req, res );

	} );

	app.post( '/user/login', function( req, res ){
		
		user.login( req, res );

	} );

	app.get( '/user/logout', function( req, res ){
		
		user.logout( req, res );

	} );

	app.get( '/user/fetchSmsCode', function( req, res ){
		
		user.fetchSmsCode( req, res );

	} );

	app.post( '/user/checkSmsCode', function( req, res ){
		
		user.checkSmsCode( req, res );

	} );

	app.post( '/user/resetPwd', function( req, res ){
		
		user.resetPwd( req, res );

	} );

	app.post( '/user/apply', function( req, res ){
		
		user.apply( req, res );

	} );

	app.get( '/user/fetchInfo', function( req, res ){
		
		user.fetchInfo( req, res );

	} );

	app.get( '/user/fetchPartners', function( req, res ){
		
		user.fetchPartners( req, res );

	} );

	app.post( '/user/addPartners', function( req, res ){
		
		user.addPartners( req, res );

	} );

	app.post( '/user/uploadFile', function( req, res ){
		
		user.uploadFile( req, res );

	} );

	app.get( '/user/uploadFile', function( req, res ){
		
		user.uploadFile( req, res );

	} );

	app.post( '/user/partnerFile', function( req, res ){
		
		user.partnerFile( req, res );

	} );

	app.get( '/user/getVerifyCode', function( req, res ){
		
		user.getVerifyCode( req, res );

	} );

	/***********************************************
	loan

	G - loanList:           贷款列表页面
	P - fetchLoanList:      获取贷款列表接口
	G - loanApply:          贷款申请页面
	P - loanApply:          贷款申请接口
	G - loanApplySuccess:   贷款申请成功页面
	G - loanApplyFailed:    贷款申请失败页面
	G - loanApplyStatus:    贷款状态页面
	P - fetchLoanApplyInfo: 单条贷款详情
	
	************************************************/

	app.get( '/loan/list', function( req, res ){
		
		loan.loanList( req, res );

	} );

	app.post( '/loan/fetchLoanList', function( req, res ){
		
		loan.fetchLoanList( req, res );

	} );

	app.get( '/loan/apply', function( req, res ){

		loan.loanApply( req, res );

	} );

	app.post( '/loan/loanApply', function( req, res ){

		loan.LoanApply( req, res );

	} );

	app.get( '/loan/success', function( req, res ){

		loan.loanApplySuccess( req, res );

	} );

	app.get( '/loan/failed', function( req, res ){

		loan.loanApplyFailed( req, res );

	} );

	app.get( '/loan/status', function( req, res ){
		
		loan.loanApplyStatus( req, res );

	} );

	app.get( '/loan/info', function( req, res ){

		loan.fetchLoanApplyInfo( req, res );

	} );

	app.post( '/loan/LoanApplyExpress', function( req, res ){

		loan.LoanApplyExpress( req, res );

	} );

	/***********************************************
	404
	*************************************************/

	app.get( '/error', function( req, res ){
		
		res.render( 'issue/error.ejs', global.webConfig.resSetting( req, '/issue' ) )
		
	});

	app.all( '*', function( req, res ){
		
		res.redirect( '/error' );
		
	});
	

};
