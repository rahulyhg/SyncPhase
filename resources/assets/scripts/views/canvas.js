define('views/canvas', [
	'app',
	'backbone',
	'template',
	'jquery'
], function (App, Backbone, Template, jQuery) {
	var CanvasView = Backbone.View.extend({
		tagName: 'section',
		className: 'canvas',
		template: null,
		shadow: {
			el: null,
			context: null
		},
		events: {
			'mousemove': 'mousemove',
			'mousedown': 'mousedown',
			'mouseup': 'mouseup',
		},
		initialize: function () {
			var shadow = jQuery(document.createElement('canvas'));

			var size = this.model.get('size');
			shadow.attr('width', size);
			shadow.attr('height', size);

			$('body').append(shadow);

			this.shadow.el = shadow[0];
			this.shadow.context = shadow[0].getContext('2d');

			this.template = Template('Canvas');
			this.listen();
		},
		listen: function () {
			App.on('resize', function () {
				this.resize();
				this.renderViewport();
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
			var height = canvas.height();
			var width = canvas.width();

			this.model.set('viewport_height', height);
			this.model.set('viewport_width', width);

			canvas.attr('height', height);
			canvas.attr('width', width);
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
		renderGrid: function () {
			var size = this.model.get('size');
			var lines = size/10;
			var ctx = this.shadow.context;
			var spacing = 20;

			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#eee';

			for (var i = 0; i < lines; i++) {
				var offset = i*spacing+spacing;
				console.log(offset);

				ctx.moveTo(offset, 0);
				ctx.lineTo(offset, size);

				ctx.moveTo(0, offset);
				ctx.lineTo(size, offset);
			}

			ctx.stroke();
		},
		renderViewport: function () {
			var src = this.shadow.el;
			var ctx = this.$el.find('canvas#canvas')[0].getContext('2d');

			ctx.drawImage(
				src,
				this.model.get('position_x'),
				this.model.get('position_y'),
				this.model.get('viewport_width'),
				this.model.get('viewport_height'),
				0,
				0,
				this.model.get('viewport_width'),
				this.model.get('viewport_height')
			);
		},
		render: function (opts) {
			var container = opts.container;
			
			this.$el.append(this.template.render());
			container.append(this.$el);

			this.resize();
			this.renderGrid();
			this.renderViewport();
		}
	});

	return CanvasView;
});