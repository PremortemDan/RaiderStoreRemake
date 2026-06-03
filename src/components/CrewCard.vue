<template>
  <div class="crew-card" :class="`rarity-${crew.rarity}`" @click="$emit('select', crew)">
    <div class="crew-header">
      <img :src="crew.imageUrl" :alt="crew.label" class="crew-image"/>
    </div>
    
    <div class="crew-content">
      <h3 class="crew-name">{{ crew.name }}</h3>
      <p class="crew-label">{{ crew.label }}</p>
      
      <div class="crew-price">
        <div class="price-container">
          <div class="price-converted">
            <span class="converted-price">${{ crew.mxn }} MXN</span>
            <span class="converted-price">${{ crew.usd }} USD</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  crew: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);
</script>

<style scoped>
.crew-card {
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

/* Rarezas */
.crew-card.rarity-common {
  background: linear-gradient(180deg, #2a2a2a, #4a4a4a 100%);
}
.crew-card.rarity-uncommon {
  background: linear-gradient(180deg, #3D1A00, #8B3A00 100%);
}
.crew-card.rarity-rare {
  background: linear-gradient(180deg, #3D1000, #DC2F02 100%);
}
.crew-card.rarity-epic {
  background: linear-gradient(180deg, #FF8C00, #D35400 100%);
}
.crew-card.rarity-legendary {
  background: linear-gradient(180deg, #7B3F00, #FF6B00 100%);
}
.crew-card.rarity-mythic {
  background: linear-gradient(180deg, #5C2E00, #CC5500 100%);
}

.crew-card:hover {
  box-shadow: 0px 0px 0px 3px rgb(255, 255, 255);
  transform: translateY(-8px);
}

.crew-header {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: transparent;
}

.crew-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
  box-sizing: border-box;
}

.crew-content {
  padding: 16px 20px 20px 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.crew-name {
  margin: 0 0 6px 0;
  color: #ffffff;
  font-size: 22px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.crew-label {
  margin: 0 0 15px 0;
  color: #b0b0b0;
  font-size: 14px;
}

.crew-price {
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

.price-converted {
  display: flex;
  gap: 12px;
  font-size: 14px;
}

.converted-price {
  color: #e0e0e0;
  font-weight: 600;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

@media (max-width: 1023px) {
  .crew-card {
    grid-column: span 3;
  }
  
  .crew-header {
    height: 180px;
  }

  .crew-name {
    font-size: 18px;
  }
}

@media (max-width: 767px) {
  .crew-card {
    grid-column: span 3;
  }
  
  .crew-header {
    height: 140px;
  }

  .crew-content {
    padding: 12px 15px;
  }

  .crew-name {
    font-size: 16px;
  }

  .crew-label {
    font-size: 12px;
  }

  .converted-price {
    font-size: 12px;
  }
}
</style>