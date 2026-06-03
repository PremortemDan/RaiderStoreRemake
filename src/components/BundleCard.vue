<template>
  <div class="bundle-card" :class="`rarity-${bundleRarity}`" @click="$emit('select', bundle)">
    <div class="bundle-header">
      <img :src="bundle.imageUrl" :alt="bundle.name" class="bundle-image"/>
      <div class="bundle-badge">PACK</div>
    </div>
    
    <div class="bundle-content">
      <h3 class="bundle-name">{{ bundle.name }}</h3>
      
      <div class="bundle-items">
        <ul class="items-list">
          <li v-for="item in bundle.items" :key="item.name" class="item-name">
            {{ item.name }}
          </li>
        </ul>
      </div>
      
      <div class="bundle-price">
        <div class="price-container">
          <span class="price-value">{{ bundle.price }} V-Bucks</span>
          <div class="price-converted">
            <span class="converted-price">${{ formatPrice(convertToMXN(bundle.price)) }} MXN</span>
            <span class="converted-price">${{ formatPrice(convertToUSD(bundle.price)) }} USD</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  bundle: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);

// Calcular rareza del bundle basada en el item más raro
const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

const bundleRarity = computed(() => {
  if (!props.bundle.items || props.bundle.items.length === 0) return 'rare';
  
  let highestRarity = 'common';
  let highestIndex = 0;
  
  props.bundle.items.forEach(item => {
    const rarity = (item.rarity || 'common').toLowerCase();
    const index = rarityOrder.indexOf(rarity);
    if (index > highestIndex) {
      highestIndex = index;
      highestRarity = rarity;
    }
  });
  
  return highestRarity;
});

// Tasas de conversión: 100 vbucks = 7.5 MXN = 0.45 USD
const convertToMXN = (vbucks) => {
  return (vbucks / 100) * 7.5;
};

const convertToUSD = (vbucks) => {
  return (vbucks / 100) * 0.45;
};

const formatPrice = (price) => {
  return price.toFixed(2);
};
</script>

<style scoped>
.bundle-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Rarezas - mismos colores que CosmeticCard */
.bundle-card.rarity-common {
  background: linear-gradient(180deg, #2a2a2a, #4a4a4a 100%);
}
.bundle-card.rarity-uncommon {
  background: linear-gradient(180deg, #3D1A00, #8B3A00 100%);
}
.bundle-card.rarity-rare {
  background: linear-gradient(180deg, #3D1000, #DC2F02 100%);
}
.bundle-card.rarity-epic {
  background: linear-gradient(180deg, #FF8C00, #D35400 100%);
}
.bundle-card.rarity-legendary {
  background: linear-gradient(180deg, #7B3F00, #FF6B00 100%);
}
.bundle-card.rarity-mythic {
  background: linear-gradient(180deg, #5C2E00, #CC5500 100%);
}

.bundle-card:hover {
  box-shadow: 0px 0px 0px 3px rgb(255, 255, 255);
  transform: translateY(-8px);
}

.bundle-header {
  position: relative;
  width: 100%;
  height: 320px;
  overflow: hidden;
  background: transparent;
}

.bundle-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top; /* Ancla la imagen a la parte superior */
}

.bundle-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #FF9F1C;
  color: rgb(0, 0, 0);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  text-transform: uppercase;
  transform: skewX(-10deg) rotate(0deg);
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.bundle-content {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.bundle-name {
  margin: 0 0 15px 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.bundle-items {
  flex-grow: 1;
  margin-bottom: 15px;
}


.items-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap; /* Permite que se creen las filas necesarias */
  gap: 6px;
}

.items-list li {
  white-space: nowrap; /* Evita que el nombre del item dé un salto de línea interno */
}
.item-name {
  color: #e0e0e0;
  font-size: 12px;
  padding-left: 15px;
  position: relative;
}

.item-name::before {
  content: "→";
  position: absolute;
  left: 0;
  color: #FF6B00;
  font-weight: 700;
}

.bundle-price {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 107, 0, 0.3);
}

.price-label {
  color: #b0b0b0;
  font-size: 12px;
  font-weight: 600;
}

.price-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.price-value {
  background: linear-gradient(180deg, #ffffff, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 24px;
  font-weight: 700;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.price-converted {
  display: flex;
  gap: 12px;
  font-size: 13px;
}

.converted-price {
  color: #e0e0e0;
  font-weight: 600;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

@media (max-width: 1023px) {
  .bundle-card {
    grid-column: span 3;
  }
  
  .bundle-header {
    height: 200px;
  }

  .bundle-name {
    font-size: 16px;
  }

  .item-name {
    font-size: 11px;
  }
}

@media (max-width: 767px) {
  .bundle-card {
    grid-column: span 3;
  }
  
  .bundle-header {
    height: 150px;
  }

  .bundle-content {
    padding: 15px;
  }

  .bundle-name {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .items-count {
    font-size: 11px;
  }

  .item-name {
    font-size: 10px;
  }

  .price-value {
    font-size: 20px;
  }
}
</style>
