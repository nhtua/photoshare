var socket;
window.onload = function() {
	
	socket = io.connect();	

	socket.on("greeting", function(data){
		console.log(data);
	});
	document.getElementById("logo").addEventListener("click", function(){
		document.getElementById("fileSelector").click();
	});
	document.getElementById("fileSelector").addEventListener("change", function(){		
		submitImg();
	});

};

function submitImg(){
	var selector 	= document.getElementById("fileSelector");
	var img 			= document.getElementById("review");
	var toID 			= document.getElementById("sendToID");

	var reader = new FileReader();
  reader.onload = function (e) {
    img.src = e.target.result;
		socket.emit("sendPhoto", {sendToID:toID.value, base64:e.target.result});
  }
 	reader.readAsDataURL(selector.files[0]);
}