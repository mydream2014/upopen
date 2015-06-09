
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , socket = require('socket.io');

var app = express();

// all environments
app.set('port', process.env.PORT || 8081);
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
app.get('/:id', function( req, res){
	//var users = io.sockets;
	var roomId = req.params.id;
	res.render('index',{id:roomId});
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = socket.listen( server );

io.sockets.on( 'connection', function( socket ){
	socket.on( 'join' , function(data){
		if( socket.manager.rooms['/'+data.roomId] && socket.manager.rooms['/'+data.roomId].length > 1 ){
			debugger
			//socket.broadcast.emit( 'msg', {msg: '该房间已潇'});
		} else {
			socket.join(data.roomId);
			if( socket.manager.rooms['/'+data.roomId].length == 2 ){
				socket.in(data.roomId).broadcast.emit('twoplayer', data);
				socket.in(data.roomId).emit('twoplayer', data);
			} else {
				socket.in(data.roomId).broadcast.emit('oneplayer', data);
				socket.in(data.roomId).emit('oneplayer', data);
			}
		}
	});

	socket.on( 'disconnect', function(data){
		socket.in(data.roomId).broadcast.emit('leave', data);
		console.log(socket.manager.rooms['/'+data.roomId]);
		
		socket.leave(data.roomId);
		
	});

	socket.on('isstart', function( data ){
		socket.in(data.roomId).broadcast.emit('start');
	});

	socket.on('iswin', function( data ){
		socket.in(data.roomId).broadcast.emit('win', data);
	});

	socket.on( 'getPath', function( data ){
		socket.in(data.roomId).broadcast.emit('setPath', data);
	});

	socket.on( 'ischat', function( data ){
		socket.in(data.roomId).broadcast.emit('chat', data);
	});

});




