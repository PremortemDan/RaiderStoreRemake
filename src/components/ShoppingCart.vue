<template>
  <div v-if="isOpen" class="cart-overlay" @click="closeCart">
    <div class="cart-panel" @click.stop>
      <div class="cart-header">
        <h2>{{ t('carritoCompras') }}</h2>
        <button class="close-btn" @click="closeCart">✕</button>
      </div>

      <div class="cart-content">
        <div v-if="items.length === 0" class="empty-cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p>{{ t('carritoVacio') }}</p>
        </div>

        <div v-else class="cart-items">
          <div v-for="(item, index) in items" :key="index" class="cart-item">
            <img :src="item.imageUrl" :alt="item.name" class="item-image" />
            <div class="item-details">
              <h4 class="item-name">{{ item.name }}</h4>
              <div class="item-prices">
                <span v-if="item.price > 0" class="item-price">
                  <svg class="pavos-icon" width="16" height="16" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="80" fill="white"/>
                    <path d="M65 75 L88 135 H112 L135 75 H115 L100 115 L85 75 Z" fill="#003B8D"/> </svg>
                  {{ item.price }}
                </span>
                <span class="item-mxn">${{ item.mxn || calculatePriceMXN(item.price) }} {{ t('mxn') }}</span>
                <span class="item-usd">${{ item.usd || calculatePriceUSD(item.price) }} {{ t('usd') }}</span>
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
          <div v-if="totalVbucks > 0" class="total-row">
            <span>{{ t('totalVbucks') }}</span>
            <span class="total-vbucks">{{ totalVbucks }}</span>
          </div>
          <div class="total-row">
            <span>{{ t('totalMxn') }}</span>
            <span class="total-mxn">${{ totalMXN.toFixed(2) }}</span>
          </div>
          <div class="total-row">
            <span>{{ t('totalUsd') }}</span>
            <span class="total-usd">${{ totalUSD.toFixed(2) }}</span>
          </div>
        </div>
        <button class="checkout-btn" @click="showCheckout = true">{{ t('procederPago') }}</button>
      </div>
    </div>

    <!-- Modal de Checkout -->
    <CheckoutModal
      :isOpen="showCheckout"
      :items="items"
      @close="showCheckout = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CheckoutModal from './CheckoutModal.vue';
import { useReactiveLanguage } from '../utils/useLanguage';
import { calculatePriceMXN, calculatePriceUSD, sumVbucks, sumMXN, sumUSD } from '../utils/pricing';

const { t } = useReactiveLanguage();

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
const showCheckout = ref(false);

const closeCart = () => {
  emit('close');
};

const removeItem = (index) => {
  emit('remove-item', index);
};

const totalVbucks = computed(() => sumVbucks(props.items));
const totalMXN = computed(() => sumMXN(props.items));
const totalUSD = computed(() => sumUSD(props.items));
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
  background: var(--modal-bg);
  display: flex;
  flex-direction: column;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
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
  font-size: 28px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 28px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
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
  font-size: 20px;
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
  object-fit: contain;
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
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
}

.item-prices {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 16px;
}

.item-price {
  color: var(--raider);
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

.item-usd {
  color: #ffb066;
  font-size: 15px;
}

.remove-btn {
  background: rgba(255, 0, 0, 0.2);
  border: 1px solid rgba(255, 0, 0, 0.3);
  color: #ff6b6b;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
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
  font-size: 18px;
  font-weight: 600;
}

.total-vbucks {
  color: var(--raider);
}

.total-mxn {
  color: #ffb066;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.total-usd {
  color: #ffb066;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.checkout-btn {
  background: var(--grad-brand);
  color: var(--ink-on-brand);
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  transition: all 0.3s ease;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 122, 26, 0.4);
}

@media (max-width: 768px) {
  .cart-panel {
    max-width: 100%;
  }

  .cart-header h2 {
    font-size: 24px;
  }

  .cart-content {
    padding: 16px;
  }

  .cart-footer {
    padding: 16px;
  }

  .item-image {
    width: 70px;
    height: 90px;
  }

  .item-name {
    font-size: 17px;
  }

  .item-prices {
    font-size: 15px;
  }

  .total-row {
    font-size: 17px;
  }

  .checkout-btn {
    padding: 12px;
    font-size: 18px;
  }

  .close-btn {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .cart-panel {
    max-width: 100%;
  }

  .cart-header h2 {
    font-size: 22px;
  }

  .cart-content {
    padding: 12px;
  }

  .cart-footer {
    padding: 12px;
  }

  .cart-item {
    gap: 10px;
    padding: 10px;
  }

  .item-image {
    width: 60px;
    height: 80px;
  }

  .item-name {
    font-size: 16px;
  }

  .item-prices {
    font-size: 14px;
  }

  .total-section {
    padding: 12px;
  }

  .total-row {
    font-size: 16px;
  }

  .checkout-btn {
    padding: 10px;
    font-size: 17px;
  }

  .remove-btn {
    width: 28px;
    height: 28px;
  }

  .empty-cart p {
    font-size: 18px;
  }
}
</style>