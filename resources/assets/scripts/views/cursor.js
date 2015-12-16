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
		zoom: 100,
		initialize: function () {
			var user = this.user = App.get('user');
			this.weight = user.get('weight');
			this.midpoint = this.weight/2;

			this.listen();
		},
		listen: function () {
			this.user.on('change:page-position', function (data) {
				this.x = data.x;
				this.y = data.y;

				this.renderLocation();
			}, this);

			this.user.on('change:weight', function (user, weight) {
				this.weight = weight;
				this.renderWeight();
			}, this);

			this.user.on('change:panning', function (user, panning) {
				if (panning === true) {
					this.hide();
				} else {
					this.show();
				}
			}, this);

			var canvas = App.get('canvas');
			canvas.on('change:zoom', function (canvas, zoom) {
				this.zoom = zoom;

				this.renderWeight();
			}, this);
		},
		hide: function () {
			this.$el.hide();
		},
		show: function () {
			this.$el.show();
		},
		renderWeight: function () {
			var size = this.weight*(this.zoom/100);
			this.midpoint = size/2;
			this.$el.height(size).width(size);

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