var fs      = require("fs");
var express = require("express");
var app     = express();
var server  = require("http").Server(app);
var io      = require("socket.io").listen(server);


app.use(express.static(__dirname + '/public'));
server.listen(3000);
console.log("Server - Waiting connection at port: 3000");


var roles = {
  sender  : "",
  receiver    : ""  
};
io.sockets.on('connection', function (socket) { 
  socket.on('setRole', function (data) {
    socket.role = data.trim();
    roles[socket.role] = socket.id;
    console.log("Role "+ socket.role + " is connected.");    
  }); 

  socket.on("sendPhoto", function(data){
    var guess = data.base64.match(/^data:image\/(png|jpeg);base64,/)[1];
    var ext = "";
    switch(guess) {
      case "png"  : ext = ".png"; break;
      case "jpeg" : ext = ".jpg"; break;
      default     : ext = ".bin"; break;
    }
    var savedFilename = "/upload/"+randomString(10)+ext;
    fs.writeFile(__dirname+"/public"+savedFilename, getBase64Image(data.base64), 'base64', function(err) {
      if (err !== null)
        console.log(err);
      else 
        io.to(roles.receiver).emit("receivePhoto", {
          path: savedFilename,
        });
        console.log("Send photo success!");
    });
  });

  socket.on('disconnect', function() {
    console.log("Role " + socket.role + " is disconnect.");
  }); 
});

function randomString(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function getBase64Image(imgData) {
    return imgData.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
}