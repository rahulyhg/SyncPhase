define('collections/sockets', [
	'backbone',
	'models/socket'
], function (Backbone, SocketModel) {
	var SocketsCollection = Backbone.Collection.extend({
		model: SocketModel
	});

	return SocketsCollection;
});