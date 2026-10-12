<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-btn" @click="closeModal">✕</button>
      
      <div class="modal-body">
        <!-- Imagen del producto -->
        <div class="product-image">
          <img :src="other.imageUrl" :alt="other.name" />
        </div>

        <!-- Información del producto -->
        <div class="product-info">
          <h2 class="product-name">{{ other.name }}</h2>

          <!-- Meta: dispositivos y duración -->
          <div class="product-meta">
            <span class="meta-item">{{ formatDispositivos(other.dispositivos) }}</span>
            <span class="meta-separator">•</span>
            <span class="meta-item">{{ formatDuracion(other.dias) }}</span>
          </div>

          <!-- Precios -->
          <div class="prices-section">
            <div class="price-row">
              <span class="price-label">{{ t('mxn') }}:</span>
              <span class="price-value">${{ other.mxn }}</span>
            </div>

            <div class="price-row">
              <span class="price-label">{{ t('usd') }}:</span>
              <span class="price-value">${{ other.usd }}</span>
            </div>
          </div>

          <!-- Instrucciones -->
          <div class="instructions-message">
            <p>{{ other.instrucciones }}</p>
          </div>

          <!-- Botones de acción -->
          <div class="action-buttons">
            <button class="btn btn-primary" @click="addToCart">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {{ t('anadirCarrito') }}
            </button>
            <button class="btn btn-secondary" @click="closeModal">
              {{ t('cancelar') }}
            </button>
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
    required: true
  },
  other: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'add-to-cart']);

const closeModal = () => {
  emit('close');
};

const addToCart = () => {
  emit('add-to-cart', props.other);
  closeModal();
};

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
  background: var(--modal-bg);
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image img {
  max-width: 200px;
  max-height: 250px;
  object-fit: contain;
  border-radius: 12px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-name {
  margin: 0;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #ffb066;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.product-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #e0e0e0;
  font-weight: 600;
  font-size: 18px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.meta-separator {
  color: var(--raider);
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
  color: #ffb066;
  font-size: 30px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.price-value {
  color: var(--raider);
  font-weight: 700;
  font-size: 30px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.instructions-message {
  background: rgba(255, 122, 26, 0.1);
  border: 1px solid rgba(255, 122, 26, 0.3);
  padding: 12px;
  border-radius: 8px;
  font-size: 20px;
  color: #e0e0e0;
  line-height: 1.5;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.instructions-message p {
  margin: 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  padding: 14px 24px;
  font-size: 20px;
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
  background: var(--grad-brand);
  color: var(--ink-on-brand);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 122, 26, 0.4);
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

  .product-meta {
    font-size: 15px;
  }

  .price-row {
    font-size: 20px;
  }

  .price-label {
    font-size: 20px;
  }

  .price-value {
    font-size: 20px;
  }

  .instructions-message {
    font-size: 18px;
    padding: 10px;
  }

  .btn {
    padding: 12px 16px;
    font-size: 16px;
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
