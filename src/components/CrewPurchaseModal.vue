<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-btn" @click="closeModal">✕</button>
      
      <div class="modal-body">
        <!-- Imagen del Crew -->
        <div class="product-image">
          <img :src="crew.imageUrl" :alt="crew.label" />
        </div>

        <!-- Información del Crew -->
        <div class="product-info">
          
          <!-- Precios -->
          <div class="prices-section">
            <div class="price-row">
              <span class="price-label">MXN:</span>
              <span class="price-value">${{ crew.mxn }}</span>
            </div>
            <div class="price-row">
              <span class="price-label">USD:</span>
              <span class="price-value">${{ crew.usd }}</span>
            </div>
          </div>

          <!-- Instrucciones de Xbox -->
          <div class="instructions-section">
            <h3 class="instructions-title">ACTIVACIÓN DEL CLUB DE FORTNITE 👑</h3>
            <p class="instructions-step"><strong>Paso 1. El Requisito:</strong> Necesitamos el acceso a tu cuenta de Xbox principal.</p>
            <p class="instructions-step"><strong>Paso 2. ¿No tienes cuenta de Xbox?</strong> No te preocupes. Solo crea una cuenta de Xbox gratuita y vincúlala a tu cuenta actual de Epic Games.</p>
            <p class="instructions-step"><strong>Paso 3. Nosotros hacemos la activación y listo.</strong> ¡Los beneficios te servirán para todas las plataformas (PC, PS, Switch o Celular)!</p>
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
  crew: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'add-to-cart']);

const closeModal = () => {
  emit('close');
};

const addToCart = () => {
  emit('add-to-cart', props.crew);
  closeModal();
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
  border-radius: 20px;
  padding: 40px;
  max-width: 550px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.1);
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
  max-width: 180px;
  max-height: 180px;
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
  font-size: 24px;
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

.price-value {
  color: #FF8C00;
  font-weight: 700;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.instructions-section {
  background: rgba(255, 140, 0, 0.1);
  border: 1px solid rgba(255, 140, 0, 0.3);
  padding: 16px;
  border-radius: 10px;
}

.instructions-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 700;
  color: #FFB347;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.instructions-step {
  margin: 0;
  color: #e0e0e0;
  font-size: 14px;
  line-height: 1.6;
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
  }

  .modal-body {
    gap: 16px;
  }

  .product-name {
    font-size: 18px;
  }

  .product-image img {
    max-width: 120px;
    max-height: 120px;
  }

  .instructions-list li {
    font-size: 12px;
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