define('views/cursor', [
	'app',
	'backbone'
], function (App, Backbone) {
	var CursorView = Backbone.View.extend({
		tagName: 'div',
		className: 'cursor',
		user: null,
		weight: null,
		midpoint: null,
		x: 0,
		y: 0,
		offset: {
			x: 0,
			y: 0
		},
		initialize: function () {
			var user = this.user = App.get('user');
			this.weight = user.get('weight');
			this.midpoint = this.weight/2;

			this.listen();
		},
		listen: function () {
			this.user.on('change:cursor-position', function (data) {
				this.x = data.px;
				this.y = data.py;

				this.renderLocation();
			}, this);

			this.user.on('change:weight', function (user, weight) {
				this.weight = weight;
				this.renderWeight();
			}, this);

			// var canvas = App.get('canvas');
			// canvas.on('change:viewport_position_x', function (canvas, x) {
			// 	console.log(x);
			// 	this.offset.x = x;
			// }, this);

			// canvas.on('change:viewport_position_y', function (canvas, y) {
			// 	console.log(y);
			// 	this.offset.y = y;
			// }, this);
		},
		renderWeight: function () {
			this.midpoint = this.weight/2;
			this.$el.height(this.weight).width(this.weight);

			this.el.style.top = (this.y-this.midpoint) + 'px';
			this.el.style.left = (this.x-this.midpoint) + 'px';
		},
		renderLocation: function () {
			console.log(this.offset.x);
			this.el.style.top = (this.y-this.midpoint) + 'px';
			this.el.style.left = (this.x-this.midpoint) + 'px';
		},
		render: function (opts) {
			var container = opts.container;

			this.$el.addClass('pen').height(this.weight).width(this.weight);
			container.append(this.$el);
		}
	});

	return CursorView;
});