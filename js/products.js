// =====================================================================
// products.js — Catálogo de productos de Amarelo
// Fuente: /mnt/project-files/catalog/products.json (datos sacados de las fotos).
// Para cambiar precios, colores o medidas solo hay que editar este archivo.
// Medidas en ancho x fondo x alto (cm). El número de WhatsApp está en js/whatsapp-order.js.
// =====================================================================

// Configuración general de la tienda
const STORE = {                                   // Objeto con datos de la marca
  name: "Amarelo",                                // Nombre de la marca
  currency: "$",                                  // Símbolo de moneda (USD, confirmado)
};                                                // Fin de la configuración

// Lista de productos: cada objeto es un mueble
const PRODUCTS = [                                // Arreglo con todos los productos
  {                                               // --- Producto 1 ---
    id: "closet-alba",                            // Identificador único (va en la URL del detalle)
    name: "Closet Montessori Alba",               // Nombre visible
    category: "Closets",                          // Categoría
    dimensions: "100 x 45 x 124 cm",              // Medidas ancho x fondo x alto
    description: "Closet abierto a la altura del niño que fomenta la autonomía al vestirse.", // Descripción corta
    features: ["Barra para colgar ropa", "Repisa superior con borde", "3 compartimentos laterales", "2 repisas inferiores"], // Características
    variants: [                                   // Opciones de color con precio e imagen
      { label: "Blanco", price: 110, image: "img/closet-alba-blanco.jpg" },               // Blanco
      { label: "Color (Panela)", price: 165, image: "img/closet-alba-panela.jpg" },       // Madera clara
    ],                                            // Fin variantes
    extraImages: ["img/closet-alba-medidas.jpg"], // Plano con medidas
  },                                              // Fin producto 1
  {                                               // --- Producto 2 ---
    id: "escritorio-evolutivo",                   // Identificador único
    name: "Escritorio Evolutivo Montessori",      // Nombre visible
    category: "Escritorios",                      // Categoría
    dimensions: "100 x 40 x 65 cm",               // Medidas
    description: "Escritorio que crece con el niño: la superficie cambia de altura gracias a sus ranuras laterales.", // Descripción
    features: ["Mueble con puerta (34 cm)", "Superficie de trabajo de 65 cm con altura regulable", "Respaldo con repisa"], // Características
    variants: [                                   // Variantes
      { label: "Blanco", price: 70, image: "img/escritorio-evolutivo-blanco.jpg" },                     // Blanco
      { label: "Un color (Panela)", price: 95, image: "img/escritorio-evolutivo-panela.jpg" },          // Madera clara
      { label: "Un color (Avellana)", price: 95, image: "img/escritorio-evolutivo-avellana.jpg" },      // Madera oscura (nombre PENDIENTE confirmar)
      { label: "Dos colores (Panela + Agave)", price: 115, image: "img/escritorio-evolutivo-panela-agave.jpg" }, // Madera + verde
    ],                                            // Fin variantes
    extraImages: ["img/escritorio-evolutivo-medidas.jpg"], // Plano con medidas
  },                                              // Fin producto 2
  {                                               // --- Producto 3 ---
    id: "librero-lumi",                           // Identificador único
    name: "Organizador Librero Lumi",             // Nombre visible
    category: "Libreros y organizadores",         // Categoría
    dimensions: "73 x 32 x 71 cm",                // Medidas según el plano (confirmado por Mateo); +6 cm del revistero
    description: "Librero abierto con revistero frontal para que los niños elijan sus cuentos solos.", // Descripción
    features: ["3 niveles abiertos", "Revistero lateral para libros de frente"], // Características
    variants: [                                   // Variantes
      { label: "Blanco", price: 65, image: "img/librero-lumi-blanco.jpg" },                       // Blanco
      { label: "Un color (Panela)", price: 95, image: "img/librero-lumi-panela.jpg" },            // Madera clara
      { label: "Un color (Avellana)", price: 95, image: "img/librero-lumi-avellana.jpg" },        // Madera oscura
      { label: "Dos colores (Panela + Agave)", price: 115, image: "img/librero-lumi-panela-agave.jpg" }, // Madera + verde
    ],                                            // Fin variantes
    extraImages: ["img/librero-lumi-medidas.jpg"], // Plano con medidas
  },                                              // Fin producto 3
  {                                               // --- Producto 4 ---
    id: "qubo-6",                                 // Identificador único
    name: "Organizador Qubo (6 cubos)",           // Nombre visible
    category: "Libreros y organizadores",         // Categoría
    dimensions: "102 x 32 x 70 cm",               // Medidas
    description: "Organizador de seis cubos para juguetes, libros y cajas.", // Descripción
    features: ["6 cubos abiertos de 32 x 32 cm"], // Características
    variants: [                                   // Variantes
      { label: "Blanco", price: 75, image: "img/qubo-6-blanco.jpg" },                             // Blanco
      { label: "Dos colores (Blanco + Panela)", price: 110, image: "img/qubo-6-blanco-panela.jpg" }, // Blanco + madera
    ],                                            // Fin variantes
    extraImages: ["img/qubo-6-medidas.jpg"],      // Plano con medidas
  },                                              // Fin producto 4
  {                                               // --- Producto 5 ---
    id: "qubo-2",                                 // Identificador único
    name: "Organizador Qubo Dos Módulos",         // Nombre visible
    category: "Libreros y organizadores",         // Categoría
    dimensions: "35 x 32 x 70 cm",                // Medidas
    description: "Versión compacta del Qubo, ideal como mesa de noche o para espacios pequeños.", // Descripción
    features: ["2 cubos abiertos de 32 x 32 cm"], // Características
    variants: [                                   // Una sola variante
      { label: "Gris con tapa de madera", price: 45, image: "img/qubo-2-gris-madera.jpg" },       // Color confirmado
    ],                                            // Fin variantes
    extraImages: ["img/qubo-2-medidas.jpg"],      // Plano con medidas
  },                                              // Fin producto 5
];                                                // Fin de la lista de productos
