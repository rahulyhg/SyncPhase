var util = require('util');
var EventEmitter = require('events');

var Client = function (id, conn) {
	EventEmitter.call(this);

	this.connection = conn;
	this.data  = {
		id: id,
		name: null,
		cursor: {
			x: 0,
			y: 0
		},
		color: 0x000000,
		weight: 32,
		started: false
	};
};

util.inherits(Client, EventEmitter);

Client.prototype.set = function (key, value) {
	if (typeof this.data[key] !== 'undefined') {
		if (value !== this.data[key]) {
			this.data[key] = value;
			this.emit('change:'+key, value, this);
			this.emit('change', key, value, this);

			return this;
		}
	} else {
		throw 'Attribute Not Found';
	}
};

Client.prototype.get = function (key) {
	if (typeof this.data[key] !== 'undefined') {
		return this.data[key];
	} else {
		throw 'Attribute Not Found';
	}
};

Client.prototype.message = function (buffer) {
	this.emit('message', buffer, this);
};

module.exports = Client;