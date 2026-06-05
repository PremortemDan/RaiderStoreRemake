<template>
  <div class="cosmetic-card" :class="`rarity-${cosmetic.rarity?.toLowerCase()}`" @click="$emit('select', cosmetic)">
    <div class="cosmetic-header">
      <img :src="cosmetic.imageUrl" :alt="cosmetic.name" class="cosmetic-image"/>
      <div v-if="cosmetic.isNew" class="badge-new">¡NUEVO!</div>
    </div>
    
    <div class="cosmetic-content">
      <h3 class="cosmetic-name">{{ cosmetic.name }}</h3>
      
      <div class="cosmetic-price">
        <div class="price-container">
          <div class="vbucks-row">
            <svg class="pavos-icon" width="20" height="20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="80" fill="white"/>
              <path d="M65 75 L88 135 H112 L135 75 H115 L100 115 L85 75 Z" fill="#003B8D"/>
            </svg>
            <span class="vbucks-value">{{ cosmetic.price }} V-Bucks</span>
          </div>
          <div class="price-converted">
            <span class="converted-price">${{ calculatePriceMXN(cosmetic.price) }} MXN</span>
            <span class="converted-price">${{ calculatePriceUSD(cosmetic.price) }} USD</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  cosmetic: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);

// Conversión: 100 V-Bucks = 7.5 MXN
const calculatePriceMXN = (vbucks) => {
  return ((vbucks / 100) * 7.5).toFixed(2);
};

// Conversión: 100 V-Bucks = 0.45 USD
const calculatePriceUSD = (vbucks) => {
  return ((vbucks / 100) * 0.45).toFixed(2);
};
</script>

<style scoped>
.cosmetic-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Rarezas */
.cosmetic-card.rarity-common {
  background: linear-gradient(180deg, #2a2a2a, #4a4a4a 100%);
}
.cosmetic-card.rarity-uncommon {
  background: linear-gradient(180deg, #3D1A00, #8B3A00 100%);
}
.cosmetic-card.rarity-rare {
  background: linear-gradient(180deg, #3D1000, #DC2F02 100%);
}
.cosmetic-card.rarity-epic {
  background: linear-gradient(180deg, #FF8C00, #D35400 100%);
}
.cosmetic-card.rarity-legendary {
  background: linear-gradient(180deg, #7B3F00, #FF6B00 100%);
}
.cosmetic-card.rarity-mythic {
  background: linear-gradient(180deg, #5C2E00, #CC5500 100%);
}

.cosmetic-card:hover {
  box-shadow: 0px 0px 0px 3px rgb(255, 255, 255);
  transform: translateY(-8px);
}

.cosmetic-header {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: transparent;
}

.cosmetic-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
  box-sizing: border-box;
}

.badge-new {
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

.cosmetic-content {
  padding: 16px 20px 20px 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.cosmetic-name {
  margin: 0 0 6px 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  line-height: 1.2;
}

.cosmetic-price {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 107, 0, 0.3);
  margin-top: auto;
}

.price-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.vbucks-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pavos-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.vbucks-value {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.price-converted {
  display: flex;
  gap: 12px;
  font-size: 14px;
}

.converted-price {
  color: #e0e0e0;
  font-weight: 600;
  font-size: 22px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

@media (max-width: 1023px) {
  .cosmetic-header {
    height: 180px;
  }

  .cosmetic-name {
    font-size: 16px;
  }

  .vbucks-value {
    font-size: 18px;
  }

  .converted-price {
    font-size: 16px;
  }
}

@media (max-width: 767px) {
  .cosmetic-header {
    height: 140px;
  }

  .cosmetic-content {
    padding: 12px 15px;
  }

  .cosmetic-name {
    font-size: 12px;
  }

  .vbucks-value {
    font-size: 14px;
  }

  .pavos-icon {
    width: 16px;
    height: 16px;
  }

  .converted-price {
    font-size: 11px;
  }

  .badge-new {
    font-size: 8px;
    padding: 3px 8px;
    top: 6px;
    right: 6px;
  }
}
</style>