var WebSocketServer = require('ws').Server;
var ComManager = require('./server/com');

var Com = new WebSocketServer({
	port: 8897
});

Com.on('connection', ComManager);