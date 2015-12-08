var socket = require('nodejs-websocket');
var messaging = require('./server/messaging');

// Messaging
socket.createServer(messaging).listen(8897);

// // Drawing
// socket.createServer(function (connection) {
	
// }).listen(8898);

// // Audio
// socket.createServer(function (connection) {

// }).listen(8899);