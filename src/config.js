// Configuración pública del sitio (se lee de variables VITE_* en .env).
// Aquí NUNCA van claves secretas: todo lo que empiece con VITE_ queda visible en el navegador.

// Solo dígitos, con código de país. Ej: 5215512345678
export const WHATSAPP_PHONE = (import.meta.env.VITE_WHATSAPP_PHONE || '').replace(/\D/g, '');

// Enlaces de los botones flotantes. Si están vacíos, el botón no se muestra.
export const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL || '';
export const FACEBOOK_URL = import.meta.env.VITE_FACEBOOK_URL || '';

// Clave del carrito en localStorage
export const CART_STORAGE_KEY = 'raiderstore_cart';

// Segundos entre cambios del fondo de pantalla
export const WALLPAPER_INTERVAL_MS = 8000;
