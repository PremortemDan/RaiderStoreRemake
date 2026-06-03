<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-btn" @click="closeModal">✕</button>
      
      <div class="modal-body">
        <h2 class="modal-title">Confirmar Compra</h2>
        
        <!-- Lista de productos -->
        <div class="products-summary">
          <h3>Resumen de Compra</h3>
          <div class="products-list">
            <div v-for="(item, index) in items" :key="index" class="product-summary-item">
              <span class="product-name">{{ item.name }}</span>
              <div class="product-prices">
                <span class="vbucks-price">
                  <svg class="pavos-icon" width="14" height="14" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="80" fill="white"/>
                    <path d="M65 75 L88 135 H112 L135 75 H115 L100 115 L85 75 Z" fill="#003B8D"/> 
                  </svg>
                  {{ item.price }}
                </span>
                <span class="real-price">${{ calculatePriceMXN(item.price) }} MXN</span>
                <span class="real-price-usd">${{ calculatePriceUSD(item.price) }} USD</span>
              </div>
            </div>
          </div>
          
          <!-- Total -->
          <div class="total-summary">
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
        </div>

        <!-- Campo de usuario -->
        <div class="username-section">
          <label for="username" class="username-label">Escribe tu usuario:</label>
          <input 
            id="username"
            v-model="username" 
            type="text" 
            class="username-input" 
            placeholder="Tu nombre de usuario..."
          />
        </div>

        <!-- Mensaje importante -->
        <div class="important-message">
          <p>
            IMPORTANTE debes añadir de amigo las cuentas de RaiderStore a tu usuario. Si aun no lo has hecho,
            <a href="https://epiclim.cloud/agregar/k8352buX_cNBqCqr3rFd7g" target="_blank" class="add-friend-link">
              hazlo aquí
            </a>
          </p>
        </div>

        <!-- Checkbox de confirmación -->
        <div class="checkbox-section">
          <label class="checkbox-label">
            <input v-model="friendsAdded" type="checkbox" class="checkbox-input" />
            <span>Sí he añadido de amigo las cuentas de RaiderStore (RSPAVOS)</span>
          </label>
        </div>

        <!-- Botones de acción -->
        <div class="action-buttons">
          <button 
            class="btn btn-confirm" 
            @click="proceedToWhatsApp"
            :disabled="!username.trim() || !friendsAdded"
          >
            Confirmar Compra
          </button>
          <button class="btn btn-cancel" @click="closeModal">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

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

const emit = defineEmits(['close']);

const username = ref('');
const friendsAdded = ref(false);

const closeModal = () => {
  username.value = '';
  friendsAdded.value = false;
  emit('close');
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

const proceedToWhatsApp = () => {
  if (!username.value.trim() || !friendsAdded.value) {
    return;
  }

  // Construir mensaje de WhatsApp
  let message = `Hola, deseo realizar una compra en RaiderStore:\n\n`;
  message += `*PRODUCTOS:*\n`;
  
  props.items.forEach((item) => {
    const mxn = calculatePriceMXN(item.price);
    const usd = calculatePriceUSD(item.price);
    message += `• ${item.name}\n`;
    message += `  💙 ${item.price} V-Bucks | $${mxn} MXN | $${usd} USD\n\n`;
  });

  message += `*TOTALES:*\n`;
  message += `💙 V-Bucks: ${totalVbucks.value}\n`;
  message += `💵 MXN: $${totalMXN.value}\n`;
  message += `💵 USD: $${totalUSD.value}\n\n`;
  message += `*Usuario Epic Games:* ${username.value}\n`;
  message += `*Cuenta añadida:* Sí ✓`;

  // Obtener número de teléfono desde .env
  const phoneNumber = import.meta.env.VITE_WHATSAPP_PHONE || '5215512345678';
  
  // Codificar mensaje para URL
  const encodedMessage = encodeURIComponent(message);
  
  // Redirigir a WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
  
  // Cerrar modal
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
  z-index: 1001;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: linear-gradient(135deg, #4A1800 0%, #E85D04 100%);
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
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

.modal-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  text-align: center;
}

.products-summary {
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.products-summary h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 700;
  color: #FF8C00;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  max-height: 200px;
  overflow-y: auto;
}

.product-summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid #FF8C00;
}

.product-name {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  flex: 1;
}

.product-prices {
  display: flex;
  gap: 12px;
  align-items: center;
}

.vbucks-price {
  color: #FF8C00;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}

.pavos-icon {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

.real-price {
  color: #FFB347;
  font-size: 13px;
  font-weight: 700;
}

.real-price-usd {
  color: #FFCC80;
  font-size: 13px;
  font-weight: 700;
}

.total-summary {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.total-vbucks {
  color: #FF8C00;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.total-mxn {
  color: #FFB347;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.total-usd {
  color: #FFCC80;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.username-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.username-label {
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
}

.username-input {
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-size: 14px;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.username-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.username-input:focus {
  outline: none;
  border-color: #FF8C00;
  box-shadow: 0 0 10px rgba(255, 140, 0, 0.3);
}

.important-message {
  background: rgba(255, 140, 0, 0.1);
  border: 1px solid rgba(255, 140, 0, 0.3);
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #e0e0e0;
  line-height: 1.6;
}

.add-friend-link {
  color: #FF8C00;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease;
}

.add-friend-link:hover {
  text-decoration: underline;
  color: #FFA500;
}

.checkbox-section {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #FF8C00;
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
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.btn-confirm {
  background: linear-gradient(135deg, #FF8C00 0%, #D35400 100%);
  color: #ffffff;
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 140, 0, 0.4);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .modal-content {
    padding: 20px;
    max-width: 100%;
    width: 95%;
    max-height: 95vh;
  }

  .modal-body {
    gap: 16px;
  }

  .modal-title {
    font-size: 22px;
  }

  .products-summary h3 {
    font-size: 16px;
  }

  .products-list {
    max-height: 150px;
    gap: 10px;
  }

  .product-summary-item {
    padding: 8px;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .product-prices {
    width: 100%;
    flex-wrap: wrap;
    gap: 8px;
  }

  .username-input {
    font-size: 13px;
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

  .checkbox-label {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    padding: 16px;
    width: 100%;
    margin: 10px;
  }

  .modal-title {
    font-size: 20px;
  }

  .products-summary h3 {
    font-size: 14px;
  }

  .products-list {
    max-height: 120px;
  }

  .product-name {
    font-size: 12px;
  }

  .product-prices {
    font-size: 11px;
  }

  .username-label {
    font-size: 12px;
  }

  .username-input {
    font-size: 12px;
    padding: 8px;
  }

  .important-message {
    font-size: 11px;
    padding: 8px;
  }

  .checkbox-label {
    font-size: 11px;
    gap: 8px;
  }

  .checkbox-input {
    width: 16px;
    height: 16px;
  }

  .btn {
    padding: 10px 12px;
    font-size: 12px;
  }

  .total-row {
    font-size: 12px;
  }
}
</style>
