define('models/canvas', [
	'backbone'
], function (Backbone) {
	var CanvasModel = Backbone.Model.extend({
		defaults: {
			zoom: 100,
			size: 1024*3,
			viewport_height: null,
			viewport_width: null,
			position_x: 0,
			position_y: 0
		}
	});

	return CanvasModel;
});