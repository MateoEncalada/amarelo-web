// =====================================================================
// cart.js — Carrito de compras de Amarelo
// No hay pago en línea: el carrito arma UN mensaje de WhatsApp con todo el pedido.
// El carrito se guarda en el navegador (localStorage) para no perderlo al cambiar de página.
// Depende de products.js (PRODUCTS, STORE) y whatsapp-order.js (AMARELO_WHATSAPP_NUMBER).
// =====================================================================

const CART_KEY = "amarelo-carrito";                             // Nombre con el que se guarda el carrito en el navegador

// Lee el carrito guardado; si no hay o falla, devuelve una lista vacía
function loadCart() {                                           // Sin parámetros
  try {                                                         // localStorage puede fallar (modo privado, bloqueado)
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); // Convierte el texto guardado en lista
    return saved.filter(item =>                                 // Descarta elementos que ya no existen en el catálogo
      PRODUCTS.some(p => p.id === item.id && p.variants[item.v])); // El producto y su color deben seguir existiendo
  } catch (e) {                                                 // Si algo falló...
    return [];                                                  // ...empieza con el carrito vacío
  }                                                             // Fin try/catch
}                                                               // Fin loadCart

let cart = loadCart();                                          // Carrito en memoria: lista de { id, v (índice del color), qty }

// Guarda el carrito y actualiza todo lo que lo muestra
function saveCart() {                                           // Sin parámetros
  try {                                                         // Intenta guardar
    localStorage.setItem(CART_KEY, JSON.stringify(cart));       // Guarda la lista como texto
  } catch (e) {                                                 // Si no se puede guardar...
    /* el carrito sigue funcionando en esta página aunque no se guarde */ // ...no pasa nada grave
  }                                                             // Fin try/catch
  renderCart();                                                 // Vuelve a dibujar el panel y el contador
}                                                               // Fin saveCart

// Busca el producto y el color de un elemento del carrito
function cartLine(item) {                                       // Recibe { id, v, qty }
  const product = PRODUCTS.find(p => p.id === item.id);         // Producto del catálogo
  const variant = product.variants[item.v];                     // Color elegido
  return { product, variant, subtotal: variant.price * item.qty }; // Devuelve los datos y el subtotal (precio x cantidad)
}                                                               // Fin cartLine

// Agrega un producto al carrito (si ya estaba con el mismo color, suma la cantidad)
function addToCart(id, v, qty = 1) {                            // Recibe id del producto, índice del color y cantidad
  const found = cart.find(item => item.id === id && item.v === v); // ¿Ya está ese producto con ese color?
  if (found) found.qty += qty;                                  // Sí: suma la cantidad
  else cart.push({ id, v, qty });                               // No: lo agrega como nueva línea
  saveCart();                                                   // Guarda y redibuja
  openCart();                                                   // Abre el panel para que el cliente vea que se agregó
}                                                               // Fin addToCart

// Cambia la cantidad de una línea; si llega a 0 la elimina
function changeQty(index, delta) {                              // Recibe la posición en la lista y +1 o -1
  cart[index].qty += delta;                                     // Suma o resta
  if (cart[index].qty <= 0) cart.splice(index, 1);              // Si quedó en 0, la quita
  saveCart();                                                   // Guarda y redibuja
}                                                               // Fin changeQty

// Quita una línea completa del carrito
function removeLine(index) {                                    // Recibe la posición en la lista
  cart.splice(index, 1);                                        // La elimina
  saveCart();                                                   // Guarda y redibuja
}                                                               // Fin removeLine

// Total de unidades (para el contador del ícono)
function cartCount() {                                          // Sin parámetros
  return cart.reduce((sum, item) => sum + item.qty, 0);         // Suma todas las cantidades
}                                                               // Fin cartCount

// Total a pagar
function cartTotal() {                                          // Sin parámetros
  return cart.reduce((sum, item) => sum + cartLine(item).subtotal, 0); // Suma todos los subtotales
}                                                               // Fin cartTotal

// Arma el mensaje de WhatsApp con todo el pedido
function buildCartMessage() {                                   // Sin parámetros
  const lines = cart.map(item => {                              // Una línea de texto por producto
    const { product, variant, subtotal } = cartLine(item);      // Datos de la línea
    return `• ${item.qty} x ${product.name}, ${variant.label}: ${STORE.currency}${subtotal}`; // Ej: "• 2 x Organizador Qubo (6 cubos), Blanco: $150"
  });                                                           // Fin de las líneas
  return [                                                      // Une las partes del mensaje con saltos de línea
    "Hola Amarelo, quiero hacer este pedido:",                  // Saludo
    ...lines,                                                   // Productos
    `Total: ${STORE.currency}${cartTotal()}`,                   // Total
    "¿Está disponible y cómo coordinamos la entrega?",          // Cierre
  ].join("\n");                                                 // "\n" = salto de línea dentro de WhatsApp
}                                                               // Fin buildCartMessage

// Enlace de WhatsApp con el pedido completo
function cartWhatsAppLink() {                                   // Sin parámetros
  return `https://wa.me/${AMARELO_WHATSAPP_NUMBER}?text=${encodeURIComponent(buildCartMessage())}`; // Mismo formato que el botón individual
}                                                               // Fin cartWhatsAppLink

