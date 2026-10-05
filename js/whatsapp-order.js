// whatsapp-order.js: adds an "Order via WhatsApp" button to every product card on the page.
// Usage: give each product element data-product="Name" (optional data-variant="Color") and load this script.

// Business WhatsApp number in international format, digits only (country code + number, no "+", spaces or dashes).
const AMARELO_WHATSAPP_NUMBER = "593982033989"; // Test number given by Mateo (Ecuador +593); replace with the final business number when ready

// Builds the prefilled message the customer will see in WhatsApp.
function buildOrderMessage(product, variant) {
  // Start with a greeting that names the product the customer wants.
  let message = `Hola Amarelo, me interesa hacer un pedido del producto: ${product}`;
  // If the card specifies a variant (color, number of modules...), add it to the message.
  if (variant) message += ` (${variant})`;
  // Close the message asking for availability and price so the conversation starts with useful info.
  message += ". ¿Me pueden dar más información sobre disponibilidad y precio?";
  // Return the finished text.
  return message;
}

// Builds the full wa.me link for a product.
function buildWhatsAppLink(product, variant) {
  // encodeURIComponent makes spaces, accents and "¿" safe to put inside a URL.
  const text = encodeURIComponent(buildOrderMessage(product, variant));
  // wa.me opens WhatsApp (app on phones, WhatsApp Web on desktop) with the chat and text ready.
  return `https://wa.me/${AMARELO_WHATSAPP_NUMBER}?text=${text}`;
}

// Creates the button element for one product.
function createOrderButton(product, variant) {
  // Use a link (<a>) instead of a <button> because it navigates to an external URL.
  const link = document.createElement("a");
  // Point the link at the prefilled WhatsApp chat.
  link.href = buildWhatsAppLink(product, variant);
  // Open WhatsApp in a new tab so the catalog stays open.
  link.target = "_blank";
  // Security best practice for target="_blank": the new tab cannot control this page.
  link.rel = "noopener noreferrer";
  // CSS class defined in whatsapp-order.css.
  link.className = "wa-order-btn";
  // Accessible label for screen readers, naming the specific product.
  link.setAttribute("aria-label", `Pedir ${product} por WhatsApp`);
  // Visible button text.
  link.textContent = "Pedir por WhatsApp";
  // Hand the finished element back to the caller.
  return link;
}

// Finds every product on the page and appends its button.
function addWhatsAppButtons() {
  // Select every element marked as a product.
  document.querySelectorAll("[data-product]").forEach((card) => {
    // Skip cards that already have a button, so calling this twice doesn't duplicate them.
    if (card.querySelector(".wa-order-btn")) return;
    // Read the product name from the data attribute.
    const product = card.dataset.product;
    // Read the optional variant (undefined if the card doesn't have one).
    const variant = card.dataset.variant;
    // Build the button and add it at the end of the card.
    card.appendChild(createOrderButton(product, variant));
  });
}

// Run once the HTML has loaded, so all product cards exist when we look for them.
document.addEventListener("DOMContentLoaded", addWhatsAppButtons);
