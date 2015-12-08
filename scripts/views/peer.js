define('views/peer', [
	'backbone'
], function (Backbone) {
	var PeerView = Backbone.View.extend({
		tagName: 'div',
		className: 'peer-cursor',
		name: null,
		initialize: function () {
			this.listen();
		},
		listen: function () {
			this.model.on('change:name', function (peer, name) {
				console.info('Peer#'.peer.get('id') + ' changed name from "' + peer.previous('name') + '" to "' + name + '"');
			}, this);
		},
		render: function (opts) {
			var container = opts.container;
			container.append(this.$el);
		}
	});

	return PeerView;
});