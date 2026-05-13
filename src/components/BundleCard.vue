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
        <span class="price-value">{{ bundle.price }}</span>
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
  grid-column: span 3;
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
  height: 250px;
  overflow: hidden;
  background: #0f3460;
}

.bundle-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  flex-direction: column;
  gap: 6px;
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
  align-items: center;
  justify-content: space-between;
  padding-top: 15px;
  border-top: 1px solid rgba(170, 59, 255, 0.3);
}

.price-label {
  color: #b0b0b0;
  font-size: 12px;
  font-weight: 600;
}

.price-value {
  background: linear-gradient(135deg, #aa3bff, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 24px;
  font-weight: 700;
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
