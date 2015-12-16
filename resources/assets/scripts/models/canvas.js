define('models/canvas', [
	'backbone',
	'collections/elements'
], function (Backbone, ElementsCollection) {
	var CanvasModel = Backbone.Model.extend({
		defaults: {
			zoom: 100, // The zoom percentage
			size: 1024*3, // The size of the Shadow Canvas
			viewport_height: null, // Height on the page
			viewport_width: null, // width on the page
			viewport_position_x: null, // Position in the Page
			viewport_position_y: null, // POsition in the Page
			position_x: 0, // Source Position
			position_y: 0, // Source POsition
			panning: false // The panning State
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