<template>
  <div class="bundle-card" @click="$emit('select', bundle)">
    <div class="bundle-header">
      <img :src="bundle.imageUrl" :alt="bundle.name" class="bundle-image"/>
      <div class="bundle-badge">PACK</div>
    </div>
    
    <div class="bundle-content">
      <h3 class="bundle-name">{{ bundle.name }}</h3>
      
      <div class="bundle-items">
        <p class="items-count">{{ bundle.items.length }} items incluidos:</p>
        <ul class="items-list">
          <li v-for="item in bundle.items" :key="item.name" class="item-name">
            {{ item.name }}
          </li>
        </ul>
      </div>
      
      <div class="bundle-price">
        <span class="price-label">Precio Bundle:</span>
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
defineProps({
  bundle: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);

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
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #aa3bff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.bundle-card:hover {
  border-color: #c084fc;
  box-shadow: 0 0 30px rgba(170, 59, 255, 0.6);
  transform: translateY(-8px);
}

.bundle-header {
  position: relative;
  width: 100%;
  height: 320px;
  overflow: hidden;
  background: #0f3460;
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
  background: linear-gradient(135deg, #aa3bff, #c084fc);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(170, 59, 255, 0.4);
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
}

.bundle-items {
  flex-grow: 1;
  margin-bottom: 15px;
}

.items-count {
  margin: 0 0 10px 0;
  color: #aa3bff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
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
  color: #aa3bff;
  font-weight: 700;
}

.bundle-price {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 15px;
  border-top: 1px solid rgba(170, 59, 255, 0.3);
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
  background: linear-gradient(135deg, #aa3bff, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 24px;
  font-weight: 700;
}

.price-converted {
  display: flex;
  gap: 12px;
  font-size: 13px;
}

.converted-price {
  color: #e0e0e0;
  font-weight: 600;
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
