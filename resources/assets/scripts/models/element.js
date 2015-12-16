define('models/element', [
	'backbone',
	'types',
	'collections/points'
], function (Backbone, Types, PointsCollection) {
	var ElementModel = Backbone.Model.extend({
		defaults: {
			type: Types.LINE
		},
		points: null,
		initialize: function () {
			this.points = new PointsCollection();
		},
		conclude: function () {
		}
	});

	return ElementModel;
});