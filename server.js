var http = require('http');
 
http.createServer(function (request, response) {
	response.writeHead(200, {
		'Content-Type': 'text/plain',
		'Access-Control-Allow-Origin' : '*'
	});
	
}).listen(8124);