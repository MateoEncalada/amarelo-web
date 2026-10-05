// =====================================================================
// app.js — Lógica del sitio: dibuja la grilla y la vista de detalle
// Depende de products.js (STORE, PRODUCTS) y whatsapp-order.js (createOrderButton).
// =====================================================================

// Formatea un número como precio, ej. 110 -> "$110"
function formatPrice(value) {                                   // Recibe el precio numérico
  return STORE.currency + value;                                // Devuelve el símbolo + el número
}                                                               // Fin formatPrice

// Devuelve el precio más bajo de un producto (para "Desde $X")
function minPrice(product) {                                    // Recibe un producto
  return Math.min(...product.variants.map(v => v.price));       // Toma todos los precios y devuelve el menor
}                                                               // Fin minPrice

// Dibuja la grilla de productos en la página de inicio
function renderGrid() {                                         // Sin parámetros: usa PRODUCTS
  const grid = document.getElementById("product-grid");         // Busca el contenedor de la grilla
  if (!grid) return;                                            // Si no existe (otra página), no hace nada
  grid.innerHTML = PRODUCTS.map(p => {                          // Convierte cada producto en HTML
    const many = p.variants.length > 1;                         // ¿Tiene más de un precio?
    return `
      <a class="card" href="producto.html?id=${p.id}">
        <div class="card-img"><img src="${p.variants[0].image}" alt="${p.name}" loading="lazy"></div>
        <div class="card-body">
          <span class="card-cat">${p.category}</span>
          <h3>${p.name}</h3>
          <p class="card-dim">${p.dimensions}</p>
          <p class="card-price">${many ? "Desde " : ""}${formatPrice(minPrice(p))}</p>
        </div>
      </a>`;                                                    // Tarjeta: enlace al detalle con imagen, categoría, nombre, medidas y precio
  }).join("");                                                  // Une todas las tarjetas en un solo texto
}                                                               // Fin renderGrid

// Dibuja la vista de detalle de un producto (producto.html?id=...)
function renderDetail() {                                       // Sin parámetros: lee el id de la URL
  const box = document.getElementById("product-detail");        // Busca el contenedor del detalle
  if (!box) return;                                             // Si no estamos en la página de detalle, sale
  const id = new URLSearchParams(location.search).get("id");    // Lee el parámetro ?id= de la URL
  const product = PRODUCTS.find(p => p.id === id);              // Busca el producto con ese id
  if (!product) {                                               // Si no existe...
    box.innerHTML = `<p class="not-found">Producto no encontrado. <a href="index.html#catalogo">Volver al catálogo</a></p>`; // ...muestra un aviso
    return;                                                     // Y termina
  }                                                             // Fin del caso no encontrado
  document.title = `${product.name} | Amarelo`;                 // Cambia el título de la pestaña
  let current = 0;                                              // Índice de la variante seleccionada

  // Función interna que vuelve a pintar el detalle con la variante actual
  function paint() {                                            // Se llama al inicio y al cambiar de color
    const v = product.variants[current];                        // Variante seleccionada
    const thumbs = [...product.variants.map(x => x.image), ...product.extraImages]; // Todas las imágenes disponibles
    box.innerHTML = `
      <div class="detail-gallery">
        <img id="main-img" class="detail-main" src="${v.image}" alt="${product.name} ${v.label}">
        <div class="thumbs">
          ${thumbs.map(src => `<img src="${src}" alt="" data-src="${src}">`).join("")}
        </div>
      </div>
      <div class="detail-info">
        <span class="card-cat">${product.category}</span>
        <h1>${product.name}</h1>
        <p class="detail-price">${formatPrice(v.price)}</p>
        <p>${product.description}</p>
        <p class="card-dim"><strong>Medidas:</strong> ${product.dimensions} (ancho x fondo x alto)</p>
        <ul class="features">${product.features.map(f => `<li>${f}</li>`).join("")}</ul>
        <div class="variants">
          <span>Color:</span>
          ${product.variants.map((x, i) => `<button class="chip ${i === current ? "active" : ""}" data-i="${i}">${x.label}</button>`).join("")}
        </div>
        <div id="wa-slot"></div>
        <p class="note">Hecho a mano. Los pedidos se coordinan únicamente por WhatsApp.</p>
      </div>`;                                                  // Galería a la izquierda, información y botón a la derecha
    document.getElementById("wa-slot").appendChild(createOrderButton(product.name, v.label)); // Botón de WhatsApp (de whatsapp-order.js) con producto y color elegidos
    box.querySelectorAll(".chip").forEach(btn =>                // Para cada botón de color...
      btn.addEventListener("click", () => {                     // ...al hacer clic:
        current = Number(btn.dataset.i);                        // Guarda la variante elegida
        paint();                                                // Vuelve a dibujar con el nuevo precio e imagen
      }));                                                      // Fin listeners de color
    box.querySelectorAll(".thumbs img").forEach(t =>            // Para cada miniatura...
      t.addEventListener("click", () => {                       // ...al hacer clic:
        document.getElementById("main-img").src = t.dataset.src; // Cambia la imagen principal
      }));                                                      // Fin listeners de miniaturas
  }                                                             // Fin paint
  paint();                                                      // Dibujo inicial
}                                                               // Fin renderDetail

// Pone el año actual en el pie de página
function setYear() {                                            // Sin parámetros
  const y = document.getElementById("year");                   // Busca el elemento del año
  if (y) y.textContent = new Date().getFullYear();              // Si existe, escribe el año
}                                                               // Fin setYear

// Enlace general de WhatsApp (sin producto) para botones de contacto
function setContactLinks() {                                    // Sin parámetros
  const url = `https://wa.me/${AMARELO_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Amarelo, quisiera más información.")}`; // Usa el número definido en whatsapp-order.js
  document.querySelectorAll("[data-whatsapp]").forEach(a => a.href = url); // Asigna la URL a todo enlace marcado con data-whatsapp
}                                                               // Fin setContactLinks

// Cuando el HTML terminó de cargar, se ejecuta todo
document.addEventListener("DOMContentLoaded", () => {           // Espera a que el DOM esté listo
  renderGrid();                                                 // Dibuja la grilla (si aplica)
  renderDetail();                                               // Dibuja el detalle (si aplica)
  setContactLinks();                                            // Configura enlaces de contacto
  setYear();                                                    // Escribe el año
});                                                             // Fin del arranque
