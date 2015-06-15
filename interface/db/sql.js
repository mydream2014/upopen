
var mongoose = require( 'mongoose' ),
	fs = require( 'fs' );

mongoose.connect( 'mongodb://127.0.0.1/interface', function( err ){
	if( !err ){
		console.log( 'DB ===== connect to mongoDB' );
	} else {
		throw err;
	}
});

/***************************************************************/
/*model*/
var Schema = mongoose.Schema;

var ServiceTest = new Schema({
	id: String,
	url: String,
	kind: String,
	name: String,
	description: String,
	items: Object,
	type: String,
	sort: Number,
	date: Date
});

var serviceTestModel = mongoose.model( 'serviceTest', ServiceTest, 'serviceTest' );

/***************************************************************/
/*sql*/
/******** User *********/
function addServiceTest( data, callback ){
	console.log( data );
	var service = new serviceTestModel( data );
	service.save( function( err ){
		callback( err );
	})
}

function updateServiceTest( id, data, callback ){
	
	
	var items = data.items,
		newItems = {};
	
	for( var k in items ){
		newItems[ k ] = items[ k ];
	}
	data.items = newItems;
	
	serviceTestModel.update( { _id: id }, data, {}, function( err, docs ){
		callback( err );
	})
	
}

function findServiceTest( data, callback ){
	serviceTestModel.find( data ).sort({ kind: -1 }).exec( function( err, docs ){
		callback( err, docs )
	})
}

function delServiceTest( data, callback ){
	serviceTestModel.remove( {'_id': data._id }, function( err, numberOfRemovedDocs ){
		callback( err );
	} );
}

/*exports*/
module.exports = {
	addServiceTest: addServiceTest,
	updateServiceTest: updateServiceTest,
	findServiceTest: findServiceTest,
	delServiceTest: delServiceTest
}