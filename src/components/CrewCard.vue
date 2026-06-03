<template>
  <div class="crew-card-wrapper" @click="selectCrew">
    <div class="crew-card" :class="`rarity-${crew.rarity}`">
      <div class="card-inner">
        <div class="image-container">
          <img :src="crew.imageUrl" :alt="crew.label" class="card-image" />
        </div>
        <div class="months-big">{{ crew.name }}</div>
        <div class="price-tag">
          <span class="price-label">{{ crew.label }}</span>
        </div>
        <div class="conversion-row">
          <div class="conversion-item">
            <span class="currency-label">MXN</span>
            <span class="currency-value">${{ crew.mxn }}</span>
          </div>
          <div class="conversion-item">
            <span class="currency-label">USD</span>
            <span class="currency-value">${{ crew.usd }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  crew: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['select']);

const selectCrew = () => {
  emit('select', props.crew);
};
</script>

<style scoped>
.crew-card-wrapper {
  cursor: pointer;
  user-select: none;
}

.crew-card {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.crew-card:hover {
  box-shadow: 0px 0px 0px 3px rgb(255, 255, 255);
  transform: translateY(-4px);
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

.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0;
}

.card-image {
  width: 90px;
  height: 90px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
  transition: transform 0.3s ease;
}

.crew-card:hover .card-image {
  transform: scale(1.1);
}

.card-inner {
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  flex: 1;
  min-height: 220px;
}

.months-big {
  font-size: 100px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  letter-spacing: -3px;
}

.price-tag {
  display: flex;
  align-items: center;
}

.price-label {
  font-size: 18px;
  font-weight: 700;
  color: #FFB347;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.conversion-row {
  display: flex;
  gap: 14px;
}

.conversion-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: rgba(0, 0, 0, 0.25);
  padding: 6px 16px;
  border-radius: 10px;
  min-width: 85px;
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
  font-size: 19px;
  font-weight: 700;
  color: #ffffff;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

/* ========== MÓVIL ========== */
@media (max-width: 767px) {
  .crew-card {
    border-radius: 10px;
  }

  .card-inner {
    padding: 16px 10px;
    gap: 10px;
    min-height: 150px;
  }

  .months-big {
    font-size: 50px;
    letter-spacing: -1px;
  }

  .price-label {
    font-size: 12px;
  }

  .conversion-row {
    gap: 8px;
  }

  .conversion-item {
    padding: 4px 10px;
    min-width: 60px;
    border-radius: 6px;
  }

  .currency-label {
    font-size: 8px;
  }

  .currency-value {
    font-size: 14px;
  }
}
</style>