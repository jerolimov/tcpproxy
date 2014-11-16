
var stream = require('stream'),
	util = require("util");

module.exports = function CountTransform(options) {
	if (!options) {
		options = {};
	}
	stream.Transform.call(this, options);

	var count = 0;

	this._transform = function(chunk, encoding, callback) {
		count += chunk.length;
		callback(null, chunk);
	};

	this._flush = function(callback) {
		callback();
	};

	this.getCount = function() {
		return count;
	};
};

util.inherits(module.exports, stream.Transform);
