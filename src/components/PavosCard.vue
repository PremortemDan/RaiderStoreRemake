<template>
  <div class="pavos-card-wrapper" @click="selectPavos">
    <div class="pavos-card" :class="`rarity-${pavos.rarity}`">
      <div class="card-inner">
        <div class="image-container">
          <img :src="pavos.imageUrl" :alt="pavos.name" class="card-image" />
        </div>
        <h3 class="card-title">{{ pavos.name }}</h3>
        <div class="prices-container">
          <div class="vbucks-row">
            <svg class="pavos-icon" width="20" height="20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="80" fill="white"/>
              <path d="M65 75 L88 135 H112 L135 75 H115 L100 115 L85 75 Z" fill="#003B8D"/>
            </svg>
            <span class="vbucks-value">{{ pavos.price }}</span>
          </div>
          <div class="conversion-row">
            <div class="conversion-item">
              <span class="currency-label">MXN</span>
              <span class="currency-value">${{ pavos.mxn }}</span>
            </div>
            <div class="conversion-item">
              <span class="currency-label">USD</span>
              <span class="currency-value">${{ pavos.usd }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pavos: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['select']);

const selectPavos = () => {
  emit('select', props.pavos);
};
</script>

<style scoped>
.pavos-card-wrapper {
  cursor: pointer;
  user-select: none;
}

.pavos-card {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.pavos-card:hover {
  box-shadow: 0px 0px 0px 3px rgb(255, 255, 255);
  transform: translateY(-4px);
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

.card-inner {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}

.card-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
  transition: transform 0.3s ease;
}

.pavos-card:hover .card-image {
  transform: scale(1.1);
}

.card-title {
  margin: 0;
  font-size: 24px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1.2;
  text-align: center;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.prices-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.vbucks-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pavos-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.vbucks-value {
  font-size: 26px;
  font-weight: 900;
  color: #ffffff;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.conversion-row {
  display: flex;
  gap: 12px;
}

.conversion-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: rgba(0, 0, 0, 0.25);
  padding: 6px 14px;
  border-radius: 10px;
  min-width: 80px;
}

.currency-label {
  font-size: 11px;
  font-weight: 700;
  color: #FFB347;
  text-transform: uppercase;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  letter-spacing: 1px;
}

.currency-value {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

/* ========== MÓVIL ========== */
@media (max-width: 767px) {
  .pavos-card {
    border-radius: 10px;
  }

  .card-inner {
    padding: 14px 10px;
    gap: 10px;
  }

  .card-image {
    width: 60px;
    height: 60px;
  }

  .card-title {
    font-size: 16px;
  }

  .vbucks-value {
    font-size: 18px;
  }

  .pavos-icon {
    width: 14px;
    height: 14px;
  }

  .conversion-row {
    gap: 8px;
  }

  .conversion-item {
    padding: 4px 8px;
    min-width: 60px;
    border-radius: 6px;
  }

  .currency-label {
    font-size: 8px;
  }

  .currency-value {
    font-size: 13px;
  }
}
</style>