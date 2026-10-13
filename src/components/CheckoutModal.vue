<template>
  <BaseModal :open="isOpen" :label="t('confirmarCompra')" size="md" @close="closeModal">
    <div class="checkout">
      <header class="checkout-head">
        <span class="checkout-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8" /><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9" /></svg>
        </span>
        <div>
          <h2 class="checkout-title">{{ t('confirmarCompra') }}</h2>
          <p class="checkout-sub">Revisa tu pedido y lo terminamos por WhatsApp.</p>
        </div>
      </header>

      <!-- Lista de productos -->
      <section class="summary">
        <h3 class="summary-title">{{ t('resumenCompra') }}</h3>
        <ul class="summary-list">
          <li v-for="(item, index) in items" :key="index" class="summary-item">
            <span class="summary-name">{{ item.name }}</span>
            <span v-if="item.price > 0" class="vb-chip"><VbucksIcon :size="13" />{{ item.price.toLocaleString('es-MX') }}</span>
            <span class="summary-price">${{ item.mxn || calculatePriceMXN(item.price) }}</span>
          </li>
        </ul>

        <!-- Total -->
        <dl class="summary-totals">
          <div v-if="totalVbucks > 0" class="total-row">
            <dt>{{ t('totalVbucks').replace(':', '') }}</dt>
            <dd>{{ totalVbucks.toLocaleString('es-MX') }}</dd>
          </div>
          <div class="total-row">
            <dt>{{ t('totalUsd').replace(':', '') }}</dt>
            <dd>${{ totalUSD }}</dd>
          </div>
          <div class="total-row is-main">
            <dt>{{ t('total') }}</dt>
            <dd class="price-tag">${{ totalMXN }}<small>{{ t('mxn') }}</small></dd>
          </div>
        </dl>
      </section>

      <!-- Campo de usuario (no se muestra si el carrito solo tiene artículos de "otros") -->
      <div v-if="!onlyOtros" class="field">
        <label for="username" class="field-label">{{ t('escribeUsuario') }}</label>
        <div class="field-input">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="off"
            :placeholder="t('placeholderUsuario')"
          />
        </div>
      </div>

      <!-- Mensaje importante - Bundles, Cosméticos, Pases -->
      <div v-if="hasBundleOrCosmeticOrPases" class="notice notice--warn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2 21h20L12 3z" /><path d="M12 10v4M12 17h.01" /></svg>
        <p>
          {{ t('importantes') }}
          <a :href="ADD_FRIENDS_URL" target="_blank" rel="noopener noreferrer">{{ t('hazloAqui') }}</a>
        </p>
      </div>

      <!-- Mensaje para Pavos -->
      <div v-if="hasPavos" class="notice">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
        <p>{{ t('checkoutMsgPavos') }}</p>
      </div>

      <!-- Mensaje para Crew -->
      <div v-if="hasCrew" class="notice">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
        <p>{{ t('checkoutMsgCrew') }}</p>
      </div>

      <!-- Checkbox de confirmación (solo si hay bundles, cosméticos o pases) -->
      <label v-if="hasBundleOrCosmeticOrPases" class="check" :class="{ on: friendsAdded }">
        <input v-model="friendsAdded" type="checkbox" />
        <span class="check-box" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7" /></svg>
        </span>
        <span>{{ t('siHeAnadido') }}</span>
      </label>

      <div v-if="phoneError" class="notice notice--danger" role="alert">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
        <p>No se pudo abrir WhatsApp: falta configurar el número de contacto de la tienda.</p>
      </div>

      <!-- Botones de acción -->
      <div class="checkout-actions">
        <button
          type="button"
          class="btn btn-whatsapp btn-block"
          @click="proceedToWhatsApp"
          :disabled="(!onlyOtros && !username.trim()) || (hasBundleOrCosmeticOrPases && !friendsAdded)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z" /></svg>
          {{ t('confirmarBtn') }}
        </button>
        <button type="button" class="btn btn-ghost btn-block" @click="closeModal">
          {{ t('cancelar') }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useReactiveLanguage } from '../utils/useLanguage';
import { calculatePriceMXN, calculatePriceUSD, sumVbucks, sumMXN, sumUSD } from '../utils/pricing';
import { WHATSAPP_PHONE, ADD_FRIENDS_URL } from '../config';
import BaseModal from './BaseModal.vue';
import VbucksIcon from './VbucksIcon.vue';

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

const emit = defineEmits(['close']);

const username = ref('');
const friendsAdded = ref(false);

const closeModal = () => {
  username.value = '';
  friendsAdded.value = false;
  phoneError.value = false;
  emit('close');
};

const totalVbucks = computed(() => sumVbucks(props.items));
const totalMXN = computed(() => sumMXN(props.items).toFixed(2));
const totalUSD = computed(() => sumUSD(props.items).toFixed(2));

// Aviso si falta el número de WhatsApp (antes se usaba un número de ejemplo)
const phoneError = ref(false);

// Detectar tipos de items en el carrito
const hasBundleOrCosmeticOrPases = computed(() => {
  return props.items.some(item => {
    // Bundle: tiene array 'items'
    if (item.items && Array.isArray(item.items)) return true;
    // Excluir recargas y crew por su id
    const id = item.id || '';
    if (id.startsWith('recarga-')) return false;
    if (id.startsWith('crew-')) return false;
    if (id.startsWith('otros-')) return false;
    // El resto: PasesCard (type: 'default' + id no recarga/crew) o CosmeticCard (type: 'Outfit', 'Emote', etc.)
    return true;
  });
});

