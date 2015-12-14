var clients = require('./clients');
var Client = require('./client');
var types = require('./types');
var Processor = require('./processor');
var Switcher = require('./switcher');

var switcher = new Switcher(clients);

module.exports = function (connection) {
	console.log('New Connection. ('+ (clients.length+1) +' in total)');

	var client = new Client(clients.length+1, connection);
	var processor = new Processor(client);

	connection.on('message', function (data) {
		var type = data.readUInt8(0);
		processor.process(type, data);
	});


	clients.forEach(function (peer) {
		var msg = switcher.makeBuffer(peer, 'join');
		client.connection.send(msg);
	});

	switcher.broadcast(client, 'join');
	clients.push(client);


	client.on('change', function (key, value, client) {
		switcher.broadcast(client, key, value);
	});

	client.on('message', function (buffer, client) {
		switcher.broadcast(client, 'message', buffer);
	});

	connection.on('close', function () {
		var index = clients.indexOf(client);
		clients.splice(index, 1);

		console.log('#'+client.get('id')+' disconnected.');
		switcher.broadcast(client, 'leave');
	});

	switcher.broadcast(client, 'join');
};