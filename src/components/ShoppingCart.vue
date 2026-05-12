<template>
  <div v-if="isOpen" class="cart-overlay" @click="closeCart">
    <div class="cart-panel" @click.stop>
      <div class="cart-header">
        <h2>Carrito de Compras</h2>
        <button class="close-btn" @click="closeCart">✕</button>
      </div>

      <div class="cart-content">
        <div v-if="items.length === 0" class="empty-cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p>Tu carrito está vacío</p>
        </div>

        <div v-else class="cart-items">
          <div v-for="(item, index) in items" :key="index" class="cart-item">
            <img :src="item.imageUrl" :alt="item.name" class="item-image" />
            <div class="item-details">
              <h4 class="item-name">{{ item.name }}</h4>
              <div class="item-prices">
                <span class="item-price">
                  <svg class="pavos-icon" width="16" height="16" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="80" fill="white"/>
                    <path d="M65 75 L88 135 H112 L135 75 H115 L100 115 L85 75 Z" fill="#003B8D"/> </svg>
                  {{ item.price }}
                </span>
                <span class="item-mxn">${{ calculatePriceMXN(item.price) }} MXN</span>
              </div>
            </div>
            <button class="remove-btn" @click="removeItem(index)">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="items.length > 0" class="cart-footer">
        <div class="total-section">
          <div class="total-row">
            <span>Total V-Bucks:</span>
            <span class="total-vbucks">{{ totalVbucks }}</span>
          </div>
          <div class="total-row">
            <span>Total MXN:</span>
            <span class="total-mxn">${{ totalMXN }}</span>
          </div>
          <div class="total-row">
            <span>Total USD:</span>
            <span class="total-usd">${{ totalUSD }}</span>
          </div>
        </div>
        <button class="checkout-btn">Proceder al Pago</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  items: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'remove-item']);

const closeCart = () => {
  emit('close');
};

const removeItem = (index) => {
  emit('remove-item', index);
};

const calculatePriceMXN = (vbucks) => {
  return ((vbucks / 100) * 7.5).toFixed(2);
};

const calculatePriceUSD = (vbucks) => {
  return ((vbucks / 100) * 0.45).toFixed(2);
};

const totalVbucks = computed(() => {
  return props.items.reduce((sum, item) => sum + item.price, 0);
});

const totalMXN = computed(() => {
  return calculatePriceMXN(totalVbucks.value);
});

const totalUSD = computed(() => {
  return calculatePriceUSD(totalVbucks.value);
});
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
  backdrop-filter: blur(4px);
}

.cart-panel {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  max-width: 400px;
  background: linear-gradient(135deg, #04154D 0%, #0771B8 100%);
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.3s ease-out;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cart-header h2 {
  margin: 0;
  color: #ffffff;
  font-size: 24px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  gap: 16px;
}

.empty-cart svg {
  opacity: 0.5;
}

.empty-cart p {
  margin: 0;
  font-size: 16px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: flex;
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.item-image {
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-name {
  margin: 0;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
}

.item-prices {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
}

.item-price {
  color: #FFD700;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
}

.pavos-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.item-mxn {
  color: rgba(255, 255, 255, 0.7);
}

.remove-btn {
  background: rgba(255, 0, 0, 0.2);
  border: 1px solid rgba(255, 0, 0, 0.3);
  color: #ff6b6b;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: rgba(255, 0, 0, 0.3);
  transform: scale(1.1);
}

.cart-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.total-section {
  background: rgba(0, 0, 0, 0.2);
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
}

.total-vbucks {
  color: #FFD700;
}

.total-mxn {
  color: #90ee90;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.total-usd {
  color: #87ceeb;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.checkout-btn {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #000000;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  transition: all 0.3s ease;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.4);
}

@media (max-width: 768px) {
  .cart-panel {
    max-width: 100%;
  }
}
</style>
