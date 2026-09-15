<template>
  <div class="others-card" :class="`rarity-${other.rarity}`" @click="$emit('select', other)">
    <div class="others-header">
      <img :src="other.imageUrl" :alt="other.name" class="others-image"/>
    </div>
    
    <div class="others-content">
      <h3 class="others-name">{{ other.name }}</h3>
      
      <div class="others-meta">
        <span class="meta-item">{{ formatDispositivos(other.dispositivos) }}</span>
        <span class="meta-separator">•</span>
        <span class="meta-item">{{ formatDuracion(other.dias) }}</span>
      </div>
      
      <div class="others-price">
        <div class="price-container">
          <div class="price-converted">
            <span class="converted-price">${{ other.mxn }} MXN</span>
            <span class="converted-price">${{ other.usd }} USD</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useReactiveLanguage } from '../utils/useLanguage';

defineProps({
  other: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);

const { t } = useReactiveLanguage();

const formatDispositivos = (n) => {
  if (!n) return '';
  return n === 1 ? `1 ${t('dispositivo')}` : `${n} ${t('dispositivos')}`;
};

const formatDuracion = (dias) => {
  if (!dias) return '';
  if (dias <= 30) return `${dias} ${t('dias')}`;
  const meses = dias / 30;
  const valor = Number.isInteger(meses) ? meses : Number(meses.toFixed(1));
  return `${valor} ${t('meses')}`;
};
</script>

<style scoped>
.others-card {
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
.others-card.rarity-common {
  background: linear-gradient(180deg, #2a2a2a, #4a4a4a 100%);
}
.others-card.rarity-uncommon {
  background: linear-gradient(180deg, #3D1A00, #8B3A00 100%);
}
.others-card.rarity-rare {
  background: linear-gradient(180deg, #3D1000, #DC2F02 100%);
}
.others-card.rarity-epic {
  background: linear-gradient(180deg, #FF8C00, #D35400 100%);
}
.others-card.rarity-legendary {
  background: linear-gradient(180deg, #7B3F00, #FF6B00 100%);
}
.others-card.rarity-mythic {
  background: linear-gradient(180deg, #5C2E00, #CC5500 100%);
}

.others-card:hover {
  box-shadow: 0px 0px 0px 3px rgb(255, 255, 255);
  transform: translateY(-8px);
}

.others-header {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: transparent;
}

.others-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
  box-sizing: border-box;
}

.others-content {
  padding: 16px 20px 20px 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.others-name {
  margin: 0 0 6px 0;
  color: #ffffff;
  font-size: 36px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.others-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e0e0e0;
  font-weight: 600;
  font-size: 20px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  margin-bottom: 6px;
}

.meta-separator {
  color: #FF8C00;
}

.others-price {
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
  .others-header {
    height: 180px;
  }

  .others-name {
    font-size: 18px;
  }
}

@media (max-width: 767px) {
  .others-header {
    height: 140px;
  }

  .others-content {
    padding: 12px 15px;
  }

  .others-name {
    font-size: 16px;
  }

  .others-meta {
    font-size: 13px;
  }

  .converted-price {
    font-size: 14px;
  }
}
</style>
