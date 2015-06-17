var fs      = require("fs");
var express = require("express");
var app     = express();
var server  = require("http").Server(app);
var io      = require("socket.io").listen(server);
var url     = require("url");
var qr      = require('qr-image');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false });
app.use(express.static(__dirname + '/public'));
server.listen(3000);
console.log("Server - Waiting connection at port: 3000");

app.get("/qrcode", function(req, res){
  var text = url.parse(req.url, true).query.text;
  try {
      var img = qr.image(text);
      res.writeHead(200, {'Content-Type': 'image/png'});
      img.pipe(res);
  } catch (e) {
      res.writeHead(414, {'Content-Type': 'text/html'});
      res.end('<h1>414 Request-URI Too Large</h1>');
  }
});

app.get("/", function(req, res){
  res.render('home.jade');
});
app.get("/send", function(req, res){
  var toID = url.parse(req.url, true).query.to;  
  res.render('sender.jade', {sendToID: toID});
});

var bindingCodes = {};
io.sockets.on('connection', function (socket) { 
  var simpleCode = getSimpleCode();
  bindingCodes["c"+simpleCode] = socket.id,
  socket.emit("greeting", {
    message: "Welcome to connect server.",
    session: socket.id, 
    simpleCode: simpleCode
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
      else {
        var sendToID = bindingCodes["c"+data.sendToID];
        console.log("Send to :"+data.sendToID);
        io.to(sendToID).emit("receivePhoto", {
          path: savedFilename,
        });
        console.log("Send photo success!");        
      }
    });
  });

  socket.on('disconnect', function() {
    for(var code in bindingCodes) {
      if (bindingCodes[code] == socket.id) 
        delete bindingCodes[code];
    }
    console.log("Client #" + socket.id + " is disconnect.");
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
function randomInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
function getSimpleCode(){
  var code = randomInt(10000, 99999);
  if (typeof bindingCodes["c"+code] != "undefined")
    return getSimpleCode();
  return code;
}