var SERVER = "http://192.168.0.117:3000/";
var socket = io.connect();
window.onload = function(){	
	socket.on('greeting', function(data){
		console.log(data.message);
		document.getElementById("qrCode").src = SERVER+"qrcode?text="+encodeURIComponent(SERVER+"send?to="+data.simpleCode);
		document.getElementById("simpleCode").innerText = data.simpleCode;
	});
	socket.on('receivePhoto', function(data){
		console.log(data);
		document.getElementById("showPhoto").src = data.path;
		document.getElementById("showPhoto").style.display = "inline";
		document.getElementById("btnDownload").href = data.path;
		document.getElementById("btnDownload").style.display = "inline-block";
	});
	document.getElementById("findFriend").addEventListener("click", function(){
		if (document.getElementById("inputSimpleCode").value.trim() == "")
			return;
		window.location.href = window.location.href+"send?to="+document.getElementById("inputSimpleCode").value;
	});
};