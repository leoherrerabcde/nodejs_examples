'use strict';

let http= require('http'),
    url = require('url'),
    qs  = require('querystring');

let Pedido = require('./pedido.js');
let pedido = new Pedido;

pedido.insertaProducto(23,"Botella",3);

http.createServer(procesa).listen(3000);
console.log("Servidor arrancado en puerto 3000");

pedido.insertaProducto(22,"Jaba",4);

function procesa(req,resp) {
	var urlparsed = url.parse(req.url,true);
	var id = urlparsed.query['id'];
	var potito = urlparsed.query['potito'];
	
	console.log(req.method);
	switch (req.method) {
		case 'GET': 
			if (id) listarProducto(id,req,resp);
		    else
				if (potito) 
				{
					console.log("LLego Potito");
					listarProducto(potito,req,resp);
				}
				else
					showProductos(req,resp);
			break;
		case 'DELETE':
			if (id) borrarProducto(id,req,resp);
			else notAllowed("Intento de borrar todos los productos",resp);
			break;
		case 'POST':
			if (id) notAllowed("No se puede hacer POST sobre un producto concreto",resp);
			else parseBody(req,resp,crearProducto); 
			break;
		case 'PUT':
			if (id) {
			 parseBody(req,resp,function (post) {
				modificarProducto(post,id,req,resp);
			 });
			} else 
				notAllowed("Intento de modificar todos los productos",resp);
			break;
		};
}

function isEmpty(query) {
	return Object.keys(query) == 0 ;
}

function listarProducto(id,req,resp) {
	console.log("Obteniendo producto = " + id);
	let p = pedido.getProducto(id);
	if (p) {
		resp.write(JSON.stringify(p));
	    resp.end();
	} else {
		notAllowed("No existe producto " + id,resp);
	}
}

function showProductos(req,resp) {
	var accept = req.headers["accept"];
	console.log("Accept = " + accept);
	if (accept == "application/json") {
	  resp.setHeader('content-type','text/html'); 
	  resp.end(pedido.toJson())
	} else 
	if (accept == "application/xml") {
      resp.setHeader('content-type','application/xml');
	  resp.end(pedido.toXML());
	} else 
	if (accept == "text/turtle") {
      resp.setHeader('content-type','text/turtle');
	  resp.end(pedido.toRDF());
	} else {
	  resp.setHeader('content-type','text/html');
	  resp.end(formulario() + pedido.toHTML());
	}
}

function formulario() {
	return '<form action="http://localhost:3000" method="POST">' +
	       '<input name="codigo" placeholder="codigo" />' +
		   '<input name="nombre" placeholder="nombre" />' +
		   '<input name="cantidad" placeholder="cantidad" />' +
		   '<input type="submit" value="enviar">'
	       '</form>';
}

function borrarProducto(id,req,resp) {
	console.log("Borrando producto " + id);
	pedido.borraProducto(id);
	showProductos(req,resp);
}

function crearProducto(post,req,resp) {
    let codigo = post.codigo ;
	if (!codigo) 
		notAllowed("No se puede crear un producto sin codigo", resp);
	else {
	 let nombre = post.nombre;
     let cantidad = post.cantidad;	 
	 console.log("Creando producto " + codigo + ": " + 
	    nombre + ", " + cantidad);
     pedido.insertaProducto(codigo, nombre, cantidad);
	 showProductos(req,resp);
	}
}

function modificarProducto(post,id,req,resp) {
	var producto = { "nombre" : post.nombre, "cantidad": post.cantidad } ;
	pedido.modificaProducto(id,producto);
	showProductos(req,resp);
}

function notAllowed(msg, resp) {
	resp.statusCode = 405;
	resp.write(msg);
	resp.end();
}

function parseBody(req, resp, next) {
	var body = '';
    req.on('data', function (data) {
        body += data;
        if (body.length > 1e6) {
        	console.log("Body too big!");
            req.connection.destroy();
        }
    });
    req.on('end', function () {
        var post = qs.parse(body);
		console.log("Body: " + body);
		console.log(post);
        next(post,req,resp);
    });
}