
var http = require( 'http' ),
	util = require( 'util' ),
	db   = require( '../db/sql' ),
	tool = require( '../controls/tool' );

/***********************************************
issue
P - addWiki:      添加wiki
G - fetchWiki:    获取wiki
************************************************/

function addWiki( req, res ){
	
	db.addWiki( req.body, function( err, docs ){
		if( !err ){
			res.send( { code: 0, msg: 'add wiki success', data: docs } );
		}
	} );

}

function fetchWiki( req, res ){

	db.findWiki( req.body, function( err, docs ){
		if( !err ){
			res.send( { code: 0, msg: 'find wiki success', data: docs } );
		}
	} );

}

module.exports = {
	addWiki:   addWiki,
	fetchWiki: fetchWiki
}