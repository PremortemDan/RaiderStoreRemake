<template>
  <BaseModal :open="isOpen" :label="other?.name" @close="closeModal">
    <template v-if="other">
      <div class="sheet-art" :style="{ '--rar': rarityColor(other.rarity) }">
        <img :src="other.imageUrl" :alt="other.name" />
      </div>

      <div class="sheet-body">
        <div class="sheet-head">
          <h2 class="sheet-title">{{ other.name }}</h2>
          <!-- Meta: dispositivos y duración -->
          <div class="meta">
            <span v-if="other.dispositivos" class="sheet-kicker">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>
              {{ formatDispositivos(other.dispositivos) }}
            </span>
            <span v-if="other.dias" class="sheet-kicker">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
              {{ formatDuracion(other.dias) }}
            </span>
          </div>
        </div>

        <!-- Precios -->
        <div class="sheet-price">
          <span class="price-tag">${{ other.mxn }}<small>{{ t('mxn') }}</small></span>
          <div class="sheet-price-sub">
            <span>${{ other.usd }} {{ t('usd') }}</span>
          </div>
        </div>

        <!-- Instrucciones -->
        <div v-if="other.instrucciones" class="notice">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
          <p>{{ other.instrucciones }}</p>
        </div>

        <!-- Botones de acción -->
        <div class="sheet-actions">
          <button type="button" class="btn btn-primary" @click="addToCart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
            {{ t('anadirCarrito') }}
          </button>
          <button type="button" class="btn btn-ghost" @click="closeModal">
            {{ t('cancelar') }}
          </button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';
import { useReactiveLanguage } from '../utils/useLanguage';
import { rarityColor } from '../utils/rarity';

const { t } = useReactiveLanguage();

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  other: {
    type: Object,
    default: null
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
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
