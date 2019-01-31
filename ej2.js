let marcela = { 
  "nombre": "Marcela", 
  "edad": 25 } ;

console.log(marcela);
console.log("Edad de marcela " + marcela.edad);
console.log("El año que viene tendrá " + (marcela["edad"] + 1));

/*function suma3(x){
	return x + 3;
}
*/

let suma3=function(x) {return x+3;}
let reaplica = function(f,x) {return f(f(x));}

console.log(suma3(2));
console.log(suma3("Hola"));
console.log(reaplica(suma3,2));
console.log(reaplica(suma3,"Hola"));

console.log(reaplica((x)=>{return x*3;},2));

setTimeout(function () { console.log("Mil"); }, 1000);
setTimeout(function () { console.log("Doscientos"); }, 200);