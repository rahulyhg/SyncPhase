var types = require('./types');

var Processor = function (client) {
	this._client = client;
};

Processor.prototype.types = {};
Processor.prototype.types[types.CURSOR] = function (data) {
	var x = data.readUInt16BE(0);
	var y = data.readUInt16BE(2);

	this._client.set('cursor', {
		x: x,
		y: y
	});
};

Processor.prototype.types[types.BEGIN] = function (data) {
	this._client.set('started', true);
};

Processor.prototype.types[types.COLOR] = function (data) {
	var color = (data.readUInt8(0) << 16) | (data.readUInt8(1) << 8) | data.readUInt8(2);
	this._client.set('color', color);
};

Processor.prototype.types[types.WEIGHT] = function (data) {
	this._client.set('weight', data.readUInt16BE(0));
};

Processor.prototype.types[types.END] = function (data) {
	this._client.set('started', false);
};

Processor.prototype.types[types.MESSAGE] = function (data) {
	this._client.message(data);
};

Processor.prototype.process = function (type, data) {
	if (typeof this.types[type] !== 'undefined') {
		var usable = new Buffer(data.length-1);
		data.copy(usable, 0, 1);

		this.types[type].call(this, usable);
	} else {
		throw 'Type not Understood';
	}
};

module.exports = Processor;