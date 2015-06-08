
/**
 * Module dependencies.
 */
var express    = require( 'express' ),
    routes     = require( './routes' ),
    http       = require( 'http' ),
    path       = require( 'path' ),
    socket     = require( 'socket.io' ),
    bodyParser = require( 'body-parser' ),
    config     = require( './controls/config' ),
    tool       = require( './controls/tool' );

var app        = express(),
	server     = http.Server( app );

// all environments
app.set( 'port', process.env.PORT || 3000 );
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );
app.use( '/', express.static( path.join( __dirname, 'assets' )));
app.use( bodyParser.urlencoded({ extended: false }));

// development only
routes.all( app );

server.listen( app.get( 'port' ), function(){
	console.log( 'root server listening on port ' + app.get( 'port' ));
	tool.logInfo.info( 'server start' + app.get( 'port' ) );
} );

server.on( 'close', function(){
	console.log( 'close' );
} );




