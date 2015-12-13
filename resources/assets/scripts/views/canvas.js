define('views/canvas', [
	'app',
	'backbone',
	'template'
], function (App, Backbone, Template) {
	var CanvasView = Backbone.View.extend({
		tagName: 'section',
		className: 'canvas',
		template: null,
		events: {
			'mousemove': 'mousemove',
			'mousedown': 'mousedown',
			'mouseup': 'mouseup',
		},
		initialize: function () {
			this.template = Template('Canvas');

			this.listen();
		},
		listen: function () {
			App.on('resize', function () {
				this.resize();
			}, this);

			this.el.addEventListener('touchmove', function (event) {
				var touches = event.changedTouches;

				if (touches.length === 1) {
					this.mousemove({
						pageX: touches[0].pageX,
						pageY: touches[0].pageY
					});
				}

			}.bind(this));
		},
		resize: function () {
			console.log('Resizing Canvas');
			var canvas = this.$el.children('canvas#canvas');

			canvas.attr('height', canvas.height());
			canvas.attr('width', canvas.width());
		},
		mousemove: function (event) {
			console.log('User Moving Mouse..');
			App.get('user').setCursorPosition(event.pageX, event.pageY);
		},
		mousedown: function (event) {
			console.log('User Mouse Down...');
			// App.user.set();
		},
		mouseup: function (event) {
			console.log('User Mouse Up...');
			// App.user.set();
		},
		render: function (opts) {
			var container = opts.container;
			
			this.$el.append(this.template.render());
			container.append(this.$el);
		}
	});

	return CanvasView;
});