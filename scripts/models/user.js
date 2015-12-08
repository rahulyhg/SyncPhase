define('models/user', [
	'backbone'
], function (Backbone) {
	var UserModel = Backbone.Model.extend({
		defaults: {
			id: null,
			name: null,
			secret: null
		}
	});

	return UserModel;
});