const hasPavos = computed(() => {
  return props.items.some(item => (item.id || '').startsWith('recarga-'));
});

const hasCrew = computed(() => {
  return props.items.some(item => (item.id || '').startsWith('crew-'));
});

// Indica si el carrito contiene EXCLUSIVAMENTE artículos de "otros"
const onlyOtros = computed(() => {
  return props.items.length > 0 && props.items.every(item => (item.id || '').startsWith('otros-'));
});

const proceedToWhatsApp = () => {
  // Si hay bundles/cosméticos/pases, requiere username y checkbox
  if (hasBundleOrCosmeticOrPases.value && (!username.value.trim() || !friendsAdded.value)) {
    return;
  }
  // Si hay pavos, crew u otros tipos (no exclusivamente "otros"), requiere username
  if (!onlyOtros.value && !username.value.trim()) {
    return;
  }

  // Construir mensaje de WhatsApp
  let message = `${t('msjWhatsApp')}\n\n`;
  message += `*${t('msjProductos')}*\n`;
  
  props.items.forEach((item) => {
    const mxn = item.mxn || calculatePriceMXN(item.price);
    const usd = item.usd || calculatePriceUSD(item.price);
    message += `• ${item.name}\n`;
    if (item.price > 0) {
      message += `  💙 ${item.price} ${t('msjVbucks')} | $${mxn} ${t('mxn')} | $${usd} ${t('usd')}\n\n`;
    } else {
      message += `  💵 $${mxn} ${t('mxn')} | $${usd} ${t('usd')}\n\n`;
    }
  });

  message += `*${t('msjTotales')}*\n`;
  if (totalVbucks.value > 0) {
    message += `💙 ${t('msjVbucks')} ${totalVbucks.value}\n`;
  }
  message += `💵 ${t('mxn')}: $${totalMXN.value}\n`;
  message += `💵 ${t('usd')}: $${totalUSD.value}\n\n`;
  // El usuario Epic solo aplica si el carrito no es exclusivamente de "otros"
  if (!onlyOtros.value) {
    message += `*${t('msjUsuarioEpic')}* ${username.value}\n`;
    message += `*${t('msjCuentaAnadida')}*`;
  }

  // El número viene de VITE_WHATSAPP_PHONE. Sin número no se abre WhatsApp:
  // antes caía a un número de ejemplo y el pedido llegaba a un desconocido.
  if (!WHATSAPP_PHONE) {
    phoneError.value = true;
    return;
  }
  phoneError.value = false;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank', 'noopener');
  
  // Cerrar modal
  closeModal();
};
</script>

<style scoped>
.checkout {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 26px 26px 24px;
}

.checkout-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-right: 44px;
}

.checkout-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: var(--brand-50);
  color: var(--brand);
}

.checkout-title {
  font-size: 22px;
}

.checkout-sub {
  margin-top: 2px;
  color: var(--ink-3);
  font-size: 14px;
}

.summary {
  padding: 16px;
  border-radius: var(--r-md);
  background: var(--surface-2);
  border: 1px solid var(--line);
}

.summary-title {
  margin-bottom: 10px;
  color: var(--ink-3);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.summary-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--ink);
  font-weight: 700;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.summary-price {
  min-width: 56px;
  color: var(--ink);
  font-weight: 800;
  text-align: right;
}

.summary-totals {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 14px 0 0;
  padding-top: 12px;
  border-top: 1px dashed var(--line-strong);
}

.total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--ink-3);
  font-size: 14px;
  font-weight: 600;
}

.total-row dd {
  margin: 0;
}

.total-row.is-main {
  color: var(--ink);
  font-weight: 800;
}

.total-row.is-main .price-tag {
  font-size: 32px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  color: var(--ink);
  font-size: 14px;
  font-weight: 800;
}

.field-input {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 16px;
  border: 2px solid var(--line);
  border-radius: var(--r-md);
  background: var(--surface);
  color: var(--ink-3);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field-input:focus-within {
  border-color: var(--brand);
  box-shadow: 0 0 0 4px var(--brand-50);
  color: var(--brand);
}

.field-input input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--ink);
  font-size: 16px;
  font-weight: 600;
  outline: none;
}

.field-input input::placeholder {
  color: var(--ink-3);
  font-weight: 500;
}

/* Casilla de confirmación */
.check {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 2px solid var(--line);
  border-radius: var(--r-md);
  color: var(--ink);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.check.on {
  border-color: var(--mint);
  background: var(--mint-50);
}

.check input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.check-box {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 2px solid var(--line-strong);
  border-radius: 7px;
  background: var(--surface);
  color: transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.check.on .check-box {
  border-color: var(--mint);
  background: var(--mint);
  color: #fff;
}

.check:has(input:focus-visible) {
  outline: 3px solid var(--brand);
  outline-offset: 2px;
}

.checkout-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 600px) {
  .checkout {
    padding: 22px 18px 20px;
    gap: 14px;
  }

  .checkout-icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
  }

  .checkout-title {
    font-size: 20px;
  }
}
</style>
