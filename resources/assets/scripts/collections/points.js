define('collections/points', [
	'backbone',
	'models/point'
], function (Backbone, PointModel) {
	var PointsCollection = Backbone.Collection.extend({
		model: PointModel
	});

	return PointsCollection;
});