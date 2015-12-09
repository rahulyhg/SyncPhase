define('views/peer', [
	'backbone'
], function (Backbone) {
	var PeerView = Backbone.View.extend({
		tagName: 'div',
		className: 'peer-cursor',
		name: null,
		x: 0,
		y: 0,
		initialize: function () {
			this.listen();
		},
		listen: function () {
			this.model.on('change:name', function (peer, name) {
				console.info('Peer#'.peer.get('id') + ' changed name from "' + peer.previous('name') + '" to "' + name + '"');
			}, this);

			this.model.on('change:cursor-position', function (data) {
				this.x = data.x;
				this.y = data.y;

				this.renderLocation();
			}, this);
		},
		renderLocation: function () {
			this.el.style.top = (this.y) + 'px';
			this.el.style.left = (this.x) + 'px';
		},
		render: function (opts) {
			var container = opts.container;
			container.append(this.$el);
		}
	});

	return PeerView;
});