<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-btn" @click="closeModal">✕</button>
      
      <div class="modal-body">
        <!-- Imagen del producto -->
        <div class="product-image">
          <img :src="cosmetic.imageUrl" :alt="cosmetic.name" />
        </div>

        <!-- Información del producto -->
        <div class="product-info">
          <h2 class="product-name">{{ cosmetic.name }}</h2>
          
          <!-- Precios -->
          <div class="prices-section">
            <div class="price-row">
              <span class="price-label">V-Bucks:</span>
              <div class="price-display">
                <svg class="pavos-icon" width="20" height="20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="80" fill="white"/>
                  <path d="M65 75 L88 135 H112 L135 75 H115 L100 115 L85 75 Z" fill="#003B8D"/> </svg>
                <span>{{ cosmetic.price }}</span>
              </div>
            </div>

            <div class="price-row">
              <span class="price-label">MXN:</span>
              <span class="price-value">${{ calculatePriceMXN(cosmetic.price) }}</span>
            </div>

            <div class="price-row">
              <span class="price-label">USD:</span>
              <span class="price-value">${{ calculatePriceUSD(cosmetic.price) }}</span>
            </div>
          </div>

          <!-- Mensaje de cuenta -->
          <div class="account-message">
            <p>¿Ya agregaste tu cuenta? Si aun no la has agregado <a href="https://epiclim.cloud/agregar/k8352buX_cNBqCqr3rFd7g" target="_blank" class="account-link">hazlo aquí</a></p>
          </div>

          <!-- Botones de acción -->
          <div class="action-buttons">
            <button class="btn btn-primary" @click="addToCart">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Añadir al carrito
            </button>
            <button class="btn btn-secondary" @click="closeModal">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  cosmetic: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'add-to-cart']);

const closeModal = () => {
  emit('close');
};

const addToCart = () => {
  emit('add-to-cart', props.cosmetic);
  closeModal();
};

const calculatePriceMXN = (vbucks) => {
  return ((vbucks / 100) * 7.5).toFixed(2);
};

const calculatePriceUSD = (vbucks) => {
  return ((vbucks / 100) * 0.45).toFixed(2);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: linear-gradient(135deg, #4A1800 0%, #E85D04 100%);
  border-radius: 12px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  position: relative;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
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
  max-width: 250px;
  max-height: 300px;
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
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  text-align: center;
}

.prices-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
  padding: 16px;
  border-radius: 10px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  font-size: 16px;
}

.price-label {
  font-weight: 600;
  color: #FFB347;
}

.price-display {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
}

.pavos-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.price-value {
  color: #FF8C00;
  font-weight: 700;
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

.account-link {
  color: #FF8C00;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease;
}

.account-link:hover {
  text-decoration: underline;
  color: #FFA500;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.btn-primary {
  background: linear-gradient(135deg, #FF8C00 0%, #D35400 100%);
  color: #ffffff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 140, 0, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .modal-content {
    padding: 20px;
    max-width: 100%;
    width: 95%;
    max-height: 95vh;
    overflow-y: auto;
  }

  .modal-body {
    gap: 16px;
  }

  .product-name {
    font-size: 20px;
  }

  .product-image img {
    max-width: 150px;
    max-height: 200px;
  }

  .price-row {
    font-size: 14px;
  }

  .price-label {
    font-size: 13px;
  }

  .price-value {
    font-size: 14px;
  }

  .account-message {
    font-size: 12px;
    padding: 10px;
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

@media (max-width: 480px) {
  .modal-content {
    padding: 16px;
    width: 100%;
    margin: 10px;
  }

  .product-name {
    font-size: 18px;
  }

  .product-image img {
    max-width: 120px;
    max-height: 160px;
  }

  .prices-section {
    gap: 10px;
    padding: 12px;
  }

  .price-row {
    font-size: 13px;
  }

  .btn {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
