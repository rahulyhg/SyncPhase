define('views/canvas', [
	'app',
	'backbone',
	'template',
	'jquery',
	'types'
], function (App, Backbone, Template, jQuery, Types) {
	var CanvasView = Backbone.View.extend({
		tagName: 'section',
		className: 'canvas',
		user: null,
		template: null,
		current_element: null,
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
			this.user = App.get('user');

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

			this.model.on('change:zoom', this.renderViewport, this);

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
		listenStroke: function () {
			console.log('Listening for Stroke Actions');

			this.user.on('change:cursor-position', this.strokePoint, this);
			this.current_element.points.on('add', this.renderStroke, this);
		},
		unlistenStroke: function () {
			console.log('Not Listening for Stroke Actions');

			this.user.off('change:cursor-position', this.strokePoint);
			this.current_element.points.off('add', this.renderStroke, this);
		},
		strokePoint: function (pos) {
			console.log('New Stroke Point.');

			this.current_element.points.add({
				x: pos.x,
				y: pos.y
			});
		},
		resize: function () {
			console.log('Resizing Canvas');
			var canvas = this.$el.children('canvas#canvas');
			var height = canvas.height();
			var width = canvas.width();
			var offset = canvas.offset();

			this.model.set('viewport_height', height);
			this.model.set('viewport_width', width);

			this.model.set('viewport_position_x', offset.left);
			this.model.set('viewport_position_y', offset.top);

			canvas.attr('height', height);
			canvas.attr('width', width);
		},
		mousemove: function (event) {
			console.log('User Moving Mouse..');
			var x = this.model.get('viewport_position_x');
			var y = this.model.get('viewport_position_y');

			App.get('user').setCursorPosition(event.pageX-x, event.pageY-y);
		},
		mousedown: function (event) {
			console.log('User Mouse Down...');

			var element = this.model.elements.add({
				type: Types.LINE
			});

			this.current_element = element;
			this.listenStroke();

			this.strokePoint({
				x: this.user.get('cursor_x'),
				y: this.user.get('cursor_y'),
			});
		},
		mouseup: function (event) {
			console.log('User Mouse Up...');

			this.unlistenStroke();
			this.current_element.conclude();
			this.current_element = null;
		},
		renderStroke: function (point, points) {
			console.log('Rendering stroke.');

			var radius = this.user.get('weight');
			var a = this.current_element.points.at(this.current_element.points.length-2);
			var b = this.current_element.points.at(this.current_element.points.length-1);

			var ctx = this.shadow.context;
			ctx.save();
			ctx.beginPath();

			if (points.length > 1) {
				ctx.strokeStyle = 'red';
				ctx.lineJoin = 'round';
				ctx.lineWidth = radius;

				ctx.moveTo(a.get('x'), a.get('y'));
				ctx.lineTo(b.get('x'), b.get('y'));

				ctx.closePath();
				ctx.stroke();

			} else {
				ctx.fillStyle = 'red';
				ctx.arc(b.get('x'), b.get('y'), radius/2, 0, Math.PI*2, false);

				ctx.closePath();
				ctx.fill();
			}

			ctx.restore();

			this.renderViewport();
		},
		renderGrid: function () {
			var size = this.model.get('size');
			var lines = size/10;
			var ctx = this.shadow.context;
			var spacing = 20;

			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, size, size);

			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#eee';

			for (var i = 0; i < lines; i++) {
				var offset = i*spacing+spacing;

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
			var zoom_ratio = 100/this.model.get('zoom');

			ctx.drawImage(
				src,
				this.model.get('position_x'), // src 
				this.model.get('position_y'), // src
				this.model.get('viewport_width')*zoom_ratio, // src
				this.model.get('viewport_height')*zoom_ratio, // src
				0, // dst
				0, // dst
				this.model.get('viewport_width'), // dst
				this.model.get('viewport_height') // dst
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