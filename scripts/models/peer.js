define('models/peer', [
	'backbone'
], function (Backbone) {
	var PeerModel = Backbone.Model.extend({
		defaults: {
			id: null,
			name: null,
			cursor_x: 0,
			cursor_y: 0,
			color: '000000',
			weight: 32
		},
		setCursorPosition: function (x, y) {
			this.set('cursor_x', x);
			this.set('cursor_y', y);

			this.trigger('change:cursor-position', {
				x: x,
				y: y
			});
		},
		getCursorPosition: function () {
			return {
				x: this.get('cursor_x'),
				y: this.get('cursor_y')
			};
		}
	});

	return PeerModel;
});