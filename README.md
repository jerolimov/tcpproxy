## TCPproxy: Throttle your TCP connections now!

	$ npm install -g tcpproxy

The default command will delay each TCP connection one second and redirect port 8080 to 80:

	$ tcpproxy -a www.google.com
	
	Finish transfer! -- Time: 150 ms -- Client: 76 bytes -- Server: 18352 bytes
	Finish transfer! -- Time: 160 ms -- Client: 76 bytes -- Server: 18310 bytes

You can throttle the connection with many other options, for example with 10 bytes per 100 milliseconds:

	$ tcpproxy -a www.google.com --bps 10/100

Other options:

	-b, --bindAddress <host>             Local address where the proxy should be bind,
	                                     default 127.0.0.1
	-l, --bindPort <port>                Local port where the proxy should be bind,
	                                     default 8080
	-a, --originAddress <host>           Address of the origin server, required
	-p, --originPort <port>              Port of the origin server, default 80
	-d, --delayConnection <ms>           Delay in millisecond until the connection will
	                                     be established to the origin server,
	                                     default 1000ms
	--bps, --delayBytesPerSecond <b/ms>  Delay bytes per millisecond (bytes/millisecond)
	--delayChunkFromClientToOrigin <ms>  Delay chunk from client to origin in millisecond
	--delayChunkFromOriginToClient <ms>  Delay chunk from origin to client in millisecond
