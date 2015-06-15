
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
	type: String,
	title: String,
	content: String,
	date: String,
	link: String,
	sort: String,
	hot: String
});

var ArticleModel = mongoose.model( 'Article', ArticleSchema, 'Article' );

var TalkSchema = new Schema({
	type: String,
	title: String,
	content: String,
	date: String,
	link: String,
	sort: String,
	hot: String
});

var TalkModel = mongoose.model( 'talk', TalkSchema, 'talk' );

/***************************************************************/
/*sql*/
/******** Wiki *********/
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
	console.log( data );
	TalkModel.find( data ).exec( function( err, docs ){
		callback( err, docs )
	})
}

/****************************************************************/
/*exports*/
module.exports = {
	addTalk:    addTalk,
	updateTalk: updateTalk,
	FetchTalk:   fetchTalk
}
