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
    let contador = 0;

    lista.innerHTML="";

    carrito.forEach(p => {
        let li = document.createElement("li");
        li.innerHTML = `
    ${p.nombre} - $${p.precio} x ${p.cantidad}
    <button onclick="eliminarProducto('${p.nombre}')">❌</button>
`;
        lista.appendChild(li);

        total += p.precio * p.cantidad;
        contador += p.cantidad;
    });

    

    document.getElementById("total").textContent = "Total: $" + total;
    document.getElementById("contador").textContent = contador;
}

// AUTH0 

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
        document.getElementById("welcome").textContent = `"No compres mañana lo que puedes comprar hoy."`;
        document.getElementById("welcomeBanner").textContent = `Bienvenido ${user.name}, disfruta tu compra`;

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

document.getElementById("formPago").addEventListener("submit", async function(e){
    e.preventDefault();

// código que valida login, para que no compren sin estar logueados
const isAuthenticated = await auth0Client.isAuthenticated();

if (!isAuthenticated){
    await auth0Client.loginWithRedirect(); // redirigir al login
    return;
}

    let correo = document.getElementById("correo").value;
    let telefono = document.getElementById("telefono").value;

    if (!/^\d{8,12}$/.test(telefono)) {
    alert("Teléfono inválido (solo números, 8 a 12 dígitos)");
    return;
}
if (carrito.length === 0) {
    alert("El carrito está vacío");
    return; }

let totalCompra= 0;
carrito.forEach(p => {
    totalCompra += p.precio *p.cantidad;
});


    document.querySelector(".modal-contenido p").textContent = `Gracias por tu compra. Total pagado: $${totalCompra}`;

    document.getElementById("modalCompra").style.display = "flex";

sessionStorage.removeItem("carrito");
carrito = [];
mostrarCarrito();
document.getElementById("formPago").reset();

});

function cerrarModal(){
    document.getElementById("modalCompra").style.display = "none";
    
}


function toggleCarrito(){
    let carritoDiv = document.getElementById("carritoDesplegable");
    if (carritoDiv.style.display === "none"){
        carritoDiv.style.display ="block";
    } else {
        carritoDiv.style.display ="none";
    }
}

function eliminarProducto(nombre) {
    let producto = carrito.find(p => p.nombre === nombre);

    if (producto.cantidad > 1) {
        producto.cantidad--;
    } else {
        carrito = carrito.filter(p => p.nombre !== nombre);
    }

    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

function irAPago() {
    document.querySelector(".formulario").scrollIntoView({
        behavior: "smooth"
    });
}

