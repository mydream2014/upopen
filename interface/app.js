
/**
 * Module dependencies.
 */


var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , socket = require('socket.io')
  , bodyParser = require( 'body-parser' )
  , tool = require('./controls/tool')
  , qs = require( 'querystring' );

var app = express(),
	server = http.Server( app );

global.basePath = 'http://www.demo.com:8090/';
// all environments
app.set('port', process.env.PORT || 8090 );
app.set('views', __dirname + '/views');;
app.set('view engine', 'ejs');

routes.all( app )
app.use( '/static', express.static(path.join(__dirname, 'assets')));
app.use( '/interface', express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({ extended: false }));

// development only
;

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  tool.logInfo.info('server start' + app.get('port') );
});

server.on('close',function(){
	console.log('close');
})




