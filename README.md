#Photoshare v0.0.3
Simple photo sharing real-time application with Nodejs, Expressjs

#Config
1. Goto the `root` directory and run `npm install`.
2. Create `/public/upload/` directory to storage photo files.
3. Change server domain in the first line of `/public/js/receiver.script.js`
4. Run `node server.js` to start application. If you want to run on port 80, use `sudo node server.js`.

# Features
##1. Identify receiver device by QR code 
- Access web app on device, which you want to send photo to.
- Use your smart-phone to scan QR code and access to sender tool.

##2. Real-time sharing
- The sharing photo will be appear immediately. The receiver do nothing, except only go to http://your-app.com/
- Data transfer rate depends on the bandwidth of the network and device's CPU.


