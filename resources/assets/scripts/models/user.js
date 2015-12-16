define('models/user', [
	'backbone',
	'types',
	'utils/str_pad'
], function (Backbone, Types, str_pad) {
	var App = null;

	var UserModel = Backbone.Model.extend({
		defaults: {
			id: null,
			name: null,
			secret: null,
			cursor_x: 0,
			cursor_y: 0,
			weight: 10,
			page_x: 0,
			page_y: 0
		},
		msgSoc: null,
		initialize: function (attrs, opts) {
			App = opts.app;
			this.msgSoc = App.sockets.get('msg');

			var msg = new DataView(new ArrayBuffer(5));
			
			this.on('change:cursor-position', function (position) {
				msg.setUint8(0, Types.CURSOR);
				msg.setUint16(1, position.x);
				msg.setUint16(3, position.y);

				this.msgSoc.send(msg);
			}, this);
		},
		setCursorPosition: function (x, y, px, py) {
			this.set('cursor_x', Math.round(x));
			this.set('cursor_y', Math.round(y));

			this.set('page_x', px);
			this.set('page_y', py);

			this.trigger('change:cursor-position', {
				x: x,
				y: y,
				px: px,
				py: py
			});
		},
		getCursorPosition: function () {
			return {
				x: this.get('cursor_x'),
				y: this.get('cursor_y')
			};
		},
		increaseWeight: function () {
			var weight = this.get('weight');
			this.set('weight', weight+10);
		},
		decreaseWeight: function () {
			var weight = this.get('weight');
			this.set('weight', weight-10);
		}
	});

	return UserModel;
});