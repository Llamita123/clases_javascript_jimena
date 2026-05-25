// querySelectorAll: devuelve una NodeList con todos los elementos coincidentes
const items = document.querySelectorAll(".item-lista");
const boton = document.getElementById("resaltar-todos");

var i=false;

boton.addEventListener("click", () => {
    if(i===false){
        console.log(items.length);
        items.forEach((item, idx) => {
        item.style.background = "#bbf7d0";
        item.textContent = `${idx + 1}. ${item.textContent}`;
        i = true;
    });
    }
    
});
