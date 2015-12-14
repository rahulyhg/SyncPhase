var types = require('./types');

var Switcher = function (clients) {
	this._clients = clients;
};

// TODO: Reuse Buffers Whenever Possible

Switcher.prototype.types = {
	join: function () {
		return {
			type: types.JOIN
		};
	},
	cursor: function (position) {
		var buffer = new Buffer(4);
		buffer.writeUInt16BE(position.x, 0);
		buffer.writeUInt16BE(position.y, 2);

		return {
			type: types.CURSOR,
			data: buffer
		};
	},
	color: function (color) {
		var r = color >> 16;
		var g = (color >> 8) & 0xff;
		var b = color & 0xff;

		var buffer = new Buffer(3);
		buffer.writeUInt8(r, 0);
		buffer.writeUInt8(g, 1);
		buffer.writeUInt8(b, 2);

		return {
			type: types.COLOR,
			data: buffer
		};
	},
	weight: function (weight) {
		var buffer = new Buffer(2);
		buffer.writeUInt16BE(weight);

		return {
			type: types.WEIGHT,
			data: buffer
		};
	},
	message: function (msg) {
		return {
			type: types.MESSAGE,
			data: msg
		};
	},
	started: function (started) {
		if (started === true) {
			return {
				type: types.BEGIN
			};
		}

		return {
			type: types.END
		};
	},
	leave: function () {
		return {
			type: types.LEAVE
		};
	}
};

Switcher.prototype.makeBuffer = function (client, key, value) {
	var payload = this.types[key](value);
	var msg = null;

	if (payload.data instanceof Buffer) {
		// Copy the Payload Buffer onto the msg Buffer
		msg = new Buffer(payload.data.length+2);
		payload.data.copy(msg, 2);
	} else {
		msg = new Buffer(2);
	}

	// Write Meta Data
	msg.writeUInt8(client.get('id'), 0);
	msg.writeUInt8(payload.type, 1);

	return msg;
}

Switcher.prototype.broadcast = function (client, key, value) {
	var msg = this.makeBuffer(client, key, value);

	this._clients.forEach(function (peer) {
		if (peer !== client) {
			try {
				peer.connection.send(msg);
			} catch (e) {
			}
		}
	}, this);
};

module.exports = Switcher;