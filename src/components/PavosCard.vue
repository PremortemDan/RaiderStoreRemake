<template>
  <div class="pavos-card" :class="`rarity-${pavos.rarity}`" @click="$emit('select', pavos)">
    <div class="pavos-header">
      <img :src="pavos.imageUrl" :alt="pavos.name" class="pavos-image"/>
    </div>
    
    <div class="pavos-content">
      <h3 class="pavos-name">{{ pavos.name }}</h3>
      
      <div class="pavos-price">
        <div class="price-container">
          <div class="price-converted">
            <span class="converted-price">${{ pavos.mxn }} MXN</span>
            <span class="converted-price">${{ pavos.usd }} USD</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  pavos: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);
</script>

<style scoped>
.pavos-card {
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
.pavos-card.rarity-common {
  background: linear-gradient(180deg, #2a2a2a, #4a4a4a 100%);
}
.pavos-card.rarity-uncommon {
  background: linear-gradient(180deg, #3D1A00, #8B3A00 100%);
}
.pavos-card.rarity-rare {
  background: linear-gradient(180deg, #3D1000, #DC2F02 100%);
}
.pavos-card.rarity-epic {
  background: linear-gradient(180deg, #FF8C00, #D35400 100%);
}
.pavos-card.rarity-legendary {
  background: linear-gradient(180deg, #7B3F00, #FF6B00 100%);
}
.pavos-card.rarity-mythic {
  background: linear-gradient(180deg, #5C2E00, #CC5500 100%);
}

.pavos-card:hover {
  box-shadow: 0px 0px 0px 3px rgb(255, 255, 255);
  transform: translateY(-8px);
}

.pavos-header {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: transparent;
}

.pavos-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
  box-sizing: border-box;
}

.pavos-content {
  padding: 16px 20px 20px 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.pavos-name {
  margin: 0 0 6px 0;
  color: #ffffff;
  font-size: 36px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.pavos-price {
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
  font-size: 30px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

@media (max-width: 1023px) {
  .pavos-header {
    height: 180px;
  }

  .pavos-name {
    font-size: 18px;
  }
}

@media (max-width: 767px) {
  .pavos-header {
    height: 140px;
  }

  .pavos-content {
    padding: 12px 15px;
  }

  .pavos-name {
    font-size: 16px;
  }

  .converted-price {
    font-size: 14px;
  }
}
</style>