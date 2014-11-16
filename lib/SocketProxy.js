
var events = require('events'),
	net = require('net'),
	util = require("util"),
	CountTransform = require('./CountTransform'),
	ThrottleTransform = require('./ThrottleTransform');

module.exports = function SocketProxy(options) {
	if (!options) {
		options = {};
	}
	events.EventEmitter.call(this);

	var eventEmitter = this,
		bindAddress = options.bindAddress,
		bindPort = options.bindPort,
		originAddress = options.originAddress,
		originPort = options.originPort,
		bytes = 0,
		delayBytes = 0,
		delayChunk = options.delayChunkFromClientToOrigin;

	if (options.delayBytesPerSecond && options.delayBytesPerSecond.indexOf('/') !== -1) {
		bytes = parseInt(options.delayBytesPerSecond.substring(0, options.delayBytesPerSecond.indexOf('/')));
		delayBytes = parseInt(options.delayBytesPerSecond.substring(options.delayBytesPerSecond.indexOf('/') + 1));
	}	

	var server = net.createServer(function(clientConnection) {

		eventEmitter.emit('clientConnected', clientConnection);

		clientConnection.once('close', function() {
			eventEmitter.emit('clientDisconnected', clientConnection);
		});

		setTimeout(function() {
			var originConnection = new net.Socket(),
				clientToOriginCountTransform = new CountTransform(),
				originToClientCountTransform = new CountTransform(),
				clientToOriginThrottleTransform = new ThrottleTransform({
					bytes: bytes,
					delayBytes: delayBytes,
					delayChunk: delayChunk
				}, originConnection),
				originToClientThrottleTransform = new ThrottleTransform({
					bytes: bytes,
					delayBytes: delayBytes,
					delayChunk: delayChunk
				}, clientConnection),
				opened = false,
				closed = false,
				startTime = new Date().getTime();

			originConnection.connect(originPort, originAddress, function() {
				opened = true;
				clientConnection.pipe(clientToOriginCountTransform).pipe(clientToOriginThrottleTransform).pipe(originConnection);
				originConnection.pipe(originToClientCountTransform).pipe(originToClientThrottleTransform).pipe(clientConnection);
			});

			var closeHandler = function() {
				if (opened && !closed) {
					closed = true;
					var endTime = new Date().getTime();
					eventEmitter.emit('finishTransfer', {
						time: endTime - startTime,
						clientData: clientToOriginCountTransform.getCount(),
						serverData: originToClientCountTransform.getCount()
					});
					clientConnection.end();
				}
			}

			originConnection.once('close', closeHandler);
			clientConnection.once('close', closeHandler);

		}, options.delayConnection);
	});

	this.address = function() {
		return server.address();
	};

	this.open = function(callback) {
		server.listen(bindPort, bindAddress, function() {
			if (callback) callback.apply(null, arguments);
			eventEmitter.emit('open', server.address(), { address: originAddress, port: originPort });
		});
	};

	this.close = function(callback) {
		server.close(function() {
			if (callback) callback.apply(null, arguments);
			eventEmitter.emit('close');
		});
	};
};

util.inherits(module.exports, events.EventEmitter);
