
var redis = require( 'redis' ),
	tool  = require( './tool' );

/******************************* redis client create ***************************************/
var client = redis.createClient( global.redisConfig.port, global.redisConfig.host );

/******************************* redis client create ***************************************/
client.on("error", function (err) {
   tool.logInfo.error( 'redis error =========' );
   tool.logInfo.error( err );
});

client.on( 'connect', function(){
	tool.logInfo.info( 'redis connect' );
	console.log( 'redis connect ' );
});

/******************************* redis checked is connected before do something ***************************************/
function hasConnected( cb ){
	tool.logInfo.info( 'redis connnected status is :::::::' + client.connected );
	if( client.connected ){
		cb();
	} else {
		client = redis.createClient( global.redisConfig.port, global.redisConfig.host );
		client.on( 'connect', function( err, ret ){
			tool.logInfo.warn( 'redis connect again' );
			cb();
		})
	}
}

function redisGet( key, cb ){
	
	hasConnected( function(){
		client.get( key, function( err, reply ){
			if( !err && reply ){
				reply = JSON.parse( reply.toString() );
			}
			tool.logInfo.info( 'redis get ' + key + '::' + reply );
			cb( reply );
		});
	});

}

function redisSet( key, value ){

	hasConnected( function(){
		tool.logInfo.info( 'redis set ' + key + '::' + value );
		client.set( key, value );
	});

}


module.exports = { 
	get: redisGet,
	set: redisSet
}