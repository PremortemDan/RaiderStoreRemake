<script setup>
import { computed } from 'vue';

// Tarjeta única para todos los productos (skins, packs, pases, V-Bucks, Crew y streaming).
// Cada componente *Card.vue solo traduce sus datos a estas propiedades.
const props = defineProps({
  name: { type: String, required: true },
  image: { type: String, default: '' },
  alt: { type: String, default: '' },
  rarity: { type: String, default: 'common' },
  vbucks: { type: Number, default: 0 },
  mxn: { type: [Number, String], required: true },
  usd: { type: [Number, String], default: 0 },
  // 'cover' llena el marco (arte de skins); 'contain' deja aire alrededor (iconos y logos)
  fit: { type: String, default: 'contain' },
  badge: { type: String, default: '' },
  badgeTone: { type: String, default: 'brand' },
  meta: { type: String, default: '' },
  detail: { type: String, default: '' },
  // 'lg' agranda el nombre cuando el nombre ES el producto (ej. "2,400 V-Bucks")
  nameSize: { type: String, default: 'md' }
});

defineEmits(['select']);

const KNOWN_RARITIES = [
  'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic',
  'dark', 'frozen', 'lava', 'shadow', 'slurp', 'marvel', 'dc', 'icon', 'gaminglegends', 'starwars'
];

const rarityKey = computed(() => {
  const value = String(props.rarity || '').toLowerCase();
  const normalized = value === 'darkv2' ? 'dark' : value;
  return KNOWN_RARITIES.includes(normalized) ? normalized : 'common';
});

// 115.00 -> "115", 1040 -> "1,040", 6.61 -> "6.61"
const formatMoney = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  return Number.isInteger(n) ? n.toLocaleString('es-MX') : n.toFixed(2);
};

const mxnText = computed(() => formatMoney(props.mxn));
const usdText = computed(() => formatMoney(props.usd));
const vbucksText = computed(() => props.vbucks.toLocaleString('es-MX'));
</script>

<template>
  <div
    class="shop-card"
    :class="`rarity-${rarityKey}`"
    role="button"
    tabindex="0"
    :aria-label="`${name}, ${mxnText} MXN`"
    @click="$emit('select')"
    @keydown.enter.self="$emit('select')"
    @keydown.space.self.prevent="$emit('select')"
  >
    <div class="shop-card__art">
      <img
        :src="image"
        :alt="alt || name"
        class="shop-card__img"
        :class="`is-${fit}`"
        loading="lazy"
        decoding="async"
      />
      <span v-if="badge" class="shop-card__badge" :class="`tone-${badgeTone}`">{{ badge }}</span>
    </div>

    <div class="shop-card__body">
      <h3 class="shop-card__name" :class="{ 'is-lg': nameSize === 'lg' }">{{ name }}</h3>
      <p v-if="meta" class="shop-card__meta">{{ meta }}</p>
      <p v-if="detail" class="shop-card__detail">{{ detail }}</p>

      <div class="shop-card__price">
        <div class="shop-card__mxn">
          <span class="shop-card__amount">${{ mxnText }}</span>
          <span class="shop-card__cur">MXN</span>
        </div>
        <div class="shop-card__sub">
          <span v-if="vbucks > 0" class="shop-card__vb">
            <svg width="18" height="18" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="100" cy="100" r="80" fill="#fff" />
              <path d="M65 75 L88 135 H112 L135 75 H115 L100 115 L85 75 Z" fill="#003B8D" />
            </svg>
            {{ vbucksText }}
          </span>
          <span class="shop-card__usd">${{ usdText }} USD</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-card {
  --rar: var(--rar-common);
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  background: var(--dusk-700);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.07), 0 14px 24px -14px rgba(8, 6, 20, 0.8);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.shop-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 0 0 2px var(--rar),
    0 16px 32px -12px color-mix(in srgb, var(--rar) 60%, transparent);
}

.shop-card:focus-visible {
  outline: 3px solid var(--rar);
  outline-offset: 3px;
}

@media (hover: none) {
  .shop-card:hover {
    transform: none;
  }
}

/* ===== Rarezas: solo cambian una variable ===== */
.rarity-uncommon { --rar: var(--rar-uncommon); }
.rarity-rare { --rar: var(--rar-rare); }
.rarity-epic { --rar: var(--rar-epic); }
.rarity-legendary { --rar: var(--rar-legendary); }
.rarity-mythic { --rar: var(--rar-mythic); }
.rarity-dark { --rar: var(--rar-dark); }
.rarity-frozen { --rar: var(--rar-frozen); }
.rarity-lava { --rar: var(--rar-lava); }
.rarity-shadow { --rar: var(--rar-shadow); }
.rarity-slurp { --rar: var(--rar-slurp); }
.rarity-marvel { --rar: var(--rar-marvel); }
.rarity-dc { --rar: var(--rar-dc); }
.rarity-icon { --rar: var(--rar-icon); }
.rarity-gaminglegends { --rar: var(--rar-gaminglegends); }
.rarity-starwars { --rar: var(--rar-starwars); }

