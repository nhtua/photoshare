var SERVER = "http://192.168.1.109:3000/";
var socket = io.connect();
window.onload = function(){	
	socket.on('greeting', function(data){
		console.log(data.message);
		document.getElementById("qrCode").src = SERVER+"qrcode?text="+encodeURIComponent(SERVER+"send?to="+data.session);
	});
	socket.on('receivePhoto', function(data){
		console.log(data);
		document.getElementById("showPhoto").src = data.path;
		document.getElementById("showPhoto").style.display = "inline";
		document.getElementById("btnDownload").href = data.path;
		document.getElementById("btnDownload").style.display = "inline-block";
	});
};