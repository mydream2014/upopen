
var http = require( 'http' ),
	util = require( 'util' ),
	qs   = require( 'querystring' ),
	article = require( '../controls/article' );

/***********************************************
user

G - info:               企业信息


************************************************/

function list( req, res ){
	
	res.render( 'article/list.ejs', global.webConfig.resSetting( req )  );
	
}

function info( req, res ){
	
	res.render( 'article/info.ejs', global.webConfig.resSetting( req )  );
	
}

function edit( req, res ){
	
	res.render( 'article/edit.ejs', global.webConfig.resSetting( req)  );
	
}

function fetchArticle( req, res ){

	article.fetchArticle( req, res );

}

function fetchArticleInfo( req, res ){

	article.fetchArticleInfo( req, res );

}

function addArticle( req, res ){

	article.addArticle( req, res );

}

function updateArticle( req, res ){

	article.updateArticle( req, res );

}

module.exports = {
	list:               list,
	edit:		edit,
	info: info,
	fetchArticle:   fetchArticle,
	fetchArticleInfo: fetchArticleInfo,
	addArticle:     addArticle,
   updateArticle: updateArticle
};
