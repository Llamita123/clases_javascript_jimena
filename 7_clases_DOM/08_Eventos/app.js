// Eventos: target + trigger + handler
const boton = document.getElementById("enviar");
const resultados = document.getElementById("resultados");

let contador = 0;

boton.addEventListener("click", (event) => {
    contador++;
    resultados.textContent = `Clic #${contador} en (${event.clientX}, ${event.clientY})`;
});

window.addEventListener("click", (event) => {
    alert(`Clic en pantalla en (${event.clientX}, ${event.clientY}): `);
});
