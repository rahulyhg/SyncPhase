var Client = require('./client');
var clients = require('./clients');

var messaging = function (connection) {
	Client(connection);
};

module.exports = messaging;