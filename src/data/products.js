// Catálogo propio de la tienda. Para cambiar precios o agregar productos, edita solo este archivo.
// Las skins, emotes y packs vienen en vivo de la API de Fortnite (ver CosmeticStore.vue).

import paseDeBatalla from '../assets/paseDeBatalla.png';
import PaseOG from '../assets/PaseOG.webp';
import PaseLego from '../assets/PaseLego.webp';
import PaseFestival from '../assets/PaseFestival.webp';
import pavosImg from '../assets/pavos.webp';
import crewImg from '../assets/crew.png';
import Geminilogo from '../assets/Gemini.webp';
import AmazonPrimelogo from '../assets/AmazonPrime.png';

export const pases = [
  { id: 'bp', name: 'Pase de Batalla', price: 800, mxn: '115.00', usd: '6.61', rarity: 'rare', type: 'default', imageUrl: paseDeBatalla },
  { id: 'og', name: 'Pase OG', price: 800, mxn: '115.00', usd: '6.61', rarity: 'legendary', type: 'default', imageUrl: PaseOG },
  { id: 'lego', name: 'Pase LEGO', price: 1200, mxn: '145.00', usd: '8.39', rarity: 'epic', type: 'default', imageUrl: PaseLego },
  { id: 'festival', name: 'Pase Festival', price: 1200, mxn: '145.00', usd: '8.39', rarity: 'legendary', type: 'default', imageUrl: PaseFestival }
];

export const crew = [
  { id: 'crew-1', name: '1 Mes de crew', label: '1 mes de Crew', price: 0, mxn: '89.00', usd: '5.15', rarity: 'rare', type: 'default', imageUrl: crewImg },
  { id: 'crew-3', name: '3 Meses de crew', label: '3 meses de Crew', price: 0, mxn: '199.00', usd: '11.51', rarity: 'epic', type: 'default', imageUrl: crewImg },
  { id: 'crew-6', name: '6 Meses de crew', label: '6 meses de Crew', price: 0, mxn: '350.00', usd: '20.25', rarity: 'legendary', type: 'default', imageUrl: crewImg }
];

export const recargas = [
  { id: 'recarga-800', name: '800 V-Bucks', price: 800, mxn: '115.00', usd: '6.79', rarity: 'uncommon', type: 'default', imageUrl: pavosImg },
  { id: 'recarga-2400', name: '2,400 V-Bucks', price: 2400, mxn: '249.00', usd: '14.71', rarity: 'rare', type: 'default', imageUrl: pavosImg },
  { id: 'recarga-4500', name: '4,500 V-Bucks', price: 4500, mxn: '399.00', usd: '23.56', rarity: 'epic', type: 'default', imageUrl: pavosImg },
  { id: 'recarga-12500', name: '12,500 V-Bucks', price: 12500, mxn: '849.00', usd: '50.14', rarity: 'legendary', type: 'default', imageUrl: pavosImg },
  { id: 'recarga-14900', name: '14,900 V-Bucks', price: 14900, mxn: '1040.00', usd: '61.42', rarity: 'legendary', type: 'default', imageUrl: pavosImg },
  { id: 'recarga-25000', name: '25,000 V-Bucks', price: 25000, mxn: '1640.00', usd: '96.85', rarity: 'mythic', type: 'default', imageUrl: pavosImg }
];

// Servicios de streaming y suscripciones
export const otros = [
  {
    id: 'otros-disney-30-dias',
    name: 'Disney+ 30 Dias',
    label: 'Disney+ 30 Dias',
    price: 0,
    mxn: '65.00',
    usd: '3.70',
    rarity: 'epic',
    type: 'default',
    imageUrl: 'https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/C67C35CF0EB8C168A861956E743C6CCD26BFB17B93227234F3CD1A81BB728F35/compose?format=webp&width=640',
    dispositivos: 1,
    dias: 30,
    instrucciones: 'Perfil para un dispositivo por 30 días'
  },
  {
    id: 'otros-Gemini-pro-18-meses',
    name: 'Gemini Pro 18 meses',
    label: 'Gemini Pro 18 meses',
    price: 0,
    mxn: '100.00',
    usd: '5.83',
    rarity: 'legendary',
    type: 'default',
    imageUrl: Geminilogo,
    dispositivos: 1,
    dias: 540,
    instrucciones: 'Código de activación para correo principal o secundario, garantía 5 meses.'
  },
  {
    id: 'otros-hbo-30-dias',
    name: 'HBO Max 30 Dias',
    label: 'HBO Max 30 Dias',
    price: 0,
    mxn: '65.00',
    usd: '3.79',
    rarity: 'rare',
    type: 'default',
    imageUrl: 'https://beam-images.warnermediacdn.com/2025-07/mob.png?host=wbd-dotcom-drupal-prd-us-east-1.s3.amazonaws.com',
    dispositivos: 1,
    dias: 30,
    instrucciones: 'Un perfil por 30 Días, 1 dispositivo, 4k ultra HD, Audio Dolby atmos.'
  },
  {
    id: 'otros-amazon-prime-30-dias',
    name: 'Amazon Prime 30 Dias',
    label: 'Amazon Prime 30  Dias',
    price: 0,
    mxn: '65.00',
    usd: '3.79',
    rarity: 'legendary',
    type: 'default',
    imageUrl: AmazonPrimelogo,
    dispositivos: 1,
    dias: 30,
    instrucciones: 'Resolución 4k, 30 días'
  }
];
