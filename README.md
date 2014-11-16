# TCPproxy which could simple throttle TCP connections

	npm install -g tcpproxy

The default command will delay each TCP connection one second and redirect port 8080 to 80:

	tcpproxy -a www.google.com

You can throttle the connection with many other options, for example with 10 bytes per 100 milliseconds:

	tcpproxy -a www.google.com --bps 10/100

Other options:

	-b, --bindAddress <value>            Local address where the proxy should be bind, default 127.0.0.1
	-l, --bindPort <n>                   Local port where the proxy should be bind, default 8080
	-a, --originAddress <value>          Address of the origin server, required
	-p, --originPort <n>                 Port of the origin server, default 80
	-d, --delayConnection <n>            Delay in millisecond until the connection will be established to the origin server, default 1000ms
	--bps, --delayBytesPerSecond <b/ms>  Delay bytes per millisecond (bytes/millisecond)
	--delayChunkFromClientToOrigin <n>   Delay chunk from client to origin in millisecond
	--delayChunkFromOriginToClient <n>   Delay chunk from origin to client in millisecond
