// querySelector: devuelve el PRIMER elemento que coincida con un selector CSS
const destacado = document.querySelector(".destacado");
const boton = document.querySelector("#resaltar");

boton.addEventListener("click", () => {
    destacado.style.transform = "scale(1.4)";
    destacado.style.transition = "transform 0.3s ease";
    destacado.style.background = "#fde047";
});
