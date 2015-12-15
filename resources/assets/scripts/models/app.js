define('models/app', [
	'backbone',
	'underscore',
	'collections/sockets',
	'models/user',
	'collections/peers',
	'types',
	'models/canvas'
], function (
	Backbone,
	_,
	SocketsCollection,
	UserModel,
	PeersCollection,
	Types,
	CanvasModel
) {
	var AppModel = Backbone.Model.extend({
		defaults: {
			messaging: false, // If a messaging connection is established.
			user: null,       // Main User Model
			canvas: null      // Cnavas Model
		},
		sockets: null,
		peers: null,
		offsets: {
			cursor: {
				x: 0  +2,
				y: 2  +2
			}
		},
		initialize: function () {
			this.sockets = new SocketsCollection();
			this.peers = new PeersCollection();
			this.set('canvas', new CanvasModel());

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

			var user = new UserModel({}, {
				app: this
			});

			// Set the user to the User Model
			this.set('user', user);

			this.trigger('initiated');

			// Listen for future Messages
			console.info('Listening for Initiation Message');
			this.listenForMessages();
		},
		listenForMessages: function () {
			console.info('Listening for Messages');

			var msgSoc = this.sockets.get('msg');

			msgSoc.on('message', function (event) {
				var data = new DataView(event.data);

				var sender = data.getUint8(0);
				var action = data.getUint8(1);

				console.log('-- action: ' + action);

				switch (action) {
					case Types.JOIN:
						console.info('--- Join Message');
						this.handleJoin(sender);
						break;

					case Types.LEAVE:
						console.info('--- Leave Message');
						this.handleLeave(sender);
						break;

					case Types.CURSOR:
						console.info('--- Cursor Position Message');
						this.handleCursorPosition(sender, data);
						break;
				}
			}, this);
		},
		handleJoin: function (sender, payload) {
			this.peers.add({
				id: sender
			});
		},
		handleLeave: function (sender) {
			var peer = this.peers.remove(sender);
			peer.trigger('remove');
		},
		handleCursorPosition: function (sender, payload) {
			var x = payload.getUint16(this.offsets.cursor.x);
			var y = payload.getUint16(this.offsets.cursor.y);
			var peer = this.peers.get(sender);
			
			if (peer) {
				peer.setCursorPosition(x, y);
			}
		}
	});

	return AppModel;
});