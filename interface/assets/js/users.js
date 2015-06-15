var socket;
socket = io.connect('http://127.0.0.1:3000/users');
console.log( socket );
socket.on('get', function( data ){
	$('#outText').append($('<li>').html(data));
})



$('#textIn').on('blur', function(){
	this.value;
	socket.emit('set', this.value);
})