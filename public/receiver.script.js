var socket = io.connect();

window.onload = function(){	
	socket.emit('setRole', 'receiver');
	socket.on('receivePhoto', function(data){
		console.log(data);
		document.getElementById("showPhoto").src = data.path
	});
}