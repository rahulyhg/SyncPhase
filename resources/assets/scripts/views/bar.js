define('views/bar', [
	'backbone',
	'template'
], function (Backbone, Template) {
	var BarView = Backbone.View.extend({
		tagName: 'nav',
		className: 'control-bar',
		template: null,
		initialize: function () {
			this.template = Template('ControlBar');
		},
		render: function (opts) {
			var container = opts.container;

			this.$el.append(this.template.render());
			container.append(this.$el);
		}
	});

	return BarView;
});