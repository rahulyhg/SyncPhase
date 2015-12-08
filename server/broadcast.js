var clients = require('./clients');
var types = require('./types');
var util = require('util');
var php = require('phpjs');

module.exports = function (broadcaster, message) {
	var sender = message.sender;
	var type = types[message.type.toUpperCase()];

	if (!sender || !((util.isString(sender) && sender === 'system') || util.isNumber(sender)) || sender < 1 || sender > (clients.length+1)) {
		throw 'LEL, WUT sender?';
	}

	if (typeof type === 'undefined') {
		throw 'What kind of broadcast type is this? ' + message.type.toUpperCase() + ',' + type;
	}

	if (util.isString('sender') && sender === 'system') {
		sender = 0;
	}

	var sendable = php.str_pad(sender, 2, '0', 'STR_PAD_LEFT');
	sendable += php.str_pad(type, 2, '0', 'STR_PAD_LEFT');

	message.type = undefined;
	message.sender = undefined;

	for (var key in message) {
		if (typeof message[key] !== 'undefined') {
			sendable += message[key];
		}
	}

	for (var i = 0; i < clients.length; i++) {
		var client = clients[i];

		if (client !== broadcaster) {
			client.getConnection().sendText(sendable);
		}
	}
};