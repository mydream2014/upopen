var socket;
socket = io.connect( window.location.href );
console.log( socket );
socket.on('get', function( data ){
	$('#outText').append($('<li>').html(data));
})



$('#textIn').on('blur', function(){
	this.value;
	socket.emit('set', this.value);
})