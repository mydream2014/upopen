
var http  = require( 'http' ),
	//issue = require( '../controls/issue' ),
	util  = require( 'util' );

/***********************************************
loan

G - product:            贷款列表页面

************************************************/

function article( req, res ){
	
	res.render( 'issue/article.ejs', global.webConfig.resSetting( req, '/issue' ) );

}

function product( req, res ){
	
	res.render( 'issue/product.ejs', global.webConfig.resSetting( req, '/issue' ) );

}

function wiki( req, res ){
	
	res.render( 'issue/wiki.ejs', global.webConfig.resSetting( req, '/issue' ) );

}

function legal( req, res ){
	
	res.render( 'issue/legal.ejs', global.webConfig.resSetting( req, '/issue' ) );

}

function protocol( req, res ){
	
	res.render( 'issue/protocol.ejs', global.webConfig.resSetting( req, '/issue' ) );

}

function introduction( req, res ){
	
	res.render( 'issue/introduction.ejs', global.webConfig.resSetting( req, '/issue' ) );

}

function news( req, res ){
	
	res.render( 'issue/news.ejs', global.webConfig.resSetting( req, '/issue' ) );

}

function aboutus( req, res ){
	
	res.render( 'issue/aboutus.ejs', global.webConfig.resSetting( req, '/issue' ) );

}

function addWiki( req, res ){
	
	//issue.addWiki( req, res )

}


module.exports = {
	
	article:          article,
	product:      product,
	wiki:         wiki,
	legal:        legal,
	protocol:     protocol,
	introduction: introduction,
	news        : news,
	aboutus     : aboutus,
	addWiki     : addWiki

};
