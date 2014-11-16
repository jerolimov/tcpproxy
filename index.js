#!/usr/bin/env node

var util = require('util'),
	program = require('commander'),
	colors = require('colors/safe'),
	SocketProxy = require('./lib/SocketProxy');

program
	.version('0.1.0')
	.option('-b, --bindAddress <host>',  'Local address where the proxy should be bind, default 127.0.0.1', '127.0.0.1')
	.option('-l, --bindPort <port>',  'Local port where the proxy should be bind, default 8080', 8080, parseInt)
	.option('-a, --originAddress <host>', 'Address of the origin server, required')
	.option('-p, --originPort <port>', 'Port of the origin server, default 80', 80, parseInt)
	.option('-d, --delayConnection <ms>', 'Delay in millisecond until the connection will be established to the origin server, default 1000ms', 1000, parseInt)
	.option('--bps, --delayBytesPerSecond <b/ms>', 'Delay bytes per millisecond (bytes/millisecond)')
	.option('--delayChunkFromClientToOrigin <ms>', 'Delay chunk from client to origin in millisecond', 0, parseInt)
	.option('--delayChunkFromOriginToClient <ms>', 'Delay chunk from origin to client in millisecond', 0, parseInt)
	.parse(process.argv);

if (!program.originAddress) {
	program.help();
}

var proxy = new SocketProxy(program);

proxy.on('open', function(bind, origin) {
	console.log(colors.bold('Bind socket:', util.format(bind)));
	console.log(colors.bold('Origin server:', util.format(origin)));
});

proxy.on('finishTransfer', function(transfer) {
	console.log(
		'Finish transfer!',
		'--', 'Time:', transfer.time, 'ms',
		'--', colors.green('Client:', transfer.clientData, 'bytes'),
		'--', colors.red('Server:', transfer.serverData, 'bytes'));
});

proxy.open();

process.on('SIGTERM', function() {
	console.log('Got SIGTERM. Will close server socket.');
	proxy.close(function() {
		console.log('Server socket closed!');
		console.log(arguments);
	});
});
