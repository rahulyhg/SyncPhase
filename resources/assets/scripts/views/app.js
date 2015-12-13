define([
	'app',
	'backbone',
	'jquery',
	'views/bar',
	'views/canvas',
	'views/peer',
	'views/cursor'
], function (App, Backbone, jQuery, BarView, CanvasView, PeerView, CursorView) {
	var AppView = Backbone.View.extend({
		el: 'body',
		views: {
			peers: []
		},
		user: null,
		shortcut: function (key) {
			if (typeof this.shortcuts[key] !== 'undefined') {
				this.shortcuts[key].apply(this);
			}
		},
		shortcuts: {
			'[': function () {
				console.log('Reduce Weight');
				this.user.decreaseWeight();
			},
			']': function () {
				console.log('Increase Weight');
				this.user.increaseWeight();
			}
		},
		initialize: function () {
			this.user = App.get('user');

			this.views.bar = new BarView();
			this.views.canvas = new CanvasView();
			this.views.cursor = new CursorView();

			this.listen();
		},
		listen: function () {
			var self = this;

			App.peers.on('add', function (peer) {
				console.log('New Peer: #' + peer.get('id') + ' - ' + peer.get('name'));
				
				this.renderPeer(peer);
			}, this);

			App.peers.on('remove', function (peer) {
				console.log('Peer #' + peer.get('name') + ' Left.');
			});

			jQuery(window).resize(function () {
				console.info('Window Resized');
				App.trigger('resize');
			});

			var keys = {
				221: ']',
				219: '[',
			};

			this.$el.keydown(function (event) {
				this.shortcut(keys[event.which]);
			}.bind(this));
		},
		renderPeer: function (peerModel) {
			var peer = new PeerView({
				model: peerModel
			});

			this.views.peers.push(peer);

			peer.render({
				container: this.$el
			});
		},
		render: function () {
			var opts = {
				container: this.$el
			};

			this.views.bar.render(opts);
			this.views.canvas.render(opts);
			this.views.cursor.render(opts);
		}
	});

	return AppView;
});