define('views/canvas', [
	'backbone',
	'template'
], function (Backbone, Template) {
	var CanvasView = Backbone.View.extend({
		tagName: 'section',
		className: 'canvas',
		template: null,
		initialize: function () {
			this.template = Template('Canvas');
		},
		render: function (opts) {
			var container = opts.container;
			
			this.$el.append(this.template.render());
			container.append(this.$el);
		}
	});

	return CanvasView;
});