
var http = require( 'http' ),
	util = require( 'util' ),
	qs   = require( 'querystring' ),
	talk = require( '../controls/talk' );

/***********************************************
user

G - info:               企业信息


************************************************/

function list( req, res ){
	
	res.render( 'talk/list.ejs', global.webConfig.resSetting( req, '/interact' )  );
	
}

function fetchTalk( req, res ){

	talk.fetchTalk( req, res );

}

function addTalk( req, res ){

	talk.addTalk( req, res );

}

module.exports = {
	list:               list,
	fetchTalk:   fetchTalk,
	addTalk:     addTalk
};
