// SVG DOM: el círculo es un SVGCircleElement (extiende SVGElement -> Element -> Node)
const circulo = document.querySelector("circle");
const boton = document.getElementById("cambiar-color");

const colores = ["tomato", "green", "royalblue", "orange", "purple", "Yellow", "Black"];
let i = 0;

boton.addEventListener("click", () => {
    i = (i + 1) % colores.length;
    circulo.setAttribute("fill", colores[i]);
});
