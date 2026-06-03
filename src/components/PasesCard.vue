<template>
  <div class="pases-card-wrapper" @click="selectPase">
    <div class="pases-card" :class="`rarity-${pase.rarity}`">
      <div class="card-image-container">
        <img :src="pase.imageUrl" :alt="pase.name" :class="{
          'card-image': pase.type === 'outfit',
          'card-image-small': pase.type !== 'outfit'
        }" />
        <h3 class="card-title">{{ pase.name }}</h3>
        <div class="price-badge">
          <svg class="pavos-icon" width="24" height="24" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="white"/>
            <path d="M65 75 L88 135 H112 L135 75 H115 L100 115 L85 75 Z" fill="#003B8D"/>
          </svg>
          {{ pase.price }}
        </div>
        <div class="fade-image" :class="`rarity-${pase.rarity}`"></div>
      </div>
    </div>
    <div class="price-info">
      <div class="price-row">
        <span class="currency-label">MXN:</span>
        <span class="price-value">${{ pase.mxn }}</span>
      </div>
      <div class="price-row">
        <span class="currency-label">USD:</span>
        <span class="price-value">${{ pase.usd }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pase: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['select']);

const selectPase = () => {
  emit('select', props.pase);
};
</script>

<style scoped>
.pases-card-wrapper {
  cursor: pointer;
  user-select: none;
}

.pases-card {
  border-radius: 15px;
  overflow: visible;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
}

.pases-card:hover {
  box-shadow: 0px 0px 0px 3px rgb(255, 255, 255);
}

/* Rarezas - mismos colores que CosmeticCard */
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

.card-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 0.6;
  overflow: hidden;
  background: rgba(250, 0, 0, 0);
  margin-top: -70px;
  margin-left: 0px;
  margin-right: -16px;
  padding-top: -15px;
  padding-left: 0;
  padding-right: 0;
}

.card-image {
  width: 140%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  margin-left: -23%;
}

.card-image-small {
  width: 140%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  margin-left: -23%;
  transform: scale(0.55);
}

.pases-card:hover .card-image {
  transform: scale(1.05);
}

.pases-card:hover .card-image-small {
  transform: scale(0.60);
}

.price-badge {
  position: absolute;
  bottom: 8px;
  left: 0px;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 2;
}

.pavos-icon {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
}

.fade-image {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #DC2F02);
  z-index: 1;
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
}

.fade-image.rarity-common {
  background: linear-gradient(180deg, #2a2a2a00, #4a4a4a 100%);
}
.fade-image.rarity-uncommon {
  background: linear-gradient(180deg, #3D1A0000, #8B3A00 100%);
}
.fade-image.rarity-rare {
  background: linear-gradient(180deg, #3D100000, #DC2F02 100%);
}
.fade-image.rarity-epic {
  background: linear-gradient(180deg, #FF8C0000, #D35400 100%);
}
.fade-image.rarity-legendary {
  background: linear-gradient(180deg, #7B3F0000, #FF6B00 100%);
}
.fade-image.rarity-mythic {
  background: linear-gradient(180deg, #5C2E0000, #CC5500 100%);
}

.card-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #f3f4f6;
  line-height: 1.3;
  
  position: absolute;
  bottom: 35px;
  left: 12px;
  right: 12px;
  
  z-index: 2;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-type {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Estilos para el wrapper y precio */
.pases-card-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
  font-size: large;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.05em;
}

.price-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 35px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1;
}

.currency-label {
  font-weight: 700;
  min-width: 40px;
  color: #f3f4f6;
}

.price-value {
  color: #ffffff;
  font-weight: 700;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

/* ========== MÓVIL ========== */
@media (max-width: 767px) {
  .pases-card {
    border-radius: 6px;
  }

  .card-image-container {
    margin-top: -28px;
    margin-right: -6px;
    aspect-ratio: 0.6;
  }

  .card-image {
    width: 150%;
    margin-left: -25%;
  }
  .card-image-small {
    width: 150%;
    margin-left: -25%;
    transform: scale(0.7);
  }

  .pases-card:hover .card-image {
    transform: scale(1.03);
  }
  .pases-card:hover .card-image-small {
    transform: scale(0.73);
  }

  .card-title {
    font-size: 7px;
    font-weight: 900;
    bottom: 18px;
    left: 4px;
    right: 4px;
    -webkit-line-clamp: 2;
    line-height: 1.2;
  }

  .price-badge {
    font-size: 7px;
    bottom: 0px;
    left: 0px;
    padding: 0px 3px;
    gap: 2px;
    align-items: left;
  }

  .pavos-icon {
    width: 10px;
    height: 10px;
    padding: 0px 0px 5px 0px;
  }

  .fade-image {
    height: 45%;
  }

  .price-row {
    font-size: 12px;
    line-height: 0.6;
  }

  .currency-label {
    min-width: 30px;
  }
}
</style>