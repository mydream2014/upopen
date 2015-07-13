
var http  = require( 'http' ),
	util  = require( 'util' ),
	tool  = require( '../controls/tool' ),
	qs    = require( 'querystring' ),
	log4js       = require( 'log4js' ),
	//redis = require( '../controls/redis' );
	domain = require( 'domain' ),
	talk = require( './talk' ),
	article = require( './article' ),
	kind = require( './kind' );

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
	
	app.use( function( req, res, next){
	
		tool.logInfo.info( req.path + ':::::::::::::' + req.method );
		res.header( "Content-Type", "text/html; charset=utf-8" );

		next();

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
	TALK

	P - fetchTalk:       
	G - addTalk:    
	
	************************************************/

    app.get( '/fetchTalk', function( req, res ){
		talk.fetchTalk( req, res );	
	
	});

	app.post( '/addTalk', function( req, res ){

		talk.addTalk( req, res );

	} );

    /***********************************************
	ARTICLE

	P - fetchTalk:       
	G - addTalk:    
	
	************************************************/

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

    app.get( '/fetchArticleByKind', function( req, res ){

		article.fetchArticleByKind( req, res );	
	
	});

	app.get( '/fetchArticleInfo', function( req, res ){

		article.fetchArticleInfo( req, res );	
	
	});

    app.get( '/fetchArticleEditInfo', function( req, res ){

        article.fetchArticleEditInfo( req, res );
    
    })

	app.post( '/addArticle', function( req, res ){

		article.addArticle( req, res );

	} );

    app.post( '/updateArticle', function( req, res ){

		article.updateArticle( req, res );

	} );

    /***********************************************
	KIND

	P - fetchTalk:       
	G - addTalk:    
	
	************************************************/

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
	404
	*************************************************/

	app.get( '/error', function( req, res ){
		
		res.render( 'issue/error.ejs', global.webConfig.resSetting( req, '/issue' ) )
		
	});

	app.all( '*', function( req, res ){
		
		res.send( '' );
		
	});
	

};
