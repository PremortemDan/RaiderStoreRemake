<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import VbucksIcon from './VbucksIcon.vue';
import { rarityKey as toRarityKey } from '../utils/rarity';

// Tarjeta única para todos los productos (skins, packs, pases, V-Bucks, Crew y streaming).
// Cada componente *Card.vue solo traduce sus datos a estas propiedades.
const props = defineProps({
  name: { type: String, required: true },
  image: { type: String, default: '' },
  // Varias imágenes de render (renderImages): se muestran en un carrusel con fundido
  images: { type: Array, default: () => [] },
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

const rarityKey = computed(() => toRarityKey(props.rarity));

// 115.00 -> "115", 1040 -> "1,040", 6.61 -> "6.61"
const formatMoney = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  return Number.isInteger(n) ? n.toLocaleString('es-MX') : n.toFixed(2);
};

const mxnText = computed(() => formatMoney(props.mxn));
const usdText = computed(() => formatMoney(props.usd));
const vbucksText = computed(() => props.vbucks.toLocaleString('es-MX'));

// ===== Carrusel de imágenes de render (renderImages) =====
const activeIndex = ref(0);
let slideshowTimer = null;

const slides = computed(() => {
  if (!Array.isArray(props.images)) return [];
  return props.images.filter((src) => typeof src === 'string' && src);
});

const stopSlideshow = () => {
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
  }
};

const startSlideshow = () => {
  stopSlideshow();
  if (slides.value.length <= 1) return;
  slideshowTimer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % slides.value.length;
  }, 2500);
};

watch(slides, () => {
  activeIndex.value = 0;
  startSlideshow();
});

onMounted(startSlideshow);
onBeforeUnmount(stopSlideshow);
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
      <template v-if="slides.length > 1">
        <img
          v-for="(slide, index) in slides"
          :key="`${slide}-${index}`"
          :src="slide"
          :alt="`${alt || name} ${index + 1}`"
          class="shop-card__img shop-card__slide"
          :class="[`is-${fit}`, { 'is-active': index === activeIndex }]"
          loading="eager"
          decoding="async"
        />
        <div class="shop-card__dots" aria-hidden="true">
          <span v-for="(slide, index) in slides" :key="index" :class="{ on: index === activeIndex }"></span>
        </div>
      </template>
      <img
        v-else
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

      <div class="shop-card__foot">
        <div class="shop-card__price">
          <span class="price-tag shop-card__amount">${{ mxnText }}<small>MXN</small></span>
          <div class="shop-card__sub">
            <span v-if="vbucks > 0" class="vb-chip">
              <VbucksIcon :size="15" />
              {{ vbucksText }}
            </span>
            <span class="shop-card__usd">${{ usdText }} USD</span>
          </div>
        </div>
        <span class="shop-card__add" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </span>
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
  padding: 8px;
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.shop-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 0 0 2px color-mix(in srgb, var(--rar) 55%, transparent),
    0 18px 36px -14px color-mix(in srgb, var(--rar) 55%, transparent);
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
  aspect-ratio: 6 / 5;
  overflow: hidden;
  border-radius: var(--r-md);
  background:
    radial-gradient(90% 70% at 50% 30%, color-mix(in srgb, var(--rar) 70%, white) 0%, transparent 72%),
    linear-gradient(180deg, color-mix(in srgb, var(--rar) 45%, white) 0%, color-mix(in srgb, var(--rar) 85%, black) 100%);
}

.shop-card__img {
  display: block;
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
}

.shop-card:hover .shop-card__img {
  transform: scale(1.04);
}

.shop-card__img.is-cover {
  object-fit: cover;
  object-position: top;
}

.shop-card__img.is-contain {
  object-fit: contain;
  padding: 18%;
  filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.25));
}

/* Carrusel de imágenes de render: apiladas con fundido */
.shop-card__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.6s ease, transform 0.4s ease;
}

.shop-card__slide.is-active {
  opacity: 1;
}

/* Los renders son cuadrados con el contenido en la parte de arriba: se amplían un poco y se recorta abajo */
.shop-card__slide.is-cover {
  left: -6%;
  width: 112%;
  height: auto;
  aspect-ratio: 1 / 1;
}

.shop-card__dots {
  position: absolute;
  bottom: 8px;
  left: 50%;
  z-index: 2;
  display: flex;
  gap: 4px;
  transform: translateX(-50%);
}

.shop-card__dots span {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  transition: width 0.3s ease, background-color 0.3s ease;
}

.shop-card__dots span.on {
  width: 16px;
  background: #fff;
}

.shop-card__badge {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  padding: 5px 10px;
  border-radius: 999px;
  background: var(--sun);
  color: var(--ink-fixed);
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
}

.shop-card__badge.tone-chrome {
  background: rgba(255, 255, 255, 0.92);
  color: var(--ink-fixed);
}

/* ===== Cuerpo ===== */
.shop-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  padding: 12px 8px 6px;
}

.shop-card__name {
  color: var(--ink);
  font-size: 16px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.01em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.shop-card__name.is-lg {
  font-size: 20px;
}

.shop-card__meta,
.shop-card__detail {
  color: var(--ink-3);
  font-size: 13px;
  line-height: 1.4;
}

.shop-card__meta {
  font-weight: 700;
  color: var(--ink-2);
}

.shop-card__detail {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== Precio + botón ===== */
.shop-card__foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding-top: 10px;
}

.shop-card__price {
  min-width: 0;
}

.shop-card__amount {
  font-size: 30px;
}

.shop-card__sub {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  margin-top: 6px;
}

.shop-card__usd {
  color: var(--ink-3);
  font-size: 12px;
  font-weight: 600;
}

.shop-card__add {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--brand-50);
  color: var(--brand);
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.shop-card:hover .shop-card__add {
  background: var(--brand);
  color: #fff;
  transform: rotate(90deg);
}

/* ===== Móvil: dos columnas ===== */
@media (max-width: 767px) {
  .shop-card {
    padding: 6px;
    border-radius: 18px;
  }

  .shop-card__art {
    border-radius: 13px;
  }

  .shop-card__body {
    padding: 10px 6px 4px;
  }

  .shop-card__name {
    font-size: 14px;
  }

  .shop-card__name.is-lg {
    font-size: 17px;
  }

  .shop-card__meta,
  .shop-card__detail {
    font-size: 12px;
  }

  .shop-card__amount {
    font-size: 25px;
  }

  .shop-card__add {
    width: 32px;
    height: 32px;
  }

  .shop-card__add svg {
    width: 16px;
    height: 16px;
  }

  .shop-card__usd {
    font-size: 11px;
  }
}
</style>
