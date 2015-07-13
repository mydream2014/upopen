
var mongoose = require( 'mongoose' ),
	fs = require( 'fs' );

mongoose.connect( 'mongodb://127.0.0.1/upopen', function( err ){
	if( !err ){
		console.log( 'DB ===== connect to mongoDB' );
	} else {
		throw err;
	}
});

/***************************************************************/
/*model*/
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	kind: String,
	title: String,
	description: String,
	content: String,
	author: String,
	tag: Array,
	date: Date,
	link: String,
	sort: Number,
	hot: Number,
	disabled: Boolean
});

var ArticleModel = mongoose.model( 'Article', ArticleSchema, 'Article' );

var KindSchema = new Schema({
	name: String,
	index: String,
	amount: Number,
	sort: Number,
	disabled: Boolean,
	date: Date
});

var KindModel = mongoose.model( 'kind', KindSchema, 'Kind' );

var TalkSchema = new Schema({
	belong: String,
	title: String,
	content: String,
   name: String,
	date:Date,
	link: String,
	sort: Number,
	hot: Number
});

var TalkModel = mongoose.model( 'talk', TalkSchema, 'talk' );

/***************************************************************/
/*sql*/
/******** Article *********/
function addArticle( data, callback ){

	( new ArticleModel( data ) ).save( function( err, doc ){
		callback( err, doc );
	});

}

function updateArticle( id, data, callback ){
    var query = {},
          id;
    console.log( data );
	for( var key in data ){
        
		if( ArticleSchema.tree[ key ] ){
			query[ key ] = data[ key ];	
		};
	}
    query.tag = query.tag.split(',');
    id = query.id;
    console.log( query );
    delete query.id;
	ArticleModel.update( { _id: id }, query, function( err, doc ){
		callback( err, doc );
	});
	
}

function fetchArticle( data, callback ){
	var query = {};
	for( var key in data ){
		if( ArticleSchema.tree[ key ] ){
			query[ key ] = data[ key ];	
		};
	}
	console.log( query )
	ArticleModel.find( query, { 'content': 0, 'type': 0, 'disabled': 0, 'sort': 0, 'type': 0  } ).sort( { 'sort': -1, 'date' : -1 } ).exec( function( err, docs ){
		callback( err, docs )
	})
}

function fetchArticleByKind( data, callback ){
	var query = {};
	for( var key in data ){
		if( ArticleSchema.tree[ key ] ){
			query[ key ] = data[ key ];	
		};
	}
	console.log( query )
	ArticleModel.find( query, { 'content': 0, 'type': 0, 'disabled': 0, 'sort': 0, 'type': 0  } ).sort( { 'kind': 1, 'sort': -1, 'date' : -1 } ).exec( function( err, docs ){
		callback( err, docs )
	})
}

function fetchArticleInfo( data, callback ){
	
	var query = {};
	for( var key in data ){
		if( ArticleSchema.tree[ key ] ){
			query[ key ] = data[ key ];	
		};
	}
	
	ArticleModel.findOne( query ).exec( function( err, docs ){
		callback( err, docs )
	})
}

/***************************************************************/
/*sql*/
/******** Talk *********/
function addTalk( data, callback ){

	( new TalkModel( data ) ).save( function( err, doc ){
		callback( err, doc );
	});

}

function updateTalk( id, data, callback ){
	TalkModel.update( { _id: id }, data, function( err, docs ){
		callback( err, doc );
	});
	
}

function fetchTalk( data, callback ){
	TalkModel.find( data ).exec( function( err, docs ){
		callback( err, docs )
	})
}

function fetchLastTalk( data, callback ){
    var query = {};
	for( var key in data ){
		if( TalkSchema.tree[ key ] ){
			query[ key ] = data[ key ];	
		};
	}
    console.log( query );
	TalkModel.find( query ).limit( 10 ).sort( { date: -1 } ).exec( function( err, docs ){
		callback( err, docs )
	})
}


/***************************************************************/
/*sql*/
/******** Kind *********/
function addKind( data, callback ){

	( new KindModel( data ) ).save( function( err, doc ){
		callback( err, doc );
	});

}

function updateKind( id, data, callback ){
	KindModel.update( { _id: id }, data, function( err, docs ){
		callback( err, doc );
	});
	
}

function fetchKind( data, callback ){
	var query = {};
	for( var key in data ){
		if( KindSchema.tree[ key ] ){
			query[ key ] = data[ key ];	
		};
	}
	KindModel.find( query ).sort( {  "sort":1 } ).exec( function( err, docs ){
		callback( err, docs );
	});
}

function incKind( index, amount, callback ){
	KindModel.update( { "index": index }, { $inc: { "amount": amount } }, function( err, docs ){
		console.log( 'inckind-----------------------------');
		console.log( err );
		callback( err, docs );
	});
}

/****************************************************************/
/*exports*/
module.exports = {

	addKind: addKind,
	updateKind: updateKind,
	fetchKind: fetchKind,
	incKind: incKind,

	addArticle:    addArticle,
	updateArticle: updateArticle,
	fetchArticle:   fetchArticle,
    fetchArticleByKind: fetchArticleByKind,
	fetchArticleInfo: fetchArticleInfo,

	addTalk:    addTalk,
	updateTalk: updateTalk,
	FetchTalk:   fetchTalk,
    FetchLastTalk: fetchLastTalk
}
