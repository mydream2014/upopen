
/**********************************************************************************************
* socket.io mannage
* connect:
* create:
* addUser: add item to user
* findUser: find some user by condition
***********************************************************************************************/

/****************************************** require *******************************************/
/* 
* require dependencies
*/

var http         = require( 'http' ), 
	fs           = require( 'fs' ), 
	//db			 = require( './db' ), 
	express      = require( 'express' );


//var addUser = db.addUser;

/* 
* add a new item log to the log.txt
*/
function getToday(){

	var date = new Date,
		y = date.getFullYear(),
		m = date.getMonth() + 1,
		d = date.getDate();
	return y + '-' + m + '-' + d;

}

function addLog( data ){
	
	fs.open( 'log/log' + getToday() + '.txt', 'a', 0644, function( e, fd ){

		if( e ) throw e;
		
		fs.write( fd, JSON.stringify( data, 8 ) + '\n', 0 , 'utf8' , function( e ){

			if( e ) throw e;
			fs.closeSync( fd );

		})

	});

}

addLog( { 'reset': '======================================' + getToday() } )
/****************************************** socket *******************************************/

var models = {};

exports.createIO = function(){
	
	global.io.sockets.on( 'connection', function( socket ){
			
			socket.emit( 'toLinked' );
			
			/*
			* knock - after user choose role and named
			*/
			socket.on( 'knock', function( data ){
				
				models[ socket.id ] = {}; 
				/*
				addUser( {
					ip	 : socket.handshake.address.address,
					user : data.name,
					time : new Date().getTime(),
					role : data.role 
					
				} );
				*/

				addLog( {
					ip	 : socket.handshake.address.address,
					user : data.name,
					time : new Date().getTime(),
					role : data.role 
				} );

				models[ socket.id ].name  = data.name;
				models[ socket.id ].role  = data.role; 
				models[ socket.id ].id    = data.id;
				models[ socket.id ].score = 0;
				socket.broadcast.emit( 'toknock', data );

				var _ids = {};
				for( var _id in models ){
					if( _id !== socket.id ){
						_ids[ _id ] = JSON.stringify( models[ _id ] );
					}
				}

				socket.emit( 'toHavedUsers', _ids );

			});

			/*
			* tankMove - after user's tank move tell others
			*/
			socket.on( 'tankMove', function( data ){
			
				socket.broadcast.emit( 'toTankMove', data );
				models[ socket.id ].tank = data.tank;
			
			});

			/*
			* tankMove - after user's tank move tell others
			*/
			socket.on( 'moveM', function( data ){
				
				//console.log( '=====================' );
				socket.broadcast.emit( 'toMoveM', data );
				//models[ socket.id ].tank = data.tank;
			
			});

			/*
			* disconnect - after user's leave off
			*/
			socket.on( 'disconnect', function(){
				
				if(  models[ socket.id ] ){
					socket.broadcast.emit( 'toLeave', models[ socket.id ] );
					delete models[ socket.id ];
				}

			} );
	
			/*
			* sendChat - chat to all
			*/
			socket.on( 'sendChat', function( data ){
			
				socket.broadcast.emit( 'toSendChat', data );
			
			} );

			/*
			* hitMobile - hit form mobile
			*/
			socket.on( 'hitMobile', function( data ){
			
				socket.broadcast.emit( 'toHitMobile', data );

			} );
			
			/*
			* hit - the user hit one
			*/
			socket.on( 'hit', function( data ){
			
				socket.broadcast.emit( 'toHit', data );

			} );
			
			/*
			* win - the user be kill, tell anyone who win
			*/
			socket.on( 'win', function( data ){

				for( var _id in models ){
				
					if( models[ _id ].id = data.byId ){
						models[ _id ].score += 1;
						socket.broadcast.emit( 'toWin', models[ _id ] );
						socket.emit( 'toWin', models[ _id ] );
						break;
					}

				}

			} );

	});

}
