var http = require('http' );
var procesa = function (req, res) {
res.writeHead(200, {'Content-Type' : 'text/plain' });
res.end('<h1> Hola desde MTI 2016::LHerrera\n</h1>' );
}
var server = http.createServer()
server.on('request' , procesa);
server.listen(3000);
console.log(' Servidor arrancado' );