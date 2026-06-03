<template>
  <div class="pases-card" :class="`rarity-${pase.rarity}`" @click="$emit('select', pase)">
    <div class="pases-header">
      <img :src="pase.imageUrl" :alt="pase.name" class="pases-image"/>
    </div>
    
    <div class="pases-content">
      <h3 class="pases-name">{{ pase.name }}</h3>
      
      <div class="pases-price">
        <div class="price-container">
          <div class="vbucks-row">
            <svg class="pavos-icon" width="20" height="20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="80" fill="white"/>
              <path d="M65 75 L88 135 H112 L135 75 H115 L100 115 L85 75 Z" fill="#003B8D"/>
            </svg>
            <span class="vbucks-value">{{ pase.price }} V-Bucks</span>
          </div>
          <div class="price-converted">
            <span class="converted-price">${{ pase.mxn }} MXN</span>
            <span class="converted-price">${{ pase.usd }} USD</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  pase: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);
</script>

<style scoped>
.pases-card {
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
.pases-card.rarity-common {
  background: linear-gradient(180deg, #2a2a2a, #4a4a4a 100%);
}
.pases-card.rarity-uncommon {
  background: linear-gradient(180deg, #3D1A00, #8B3A00 100%);
}
.pases-card.rarity-rare {
  background: linear-gradient(180deg, #3D1000, #DC2F02 100%);
}
.pases-card.rarity-epic {
  background: linear-gradient(180deg, #FF8C00, #D35400 100%);
}
.pases-card.rarity-legendary {
  background: linear-gradient(180deg, #7B3F00, #FF6B00 100%);
}
.pases-card.rarity-mythic {
  background: linear-gradient(180deg, #5C2E00, #CC5500 100%);
}

.pases-card:hover {
  box-shadow: 0px 0px 0px 3px rgb(255, 255, 255);
  transform: translateY(-8px);
}

.pases-header {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: transparent;
}

.pases-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
  box-sizing: border-box;
}

.pases-content {
  padding: 16px 20px 20px 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.pases-name {
  margin: 0 0 6px 0;
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  line-height: 1.2;
}

.pases-price {
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
  .pases-header {
    height: 180px;
  }

  .pases-name {
    font-size: 18px;
  }

  .vbucks-value {
    font-size: 18px;
  }

  .converted-price {
    font-size: 16px;
  }
}

@media (max-width: 767px) {
  .pases-header {
    height: 140px;
  }

  .pases-content {
    padding: 12px 15px;
  }

  .pases-name {
    font-size: 14px;
  }

  .vbucks-value {
    font-size: 14px;
  }

  .pavos-icon {
    width: 16px;
    height: 16px;
  }

  .converted-price {
    font-size: 12px;
  }
}
</style>