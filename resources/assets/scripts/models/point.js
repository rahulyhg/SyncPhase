define('models/point', [
	'backbone'
], function (Backbone) {
	var PointModel = Backbone.Model.extend({
		defualts: {
			x: 0,
			y: 0
		}
	});

	return PointModel;
});