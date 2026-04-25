let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];


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

// AUTH0 

const auth0Config = {
    domain:"s4ijem-san.us.auth0.com",
    client_id: "KBjaRatVNvfeTdZo9PewPOYdvv1U5mhn"
};

let auth0Client = null;

window.addEventListener("load",async() =>{
    auth0Client = await createAuth0Client({
        domain: "s4ijem-san.us.auth0.com",
        client_id: "KBjaRatVNvfeTdZo9PewPOYdvv1U5mhn",
        redirect_uri: "http://127.0.0.1:5500"
        
    });

if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
        try {
            await auth0Client.handleRedirectCallback();
        } catch (e) {
            console.error("Error en callback:", e);
        }
        // Limpia la URL sin recargar la página
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
        const user = await auth0Client.getUser();
        document.getElementById("welcome").textContent = `Bienvenido ${user.name}, un gusto tenerte por aquí, recuerda ejercitarte siempre.`;
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("logoutBtn").style.display = "inline";
    } else {
        document.getElementById("loginBtn").style.display = "inline";
        document.getElementById("logoutBtn").style.display = "none";
    }

    document.getElementById("loginBtn").addEventListener("click", async () => {
        await auth0Client.loginWithRedirect();
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
        sessionStorage.clear();
        auth0Client.logout({
            returnTo: "http://127.0.0.1:5500"
        });
    });

    mostrarCarrito();    
    
});

// Formulario

document.getElementById("formPago").addEventListener("submit", function(e){
    e.preventDefault();

    let correo = document.getElementById("correo").value;
    let telefono = document.getElementById("telefono").value;

    if (!/^\d{8,12}$/.test(telefono)) {
    alert("Teléfono inválido (solo números, 8 a 12 dígitos)");
    return;
}

    alert("Muchas gracias por tu compra <3");

    sessionStorage.clear();
    location.reload();

});