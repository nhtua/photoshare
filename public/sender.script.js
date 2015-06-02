var socket;
window.onload = function() {
	
	socket = io.connect();
	
	socket.emit("setRole","sender");

	socket.on("greeting", function(data){
		console.log(data);
	});

	document.getElementById("fileSelector").addEventListener("change", function(){		
		submitImg();
	});

};

function submitImg(){
	var selector 	= document.getElementById("fileSelector");
	var img 			= document.getElementById("review");

	var reader = new FileReader();
  reader.onload = function (e) {
    img.src = e.target.result;
		socket.emit("sendPhoto", {base64:e.target.result});
  }
 	reader.readAsDataURL(selector.files[0]);
}