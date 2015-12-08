define([
	'app',
	'backbone',
	'views/bar',
	'views/canvas',
	'views/peer'
], function (App, Backbone, BarView, CanvasView, PeerView) {
	var AppView = Backbone.View.extend({
		el: 'body',
		views: {
			peers: []
		},
		events: {
			'keypress': 'shortcut'
		},
		shortcut: function () {
		},
		initialize: function () {
			this.views.bar = new BarView();
			this.views.canvas = new CanvasView();

			this.listen();
		},
		listen: function () {
			App.peers.on('add', function (peer) {
				console.log('New Peer: #' + peer.get('id') + ' - ' + peer.get('name'));
				console.log(peer);
				
				this.renderPeer(peer);
			}, this);
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
		}
	});

	return AppView;
});