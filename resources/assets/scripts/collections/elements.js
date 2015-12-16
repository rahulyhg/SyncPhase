define('collections/elements', [
	'backbone',
	'models/element'
], function (Backbone, ElementModel) {
	var ElementsCollection = Backbone.Collection.extend({
		model: ElementModel
	});

	return ElementsCollection;
});