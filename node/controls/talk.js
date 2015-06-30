
var http = require( 'http' ),
	util = require( 'util' ),
	db   = require( '../db/sql' ),
	tool = require( '../controls/tool' );

/***********************************************
issue
P - addtalk:      添加talk
G - fetchtalk:    获取talk
************************************************/

function addTalk( req, res ){

	var data = req.body;

	data.hot = 0;
	data.date = new Date();
	data.sort = 1;
	data.title = '11';
	
	db.addTalk( req.body, function( err, docs ){
		if( !err ){
			res.send( { code: 0, msg: 'add talk success', data: docs } );
		}
	} );

}

function fetchTalk( req, res ){

	db.FetchTalk( req.body, function( err, docs ){
		if( !err ){
			res.send( { code: 0, msg: 'find talk success', data: docs } );
		}
	} );

}

module.exports = {
	addTalk:   addTalk,
	fetchTalk: fetchTalk
}