// Crea el botón del carrito en el menú y el panel lateral (una sola vez por página)
function setupCartUI() {                                        // Sin parámetros
  const nav = document.querySelector(".site-header nav");      // Menú superior
  const btn = document.createElement("button");                 // Botón del carrito
  btn.className = "cart-btn";                                   // Clase para los estilos
  btn.setAttribute("aria-label", "Abrir carrito");              // Texto para lectores de pantalla
  btn.innerHTML = `🛒 <span id="cart-count" class="cart-count">0</span>`; // Ícono y contador
  btn.addEventListener("click", openCart);                      // Al tocarlo abre el panel
  nav.insertBefore(btn, nav.querySelector(".nav-wa"));          // Lo pone justo antes del botón de WhatsApp

  const panel = document.createElement("aside");                // Panel lateral del carrito
  panel.id = "cart-panel";                                      // Id para encontrarlo
  panel.className = "cart-panel";                               // Clase para estilos
  panel.setAttribute("aria-hidden", "true");                    // Empieza oculto
  panel.innerHTML = `
    <div class="cart-head">
      <h2>Tu pedido</h2>
      <button class="cart-close" aria-label="Cerrar carrito">✕</button>
    </div>
    <div id="cart-items" class="cart-items"></div>
    <div class="cart-foot">
      <p class="cart-total">Total: <strong id="cart-total">$0</strong></p>
      <a id="cart-send" class="wa-order-btn cart-send" target="_blank" rel="noopener noreferrer">Enviar pedido por WhatsApp</a>
      <p class="note">El pago y la entrega se coordinan por WhatsApp.</p>
    </div>`;                                                    // Encabezado, lista de productos y pie con total y botón
  const overlay = document.createElement("div");                // Fondo oscuro detrás del panel
  overlay.id = "cart-overlay";                                  // Id para encontrarlo
  overlay.className = "cart-overlay";                           // Clase para estilos
  overlay.addEventListener("click", closeCart);                 // Tocar fuera cierra el panel
  document.body.append(overlay, panel);                         // Agrega ambos al final de la página
  panel.querySelector(".cart-close").addEventListener("click", closeCart); // La X cierra el panel
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); }); // La tecla Esc también cierra

  panel.querySelector("#cart-items").addEventListener("click", e => { // Un solo listener para todos los botones de la lista
    const b = e.target.closest("button[data-action]");          // Botón tocado (si lo hay)
    if (!b) return;                                             // Si no fue un botón, no hace nada
    const i = Number(b.dataset.index);                          // Posición de la línea
    if (b.dataset.action === "plus") changeQty(i, 1);           // + suma uno
    if (b.dataset.action === "minus") changeQty(i, -1);         // − resta uno
    if (b.dataset.action === "remove") removeLine(i);           // Quitar elimina la línea
  });                                                           // Fin listener de la lista
  renderCart();                                                 // Primer dibujo con lo guardado
}                                                               // Fin setupCartUI

// Dibuja el contenido del carrito y el contador
function renderCart() {                                         // Sin parámetros
  const count = document.getElementById("cart-count");         // Contador del ícono
  if (!count) return;                                           // Si la interfaz aún no existe, sale
  count.textContent = cartCount();                              // Muestra cuántas unidades hay
  count.hidden = cartCount() === 0;                             // Oculta el contador si está vacío
  const list = document.getElementById("cart-items");          // Contenedor de la lista
  const send = document.getElementById("cart-send");           // Botón de enviar
  if (cart.length === 0) {                                      // Carrito vacío:
    list.innerHTML = `<p class="cart-empty">Tu carrito está vacío. Elige un mueble y toca "Agregar al carrito".</p>`; // Mensaje
    send.classList.add("disabled");                             // Desactiva el botón visualmente
    send.removeAttribute("href");                               // Y le quita el enlace
  } else {                                                      // Carrito con productos:
    list.innerHTML = cart.map((item, i) => {                    // Una fila por línea
      const { product, variant, subtotal } = cartLine(item);    // Datos de la línea
      return `
        <div class="cart-row">
          <img src="${variant.image}" alt="">
          <div class="cart-info">
            <a href="producto.html?id=${product.id}">${product.name}</a>
            <span class="cart-variant">${variant.label} · ${STORE.currency}${variant.price}</span>
            <div class="qty">
              <button data-action="minus" data-index="${i}" aria-label="Quitar uno">−</button>
              <span>${item.qty}</span>
              <button data-action="plus" data-index="${i}" aria-label="Agregar uno">+</button>
              <button data-action="remove" data-index="${i}" class="cart-remove">Quitar</button>
            </div>
          </div>
          <strong class="cart-sub">${STORE.currency}${subtotal}</strong>
        </div>`;                                                // Foto, nombre, color, precio, cantidad y subtotal
    }).join("");                                                // Une todas las filas
    send.classList.remove("disabled");                          // Activa el botón
    send.href = cartWhatsAppLink();                             // Enlace con el pedido completo
  }                                                             // Fin if/else
  document.getElementById("cart-total").textContent = STORE.currency + cartTotal(); // Escribe el total
}                                                               // Fin renderCart

// Abre y cierra el panel
function openCart() {                                           // Sin parámetros
  document.body.classList.add("cart-open");                     // La clase en <body> muestra panel y fondo
  document.getElementById("cart-panel").setAttribute("aria-hidden", "false"); // Visible para lectores de pantalla
}                                                               // Fin openCart
function closeCart() {                                          // Sin parámetros
  document.body.classList.remove("cart-open");                  // Oculta panel y fondo
  document.getElementById("cart-panel").setAttribute("aria-hidden", "true"); // Oculto para lectores de pantalla
}                                                               // Fin closeCart

// Si el carrito cambia en otra pestaña, se sincroniza aquí también
window.addEventListener("storage", e => {                      // Evento del navegador al cambiar localStorage en otra pestaña
  if (e.key === CART_KEY) { cart = loadCart(); renderCart(); }  // Recarga y redibuja
});                                                             // Fin sincronización

document.addEventListener("DOMContentLoaded", setupCartUI);     // Crea la interfaz cuando la página está lista
