
var models = {};
exports.create = function( io ){
	
	io.on( 'connection', function( socket ){
		
		socket.emit( 'hasconn' );
		socket.on( 'comment', function( data ){
				socket.broadcast.emit( 'outComment', data );
			
		} );
		
	})

}