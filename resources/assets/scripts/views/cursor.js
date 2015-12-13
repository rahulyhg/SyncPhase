define('views/cursor', [
	'app',
	'backbone'
], function (App, Backbone) {
	var CursorView = Backbone.View.extend({
		tagName: 'div',
		className: 'cursor',
		user: null,
		weight: 32,
		midpoint: 32/2,
		x: 0,
		y: 0,
		initialize: function () {
			this.user = App.get('user');

			this.listen();
		},
		listen: function () {
			this.user.on('change:cursor-position', function (data) {
				this.x = data.x;
				this.y = data.y;

				this.renderLocation();
			}, this);

			this.user.on('change:weight', function (user, weight) {
				this.weight = weight;
				this.renderWeight();
			}, this);
		},
		renderWeight: function () {
			this.midpoint = this.weight/2;
			this.$el.height(this.weight).width(this.weight);

			this.el.style.top = (this.y-this.midpoint) + 'px';
			this.el.style.left = (this.x-this.midpoint) + 'px';
		},
		renderLocation: function () {
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