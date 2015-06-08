
var mongoose = require( 'mongoose' ),
	fs = require( 'fs' );

mongoose.connect( 'mongodb://127.0.0.1/qjdissue', function( err ){
	if( !err ){
		console.log( 'DB ===== connect to mongoDB' );
	} else {
		throw err;
	}
});

/***************************************************************/
/*model*/
var Schema = mongoose.Schema;

var WikiSchema = new Schema({
	type: String,
	title: String,
	content: String,
	date: String,
	link: String,
	sort: String,
	hot: String
});

var WikiModel = mongoose.model( 'Wiki', WikiSchema, 'Wiki' );

/***************************************************************/
/*sql*/
/******** Wiki *********/
function addWiki( data, callback ){

	( new WikiModel( data ) ).save( function( err, doc ){
		callback( err, doc );
	});

}

function updateWiki( id, data, callback ){
	WikiModel.update( { _id: id }, data, function( err, docs ){
		callback( err, doc );
	})
	
}

function findWiki( data, callback ){
	WikiModel.find( data ).exec( function( err, docs ){
		callback( err, docs )
	})
}

/****************************************************************/
/*exports*/
module.exports = {
	addWiki:    addWiki,
	updateWiki: updateWiki,
	findWiki:   findWiki
}