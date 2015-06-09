
/**********************************************************************************************
* mongodb mannage
* connect:
* create:
* addUser: add item to user
* findUser: find some user by condition
***********************************************************************************************/


/****************************************** require *******************************************/
/* 
* require dependencies
*/
var mongoose = require( 'mongoose' );

/****************************************** mongodb *******************************************/

/*******************
* connection
*/
mongoose.connect( 'mongodb://127.0.0.1/tank', function( err ) {
	if ( !err ) {
		console.log( '======  connected to MongoDB!  ======' );
	} else {
		throw err;
	}
});

/*******************
* create dbgrid
*/
var Schema = mongoose.Schema;

var UsersSchema   = new Schema({
		ip      : String,
		user	: String,
		role    : String,
		time    : String
	});	

var UsersModel    = mongoose.model( 'Users', UsersSchema );

/*******************
* db log
*/
function dblog( data ){

	//console.log( JSNO.stringify( data, null, 0))

}

/*******************
* addUser

1、add item to users

*/
function addUser( data ){

	new UsersModel( data ).save( function( err ) {
		if( !err ){
			dblog( 'addUser:__' + data );
		}
	});

}

/*
* findUser

1、find some user by condition

*/
function findUser( condition, callback ){
	
	UsersModel.find( condition, function( err, docs ){
		if( !err ){
			callback( docs );
			dblog( 'findDevice:__' + docs );
		}
	} )
}

/*******************
* exports
*/
module.exports = {
	addUser      : addUser,
	findUser     : findUser
}