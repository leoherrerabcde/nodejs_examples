'use strict';

class Pedido {
  constructor() {
    this.productos = {};
  }

  getProducto(id) {
    if (id in this.productos) 
	 return this.productos[id];
    else {
  	 console.log("No existe producto " + id);
	 return null;
	}
  }

  insertaProducto(id,nombre, cantidad) {
    this.productos[id] = {
      "nombre": nombre,
      "cantidad": cantidad
    }
  }

  borraProducto(id) {
    if (this.productos[id]) {
		delete this.productos[id];
	} else {
		console.log("No existe el producto de id " + id);
	}
  }
  
  modificaProducto(id, producto) {
    if (this.productos[id]) {
		this.productos[id] = producto;
	} else {
		console.log("No existe el producto de id " + id);
	}
  }
  
  toHTML() {
	let str = 
	    '<ul>' + 
		Object.keys(this.productos).map((id) => {
            var p = this.productos[id];  
            return '<li>' + 
			  id + ": " + 
			  p.nombre + ' ' + 
			  p.cantidad + '</li>';
         }).join('') + 
		 '</ul>' ;
	return str;	 
  }
  
  toText() {
    return Object.keys(this.productos).map((id) => {
     let p = this.productos[id];
	 return ' - ' + id + ' ' + p.nombre + ' ' + p.cantidad + '\n';
    }).join('');	
  }
  
   toJson() {
	return JSON.stringify(this.productos);
   }
  
   toXML() {
    return '<pedido>\n' + 
	  Object.keys(this.productos).map((id) => {
       var p = this.productos[id];
	   return '<producto codigo=\"' + id + '\"><nombre>' + 
	     p.nombre + '</nombre><cantidad>' + 
		 p.cantidad + '</cantidad></producto>\n';
     }).join('') + '</pedido>';	
   }   
   
   toRDF() {
    let str = 
	   '@prefix : <http://example.org/> .\n' +
	   '@prefix schema: <http://schema.org/> .\n' +
	  Object.keys(this.productos).map((id) => {
       var p = this.productos[id];
	   return ':' + id + ' a schema:Product; \n' +
              ' schema:name \"' + p.nombre + '\";\n' + 
              ' :cantidad ' + p.cantidad + '.\n' ;
     }).join('');	
	 return str;
   }   
}

module.exports = Pedido;

let p = new Pedido;
p.insertaProducto(23,"grapadora",34);
p.insertaProducto(56,"libro",3);
p.insertaProducto(45,"casa",2);
console.log(p.toJson());
console.log(p.toText());
console.log(p.toXML());
console.log(p.toHTML());
p.borraProducto(56);
console.log(p.toText());
p.borraProducto(56);
console.log(p.toText());
console.log("Producto 45 = " + 
 JSON.stringify(p.getProducto(45))
 );
p.modificaProducto(23,{ "nombre": "blah","cantidad": 24} );
console.log(p.toText());

