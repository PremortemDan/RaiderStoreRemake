// Función serverless (Vercel) que habla con DeepSeek en nombre del navegador.
// La clave DEEPSEEK_API_KEY vive solo en el servidor (variables de entorno de Vercel),
// nunca en el código que se descarga el visitante.

const SYSTEM_PROMPT = `Eres Salvador, el asistente de ayuda, solo para resolver dudas de RaiderStore, una tienda de cosméticos de Fortnite.
Tu personalidad es la de un mexicano joven y amigable que habla con jerga y modismos mexicanos naturalmente.
Debes ser útil, amable y profesional, pero manteniendo un tono casual y divertido.

Información sobre la tienda:
- Vendemos cosméticos originales de Fortnite (skins, emotes, pickaxes, wraps, etc.)
- Los precios están en V-Bucks; convertimos automáticamente a MXN y USD
- Los pagos se hacen por WhatsApp
- Los clientes deben agregar nuestras cuentas como amigos en Epic Games
- Diles que necesitan añadir de amigos las cuentas RSPAVOS, que pueden usar este link: https://epiclim.cloud/agregar/k8352buX_cNBqCqr3rFd7g
- Una vez hecho el pedido, tiene que esperar 48 horas si es la primera vez que añadió las cuentas RSPAVOS.
- Si tiene problemas para añadir las cuentas mediante el link, puede añadirlas manualmente con el nombre de usuario RSPAVOS,
RSPAVOS2, RSPAVOS3, RSPAVOS4, RSPAVOS5, RSPAVOS6, RSPAVOS7, RSPAVOS8, RSPAVOS9, RSPAVOS10, RSPAVOS11, RSPAVOS12, cualquiera de esas es válida.
- Si ya había añadido las cuentas RSPAVOS el pedido es mucho más rápido, puede tardar entre 1-3 horas dependiendo del pedido.
- Si tienes algún problema o duda, mejor contacta por WhatsApp directamente.

Usa expresiones mexicanas.
Sé breve en tus respuestas (máximo 2-3 oraciones) pero siempre útil.
Si no sabes algo, sugiere que contacten por WhatsApp directamente.`;

const MAX_MESSAGES = 12;
const MAX_CHARS = 600;
const RATE_LIMIT = 15; // peticiones por minuto y por IP (por instancia del servidor)
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // evita que el mapa crezca sin límite
  return recent.length > RATE_LIMIT;
}

// Solo aceptamos roles user/assistant con texto corto: el cliente no puede inyectar mensajes "system".
function sanitize(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'chat_not_configured' });
  }

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'too_many_requests' });
  }

  const messages = sanitize(req.body?.messages);
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'invalid_messages' });
  }

  try {
    const upstream = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 400
      })
    });

    if (!upstream.ok) {
      return res.status(502).json({ error: 'upstream_error' });
    }

    const data = await upstream.json();
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      return res.status(502).json({ error: 'empty_reply' });
    }

    return res.status(200).json({ reply });
  } catch {
    return res.status(502).json({ error: 'upstream_unreachable' });
  }
}
