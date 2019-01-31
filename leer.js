var fs = require('fs' );
var input = "leer.js";
function cb(err, datos) {
if (err) throw err;
datos = datos.toUpperCase();
console.log(datos);
}
fs.readFile(input, 'utf8' , cb);
console.log( "Leyendo " + input);