<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-btn" @click="closeModal">✕</button>
      
      <div class="modal-body">
        <!-- Imagen del bundle -->
        <div class="product-image">
          <img :src="bundle.imageUrl" :alt="bundle.name" />
        </div>

        <!-- Información del bundle -->
        <div class="product-info">
          <h2 class="product-name">{{ bundle.name }}</h2>
          
          <!-- Items incluidos -->
          <div class="bundle-items-section">
            <h3 class="items-title">{{ bundle.items.length }} {{ t('itemsIncluidos') }}</h3>
            <p class="items-line">
              <span v-for="(item, index) in bundle.items" :key="item.name">
                {{ item.name }}<span v-if="index < bundle.items.length - 1">, </span>
              </span>
            </p>
          </div>
          
          <!-- Precios -->
          <div class="prices-section">
            <div class="price-row">
              <span class="price-label">{{ t('precioVbucks') }}:</span>
              <div class="price-display">
                <svg class="pavos-icon" width="20" height="20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="80" fill="white"/>
                  <path d="M65 75 L88 135 H112 L135 75 H115 L100 115 L85 75 Z" fill="#003B8D"/> </svg>
                <span>{{ bundle.price }}</span>
              </div>
            </div>

            <div class="price-row">
              <span class="price-label">{{ t('mxn') }}:</span>
              <span class="price-value">${{ calculatePriceMXN(bundle.price) }}</span>
            </div>

            <div class="price-row">
              <span class="price-label">{{ t('usd') }}:</span>
              <span class="price-value">${{ calculatePriceUSD(bundle.price) }}</span>
            </div>
          </div>

          <!-- Mensaje de cuenta -->
          <div class="account-message">
            <p>{{ t('accountMsg') }} <a href="https://epiclim.cloud/agregar/k8352buX_cNBqCqr3rFd7g" target="_blank" class="account-link">{{ t('hazloAqui') }}</a></p>
          </div>

          <!-- Botones de acción -->
          <div class="action-buttons">
            <button class="btn btn-primary" @click="addToCart">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              {{ t('agregarCarrito') }}
            </button>
            <button class="btn btn-secondary" @click="closeModal">{{ t('cerrar') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useReactiveLanguage } from '../utils/useLanguage';

const { t } = useReactiveLanguage();

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  bundle: {
    type: Object,
    default: () => ({
      items: [],
      imageUrl: '',
      name: '',
      price: 0
    })
  }
});

const emit = defineEmits(['close', 'add-to-cart']);

const closeModal = () => {
  emit('close');
};

const addToCart = () => {
  emit('add-to-cart', props.bundle);
  closeModal();
};

const calculatePriceMXN = (vbucks) => {
  return (vbucks * (7.5 / 100)).toFixed(2);
};

const calculatePriceUSD = (vbucks) => {
  return (vbucks * (0.45 / 100)).toFixed(2);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: linear-gradient(180deg, #4A1800, #E85D04 100%);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  padding: 40px;
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-image {
  text-align: center;
}

.product-image img {
  max-width: 100%;
  max-height: 250px;
  object-fit: contain;
  border-radius: 10px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-name {
  margin: 0;
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  text-align: center;
}

.bundle-items-section {
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 8px;
  border-left: 3px solid #FF7B00;
}

.items-title {
  margin: 0 0 12px 0;
  color: #FF7B00;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.items-line {
  margin: 0;
  color: #e0e0e0;
  font-size: 14px;
  line-height: 1.6;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.prices-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 15px;
  background: rgba(255, 107, 0, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 0, 0.3);
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  font-size: 14px;
}

.price-label {
  font-weight: 600;
  color: #b0b0b0;
}

.price-display {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.pavos-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 59, 141, 0.6));
}

.price-value {
  color: #ffffff;
  font-weight: 700;
  font-size: 16px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.account-message {
  background: rgba(255, 140, 0, 0.1);
  border: 1px solid rgba(255, 140, 0, 0.3);
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #e0e0e0;
  line-height: 1.5;
}

.account-message p {
  margin: 0;
  color: #d0d0d0;
  font-size: 12px;
  line-height: 1.5;
}

.account-link {
  color: #FF8C00;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.account-link:hover {
  color: #FFA500;
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.btn-primary {
  background: linear-gradient(135deg, #FF8C00 0%, #D35400 100%);
  color: #ffffff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 140, 0, 0.5);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 107, 0, 0.1);
  border-color: #FF7B00;
  color: #FF7B00;
}

@media (max-width: 768px) {
  .modal-content {
    padding: 20px;
    max-width: 100%;
    width: 95%;
  }

  .modal-body {
    gap: 16px;
  }

  .product-name {
    font-size: 20px;
  }

  .product-image img {
    max-height: 200px;
  }

  .btn {
    padding: 12px 16px;
    font-size: 14px;
  }

  .close-btn {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }
}
</style>