/* ===== Arte ===== */
.shop-card__art {
  position: relative;
  height: 250px;
  overflow: hidden;
  background:
    radial-gradient(120% 80% at 50% 28%, color-mix(in srgb, var(--rar) 55%, transparent) 0%, transparent 70%),
    linear-gradient(180deg, color-mix(in srgb, var(--rar) 22%, var(--dusk-800)) 0%, var(--dusk-800) 100%);
}

.shop-card__img {
  display: block;
  width: 100%;
  height: 100%;
}

.shop-card__img.is-cover {
  object-fit: cover;
  object-position: top;
}

.shop-card__img.is-contain {
  object-fit: contain;
  padding: 22px;
  box-sizing: border-box;
}

/* Etiqueta inclinada, igual que las de la tienda del juego */
.shop-card__badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  isolation: isolate;
  padding: 5px 14px 4px;
  color: var(--ink-on-brand);
  font: 700 16px/1 var(--display);
  white-space: nowrap;
}

.shop-card__badge::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--grad-brand);
  transform: skewX(-10deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
}

.shop-card__badge.tone-chrome::before {
  background: linear-gradient(135deg, #f1f3f8, #b9c0d3);
}

/* ===== Cuerpo ===== */
.shop-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px 16px;
  background: linear-gradient(180deg, var(--dusk-800), var(--dusk-700));
  border-bottom: 4px solid var(--rar);
}

.shop-card__name {
  margin: 0;
  color: var(--chrome-100);
  font: 700 22px/1.1 var(--display);
  letter-spacing: 0.02em;
  text-transform: uppercase;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.shop-card__name.is-lg {
  font-size: 32px;
  line-height: 1;
}

.shop-card__meta,
.shop-card__detail {
  margin: 0;
  color: var(--chrome-500);
  font-size: 13px;
  line-height: 1.35;
}

.shop-card__detail {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== Precio: lo que paga el cliente va primero ===== */
.shop-card__price {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.shop-card__mxn {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.shop-card__amount {
  color: #fff;
  font: 700 34px/1 var(--display);
}

.shop-card__cur {
  color: var(--chrome-500);
  font: 700 16px/1 var(--display);
}

.shop-card__sub {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 12px;
  margin-top: 8px;
}

/* Precio en V-Bucks: placa inclinada con el azul-plata de la moneda */
.shop-card__vb {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 12px 2px 10px;
  color: var(--coin);
  font: 700 18px/1.2 var(--display);
}

.shop-card__vb::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: rgba(142, 208, 240, 0.14);
  border-left: 3px solid var(--coin);
  transform: skewX(-10deg);
}

.shop-card__usd {
  color: var(--chrome-500);
  font-size: 13px;
}

/* ===== Tablet ===== */
@media (max-width: 1023px) {
  .shop-card__art {
    height: 190px;
  }

  .shop-card__name {
    font-size: 19px;
  }

  .shop-card__name.is-lg {
    font-size: 26px;
  }

  .shop-card__amount {
    font-size: 30px;
  }
}

/* ===== Móvil: dos columnas ===== */
@media (max-width: 767px) {
  .shop-card {
    border-radius: 8px;
  }

  .shop-card__art {
    height: 140px;
  }

  .shop-card__img.is-contain {
    padding: 14px;
  }

  .shop-card__body {
    gap: 4px;
    padding: 10px 12px 12px;
  }

  .shop-card__name {
    font-size: 16px;
  }

  .shop-card__name.is-lg {
    font-size: 21px;
  }

  .shop-card__meta,
  .shop-card__detail {
    font-size: 12px;
  }

  .shop-card__amount {
    font-size: 26px;
  }

  .shop-card__cur {
    font-size: 14px;
  }

  .shop-card__vb {
    font-size: 15px;
    padding: 1px 8px 1px 8px;
  }

  .shop-card__vb svg {
    width: 15px;
    height: 15px;
  }

  .shop-card__usd {
    font-size: 11px;
  }

  .shop-card__badge {
    top: 6px;
    left: 6px;
    padding: 3px 9px 2px;
    font-size: 13px;
  }
}
</style>
