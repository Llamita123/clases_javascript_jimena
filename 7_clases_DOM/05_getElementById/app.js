// getElementById: selecciona un único elemento por su atributo id
const contenedor = document.getElementById("contenedor-info");
const boton = document.getElementById("actualizar");

let estado = true;

boton.addEventListener("click", () => {
    
    contenedor.innerHTML = `
        <h2>¡Contenedor actualizado!</h2>
        <p>El método getElementById nos devolvió el elemento exacto por su id único.</p>
        <p>Los aprendices de la 502 son indecisos</p>
        <hr>
    `;
    contenedor.style.borderColor = "#16a34a";
    contenedor.style.boxShadow = "10px 10px 10px purple";
    if(estado){
        contenedor.style.transform = "rotate(45deg)";
        contenedor.style.transition = "all 0.3s ease"
        estado = false;
    }else{
        contenedor.style.transform = "rotate(0deg)";
        contenedor.style.transition = "all 0.3s ease"
        estado = true;
    }
});
