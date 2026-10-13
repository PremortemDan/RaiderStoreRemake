// Rarezas conocidas (cada una tiene su color --rar-* en style.css)
const KNOWN_RARITIES = [
  'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic',
  'dark', 'frozen', 'lava', 'shadow', 'slurp', 'marvel', 'dc', 'icon', 'gaminglegends', 'starwars'
];

export const rarityKey = (rarity) => {
  const value = String(rarity || '').toLowerCase();
  const normalized = value === 'darkv2' ? 'dark' : value;
  return KNOWN_RARITIES.includes(normalized) ? normalized : 'common';
};

// Variable CSS del color de la rareza, para usar en :style
export const rarityColor = (rarity) => `var(--rar-${rarityKey(rarity)})`;

// La rareza de un pack es la del artículo más raro que contiene
const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

export const highestRarity = (items) => {
  if (!items || items.length === 0) return 'rare';
  let highestIndex = 0;
  items.forEach((item) => {
    const index = RARITY_ORDER.indexOf((item.rarity || 'common').toLowerCase());
    if (index > highestIndex) highestIndex = index;
  });
  return RARITY_ORDER[highestIndex];
};
