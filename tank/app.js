
/**
 * Module dependencies.
 */

var express  = require('express')
  , routes   = require('./routes')
  , user     = require('./routes/user')
  , http     = require('http')
  , socket   = require('socket.io')
  , mysocket = require( './local_modules/socket' )
  , path     = require('path');

var app      = express(),
	server   = http.createServer( app ),
	io       = socket.listen( server );

global.io = io;

mysocket.createIO();

// all environments
app.set('port', 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/mobile:*', function(req, res){
  res.render('mobile', { cid: req.route.params[0] });
});
app.get('/users', user.list);

server.listen( app.get( 'port' ), function(){
  console.log( 'Express server listening on port ' + app.get( 'port' ) );
});

