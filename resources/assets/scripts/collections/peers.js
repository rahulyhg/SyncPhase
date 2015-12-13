define('collections/peers', [
	'backbone',
	'models/peer'
], function (Backbone, PeerModel) {
	var PeersCollection = Backbone.Collection.extend({
		model: PeerModel
	});

	return PeersCollection;
});