let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

mostrarCarrito();

function agregarCarrito(nombre,precio) {

    let producto = carrito.find(p => p.nombre === nombre);

    if (producto) {
        producto.cantidad++;
    } else {
        carrito.push({ nombre, precio , cantidad: 1})
    }

    sessionStorage.setItem("carrito", JSON.stringify (carrito));
    mostrarCarrito();
}

function mostrarCarrito() {
    let lista = document.getElementById("listaCarrito");
    let total = 0;

    lista.innerHTML="";

    carrito.forEach(p => {
        let li = document.createElement("li");
        li.textContent = `${p.nombre} - $${p.precio} x ${p.cantidad}`;
        lista.appendChild(li);

        total += p.precio * p.cantidad;
    });

    document.getElementById("total").textContent = "Total: $" + total;
}

const auth0Config = {
    domain:s4ijem-san.us.auth0.com
    clientId:KBjaRatVNvfeTdZo9PewPOYdvv1U5mhn
}