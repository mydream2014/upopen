
var http = require( 'http' ),
	util = require( 'util' ),
	db   = require( '../db/sql' ),
	tool = require( '../controls/tool' );

/***********************************************
issue
P - addarticle:      添加article
G - fetcharticle:    获取article
************************************************/

function addArticle( req, res ){

	var data = req.body;
	data.date = new Date();
	
	db.addArticle( data, function( err, docs ){
		if( !err ){
			res.send( { code: 0, msg: 'add article success', data: docs } );
			db.incKind( data.kind, 1, function(){} );
		}
	} );

}

function fetchArticle( req, res ){

	db.fetchArticle( req.query, function( err, docs ){
		if( !err ){
			res.send( { code: 0, msg: 'find article success', data: docs } );
		}
	} );

}

function fetchArticleInfo( req, res ){

	db.fetchArticleInfo( req.query, function( err, docs ){
		if( !err ){
			res.send( { code: 0, msg: 'find article success', data: docs } );
		}
	} );

}

module.exports = {
	addArticle:   addArticle,
	fetchArticle: fetchArticle,
	fetchArticleInfo: fetchArticleInfo
}
