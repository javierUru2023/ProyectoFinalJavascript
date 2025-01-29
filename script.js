// Función para obtener la cotización del dólar a UYU
function fetchExchangeRate() {
    const apiKey = '5f94cecde3524e4499f7161ecc5e6b11'; // Reemplaza con tu clave de API de Open Exchange Rates
    const url = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&symbols=UYU&base=USD`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            }
            return response.json(); // Intentamos convertir la respuesta en JSON
        })
        .then(data => {
            if (data && data.rates && data.rates.UYU) {
                const exchangeRate = data.rates.UYU;
                document.getElementById('exchange-rate').innerText = `Dólar: $${exchangeRate}`;
            } else {
                document.getElementById('exchange-rate').innerText = 'Tasa de cambio no disponible';
            }
        })
        .catch(error => {
            console.error('Error al obtener la cotización:', error);
            document.getElementById('exchange-rate').innerText = 'Error al cargar la cotización';
        });
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    fetchExchangeRate(); // Llamada inicial para obtener la cotización
    setInterval(fetchExchangeRate, 60000); // Actualiza la cotización cada 60 segundos
});

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let productos = {}; // Para almacenar los productos cargados desde JSON

// Cargar productos desde el archivo JSON
function loadProducts() {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            productos = data; // Asignamos los productos cargados
            filterByCategory('notebooks'); // Mostrar productos de la primera categoría por defecto
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}

// Mostrar los productos por categoría
function displayProducts(category) {
    const productContainer = document.getElementById('products');
    // Limpiar productos previos
    productContainer.innerHTML = '';
    
    if (productos[category]) {
        productos[category].forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
                <img src="${product.imagen}" alt="${product.modelo}">
                <h3>${product.marca} ${product.modelo}</h3>
                <p>$${product.precio}</p>
                <button class="btn btn-primary" onclick="addToCart(${product.id}, '${category}')">Añadir al carrito</button>
            `;

            productContainer.appendChild(productCard);
        });
    }
}

// Filtrar productos por categoría
function filterByCategory(category) {
    displayProducts(category);
}

// Añadir un producto al carrito
function addToCart(productId, category) {
    const product = productos[category].find(p => p.id === productId);
    cart.push(product);
    updateCart();
    saveCart(); // Guardar el carrito en localStorage

    // Mostrar una alerta de éxito con SweetAlert2
    Swal.fire({
        icon: 'success',
        title: 'Producto añadido',
        text: `${product.marca} ${product.modelo} ha sido añadido al carrito.`,
        showConfirmButton: false,
        timer: 2000,  // Se cerrará automáticamente en 2 segundos
    });
}

// Eliminar un producto del carrito
function removeFromCart(index) {
    const removedProduct = cart[index]; // Obtener el producto eliminado
    cart.splice(index, 1);
    updateCart();
    saveCart(); // Guardar el carrito en localStorage

    // Mostrar una alerta de éxito con SweetAlert2
    Swal.fire({
        icon: 'warning',
        title: 'Producto eliminado',
        text: `${removedProduct.marca} ${removedProduct.modelo} ha sido eliminado del carrito.`,
        showConfirmButton: false,
        timer: 2000,  // Se cerrará automáticamente en 2 segundos
    });
}

// Vaciar el carrito
function clearCart() {
    cart = [];
    updateCart();
    saveCart(); // Guardar el carrito vacío en localStorage

    // Mostrar una alerta de vaciado con SweetAlert2
    Swal.fire({
        icon: 'info',
        title: 'Carrito vaciado',
        text: 'Todos los productos han sido eliminados del carrito.',
        showConfirmButton: false,
        timer: 2000,  // Se cerrará automáticamente en 2 segundos
    });
}

// Calcular el total del carrito
function calculateTotal() {
    return cart.reduce((total, product) => total + product.precio, 0);
}

// Actualizar el carrito
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    // Limpiar los productos del carrito
    cartItemsContainer.innerHTML = '';

    // Añadir productos al carrito
    cart.forEach((item, index) => {
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `
            ${item.marca} ${item.modelo} - $${item.precio} <button class="btn btn-danger" onclick="removeFromCart(${index})">Eliminar</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Mostrar el total del carrito
    const totalContainer = document.getElementById('cart-total');
    totalContainer.innerHTML = `Total: $${calculateTotal()}`;
}

// Guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Mostrar u ocultar el carrito
function toggleCart() {
    const cartElement = document.getElementById('cart');
    cartElement.style.display = cartElement.style.display === 'none' || cartElement.style.display === '' ? 'block' : 'none';
}

// Inicializar la página
function init() {
    // Si el carrito tiene productos almacenados en localStorage, lo cargamos
    updateCart(); // Actualizamos la vista del carrito al cargar la página
    loadProducts(); // Cargar los productos desde el archivo JSON
}

init(); // Llamamos a la función de inicialización






