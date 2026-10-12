# RaiderStore

Tienda de Fortnite hecha con Vue 3 + Vite: skins y packs en vivo (API de fortnite-api.com), pases, V-Bucks, Crew,
streaming y un chatbot de ayuda. Los pedidos se confirman por WhatsApp.

## Puesta en marcha

```bash
npm install
cp .env.example .env     # y rellena los valores
npm run dev              # http://localhost:5173
npm run build            # genera dist/
```

## Variables de entorno

| Variable | Dónde se usa | Pública |
| --- | --- | --- |
| `VITE_WHATSAPP_PHONE` | Número al que se envía el pedido | Sí |
| `VITE_WHATSAPP_URL` | Botón flotante de WhatsApp | Sí |
| `VITE_FACEBOOK_URL` | Botón flotante de Facebook | Sí |
| `DEEPSEEK_API_KEY` | Chatbot (`api/chat.js`) | **No, solo servidor** |

Cualquier variable con prefijo `VITE_` queda dentro del JavaScript que descarga el visitante. Por eso la clave de
DeepSeek no lleva ese prefijo: el navegador llama a `/api/chat` y es el servidor quien habla con DeepSeek.

En Vercel, define las cuatro variables en *Project Settings > Environment Variables* y vuelve a desplegar.

## Estructura

```
api/chat.js              Función serverless del chatbot (clave y prompt en el servidor)
src/data/products.js     Catálogo propio: pases, crew, V-Bucks y streaming (edita precios aquí)
src/config.js            Variables públicas y constantes
src/composables/useCart.js   Carrito compartido (persiste en localStorage)
src/utils/pricing.js     Conversión V-Bucks -> MXN/USD y totales
src/components/          Tarjetas, modales, carrito, chatbot
```

## Diseño

El sistema visual ("Atardecer Raider") sale del logo y vive en `src/style.css` como variables CSS:
fondos violeta pizarra (`--dusk-*`), texto plata (`--chrome-*`), naranja de marca (`--raider`) solo para acciones
y para lo legendario, y un color por rareza (`--rar-*`). Cambia un valor ahí y se actualiza todo el sitio.

Todas las tarjetas (skins, packs, pases, V-Bucks, Crew y streaming) usan una sola plantilla,
`src/components/ShopCard.vue`; cada `*Card.vue` solo le pasa sus datos.

## Notas

- **Nunca subas `.env` a Git.** Ya está en `.gitignore`; si alguna vez se subió, hay que quitarlo del repositorio
  (`git rm --cached .env`) y **cambiar las claves**, porque siguen en el historial.
- Para agregar un producto propio, añade un objeto en `src/data/products.js`.
