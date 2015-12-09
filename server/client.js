var clients = require('./clients');
var types = require('./types');
var broadcast = require('./broadcast');

var sha512 = require('js-sha512').sha512;
var util = require('util');
var php = require('phpjs');



var Client = function (connection) {

	var data = {
		id: null,
		secret: null,
		name: null,
		cursor: {
			x: 0,
			y: 0
		},
		color: '000000',
		weight: 32
	};

	// Data Initialization
	var ex_id = 0;
	for (var i = 0; i <= clients.length; i++) {
		var client = clients[i];

		if (typeof client === 'undefined' || client.getId() !== (ex_id+1)) {
			data.id = ex_id+1;
			break;
		}

		ex_id = client.getId();
	}

	data.name = 'user_' + (data.id);



	// New Client Connects
	var joinFrame = function () {
		return {
			sender: data.id,
			type: 'join',
			name: data.name
		};
	};

	broadcast(this, joinFrame());





	// Misc Stuff
	this.getConnection = function () {
		return connection;
	};

	this.getId = function () {
		return data.id;
	};






	// Secret Key for Requesting Further services
	this.secret = function () {
		data.secret = sha512((new Date())+Math.random()+Math.random()+data.id);
		return data.secret;
	};

	this.matchSecret = function (secret) {
		if (data.secret === secret) {
			return true;
		}

		return false;
	};





	// Client Name
	var nameFrame = function () {
		return {
			sender: data.id,
			type: 'name_set',
			name: data.name
		};
	};

	this.setName = function (name) {
		if (util.isString(name) && name.length > 1) {
			data.name = name;
			broadcast(this, nameFrame());

			console.log('Client#' + data.id + ' Requested Name: ' + data.name);
		} else {
			throw 'Name not a string or too short';
		}
	};

	this.getName = function () {
		return data.name;
	};







	// Client Current Color
	var colorFrame = function () {
		return {
			sender: data.id,
			type: 'color',
			color: data.color
		};
	};

	this.setColor = function (color) {
		if (!util.isString(color) || color.length !== 6) {
			throw color + 'is not a string of 6 characters';
		}

		color = color || '000000';
		data.color = color;

		broadcast(this, colorFrame());

		console.log('Client#' + data.id + ' Requested Color: #' + data.color);
	};

	this.getColor = function () {
		return data.color;
	};








	// Cursor Position
	var cursorFrame = function () {
		return {
			sender: data.id,
			type: 'CURSOR_POSITION',
			x: php.str_pad(data.cursor.x, 4, '0', 'STR_PAD_LEFT'),
			y: php.str_pad(data.cursor.y, 4, '0', 'STR_PAD_LEFT')
		};
	};

	this.setCursorPosition = function (x, y) {
		if (!(util.isNumber(x) && util.isNumber(y))) {
			throw 'x & y must both be a number';
		}

		x = Math.round(x) || 0;
		y = Math.round(y) || 0;

		data.cursor.x = x;
		data.cursor.y = y;

		broadcast(this, cursorFrame());
	};

	this.getCursorPosition = function () {
		return data.cursor;
	};








	// Client Stroke Weight
	var weightFrame = function () {
		return {
			sender: data.id,
			type: 'weight',
			weight: php.str_pad(data.weight, 3, '0', 'STR_PAD_LEFT')
		};
	};

	this.setWeight = function (weight) {
		weight = weight || 32;
		data.weight = weight;

		broadcast(this, weightFrame());

		console.log('Client#' + data.id + ' Requested Weight: #' + data.weight);
	};

	this.getWeight = function () {
		return data.weight;
	};








	// Client Activity Listening
	connection.on('text', function (str) {
		var action = parseInt(str.substr(0, 2));

		switch (action) {
			case types.NAME_SET:
				this.setName(str.substr(2));
				break;

			case types.COLOR:
				this.setColor(str.substr(2));
				break;

			case types.WEIGHT:
				this.setWeight(parseInt(str.substr(2)));
				break;

			case types.CURSOR_POSITION:
				this.setCursorPosition(
					parseInt(str.substr(2, 4)),
					parseInt(str.substr(6, 4))
				);

				break;

			case types.START:
				this.start();
				break;

			case types.STOP:
				this.stop();
				break;

			case types.TEXT_MESSAGE:
				this.message(str.substr(2), false);
				break;

			case types.MARKDOWN_MESSAGE:
				this.message(str.substr(2), true);
				break;
		}
	}.bind(this));

	var peers = [];
	for (var i in clients) {
		var client = clients[i];

		peers.push({
			id: client.getId(),
			name: client.getName(),
			cursor: client.getCursorPosition(),
			color: client.getColor(),
			weight: client.getWeight()
		});
	}

	connection.sendText(JSON.stringify({
		sender: 'system',
		type: 'id',
		name: data.name,
		id: this.getId(),
		secret: this.secret(),
		peers: peers
	}));

	clients.push(this);
	console.log('New Client - ID: ' + data.id);


	connection.on('close', function () {
		var index = clients.indexOf(this);
		clients.splice(index, 1);

		broadcast(this, {
			sender: data.id,
			type: 'leave'
		});

		console.log('Client Disconnected: ' + data.name);
	}.bind(this));
};




module.exports = function (connection) {
	var client = new Client(connection);
	return client;
};