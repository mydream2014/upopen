
var http = require( 'http' ),
	util = require( 'util' ),
	db   = require( '../db/sql' ),
	tool = require( '../controls/tool' );

/***********************************************
issue
P - addWiki:      添加wiki
G - fetchWiki:    获取wiki
************************************************/

function addTalk( req, res ){

	var data = req.body;

	data.hot = 0;
	data.date = tool.getTime( { type: 'millis' } );
	data.sort = 1;
	data.title = '11';
	
	db.addTalk( req.body, function( err, docs ){
		if( !err ){
			res.send( { code: 0, msg: 'add wiki success', data: docs } );
		}
	} );

}

function fetchTalk( req, res ){

	db.FetchTalk( req.body, function( err, docs ){
		if( !err ){
			res.send( { code: 0, msg: 'find wiki success', data: docs } );
		}
	} );

}

module.exports = {
	addTalk:   addTalk,
	fetchTalk: fetchTalk
}
