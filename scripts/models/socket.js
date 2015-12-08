define('models/socket', [
	'backbone',
	'underscore'
], function (Backbone, _) {
	var SocketModel = Backbone.Model.extend({
		defaults: {
			host: window.location.host,
			port: 80,
			path: '',
			secure: window.location.protocol === 'https'
		},
		socket: null,
		url: function () {
			return 'ws' + 
				(this.get('secure') === true ? 's' : '') + // If Secure connection
				'://' + this.get('host') +
				':' + this.get('port') + 
				'/' + this.get('path');
		},
		initialize: function () {
			// Register the Socket
			var socket = this.socket = new WebSocket(this.url());

			// Convert Native Socket Events to Model Events
			socket.addEventListener('open', function (event) {
				this.trigger('open', event);
			}.bind(this));

			socket.addEventListener('error', function (event) {
				this.trigger('error', event);
			}.bind(this));

			socket.addEventListener('message', function (event) {
				this.trigger('message', event);
			}.bind(this));

			socket.addEventListener('close', function (event) {
				this.trigger('close', event);
			}.bind(this));
		}
	});

	return SocketModel;
});