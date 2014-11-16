
var stream = require('stream'),
	util = require("util");

module.exports = function ThrottleTransform(options) {
	if (!options) {
		options = {};
	}
	stream.Transform.call(this, options);

	var self = this,
		bytes = options.bytes || 0,
		delayBytes = options.delayBytes || 0,
		delayChunk = options.delayChunk || 0,
		delayFlush = options.delayFlush || 0;

	this._transform = function(chunk, encoding, callback) {
		// Simple way
		if (bytes <= 0 || delayBytes <= 0) {
			setTimeout(function() {
				callback(null, chunk);
			}, delayChunk);
			return;
		}

		// Looping over "bytes per delayBytes"
		var start = 0;
		var loop = function() {
			if (start < chunk.length) {
				self.push(chunk.slice(start, start + bytes));
				start += bytes;
				setTimeout(loop, delayBytes);
			} else {
				callback();
			}
		};

		setTimeout(loop, delayChunk);
	};

	this._flush = function(callback) {
		setTimeout(function() {
			callback();
		}, delayFlush);
	};
};

util.inherits(module.exports, stream.Transform);
