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
			weight: 32
		},
		msgSoc: null,
		initialize: function (attrs, opts) {
			App = opts.app;
			this.msgSoc = App.sockets.get('msg');

			this.on('change:cursor-position', function (position) {
				var action = str_pad(Types.CURSOR_POSITION, 2, '0', 'STR_PAD_LEFT');
				var payload = '';
				payload += str_pad(position.x, 4, '0', 'STR_PAD_LEFT');
				payload += str_pad(position.y, 4, '0', 'STR_PAD_LEFT');

				var msg = action + payload;
				this.msgSoc.send(msg);
			}, this);
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
		},
		increaseWeight: function () {
			var weight = this.get('weight');
			this.set('weight', weight+(weight/2));
		},
		decreaseWeight: function () {
			var weight = this.get('weight');
			this.set('weight', weight-(weight/4));
		}
	});

	return UserModel;
});