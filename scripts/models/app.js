define('models/app', [
	'backbone',
	'underscore',
	'collections/sockets',
	'models/user',
	'collections/peers',
	'types'
], function (
	Backbone,
	_,
	SocketsCollection,
	UserModel,
	PeersCollection,
	Types
) {
	var AppModel = Backbone.Model.extend({
		defaults: {
			messaging: false, // If a messaging connection is established.
			user: null        // Main User Model
		},
		sockets: null,
		peers: null,
		initialize: function () {
			this.sockets = new SocketsCollection();
			this.peers = new PeersCollection();

			console.info('Main App Model Initialized');
		},
		init: function () {
			var msgSoc = this.sockets.add({
				id: 'msg',
				port: 8897
			});

			msgSoc.on('open', function () {
				console.info('Messaing socket Active');
				this.set('messaging', true);
			}, this);

			console.info('Listening for Initiation Message');

			// Only once, the Initiation message
			msgSoc.once('message', function (event) {
				console.info('Initiation Message Recieved');

				var data = event.data;

				// If its a JSON String
				if (_.isString(data) && data.substr(0, 1) === '{') {
					data = JSON.parse(data);

					var user = new UserModel({
						id: data.id,
						secret: data.secret,
						name: data.name
					}, {
						app: this
					});

					// Set the user to the User Model
					this.set('user', user);

					// Load Peers and their Current State
					for (var i in data.peers) {
						var peer = data.peers[i];

						this.peers.add({
							id: peer.id,
							name: peer.name,
							color: peer.color,
							cursor_x: peer.cursor.x,
							cursor_y: peer.cursor.y,
							weight:  peer.weight
						});
					}
				}

				console.info('Main Socket Inititiated');
				this.trigger('initiated');

				// Listen for future Messages
				this.listenForMessages();
			}, this);
		},
		listenForMessages: function () {
			console.info('Listening for Messages');

			var msgSoc = this.sockets.get('msg');

			msgSoc.on('message', function (event) {
				var data = event.data;

				console.info('Message Recieved: ' + data);

				if (!_.isString(data) || data.length < 4) {
					throw 'A String of atleast 4 characters was expected';
				}

				var sender = parseInt(data.substr(0, 2));
				var action = parseInt(data.substr(2, 2));
				var payload = data.substr(4);

				console.log('-- action: ' + action);

				switch (action) {
					case Types.JOIN:
						console.info('--- Join Message');
						this.handleJoin(sender, payload);
						break;

					case Types.NAME_SET:
						console.info('--- NameSet Message');
						this.handleNameSet(sender, payload);
						break;

					case Types.LEAVE:
						console.info('--- Leave Message');
						this.handleLeave(sender);
						break;

					case Types.CURSOR_POSITION:
						console.info('--- Cursor Position Message');
						this.handleCursorPosition(sender, payload);
						break;
				}
			}, this);
		},
		handleJoin: function (sender, payload) {
			this.peers.add({
				id: sender,
				name: payload
			});
		},
		handleNameSet: function (sender, payload) {
			this.peers.get(sender).set('name', payload);
		},
		handleLeave: function (sender) {
			this.peers.remove(sender);
		},
		handleCursorPosition: function (sender, payload) {
			var x = payload.substr(0, 4);
			var y = payload.substr(4, 4);

			this.peers.get(sender).setCursorPosition(x, y);
		}
	});

	return AppModel;
});