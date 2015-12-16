define('models/canvas', [
	'backbone',
	'collections/elements'
], function (Backbone, ElementsCollection) {
	var CanvasModel = Backbone.Model.extend({
		defaults: {
			zoom: 100,
			size: 1024*3,
			viewport_height: null,
			viewport_width: null,
			viewport_position_x: null,
			viewport_position_y: null,
			position_x: 0,
			position_y: 0
		},
		elements: null,
		initialize: function () {
			this.elements = new ElementsCollection();
		},
		zoomIn: function () {
			var zoom = this.get('zoom');
			this.set('zoom', zoom+20);
		},
		zoomOut: function () {
			var zoom = this.get('zoom');
			this.set('zoom', zoom-20);
		}
	});

	return CanvasModel;
});