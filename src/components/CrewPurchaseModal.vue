<template>
  <BaseModal :open="isOpen" :label="crew?.label" @close="closeModal">
    <template v-if="crew">
      <div class="sheet-art" :style="{ '--rar': rarityColor(crew.rarity) }">
        <img :src="crew.imageUrl" :alt="crew.label" />
      </div>

      <div class="sheet-body">
        <div class="sheet-head">
          <span class="sheet-kicker">👑 Fortnite Crew</span>
          <h2 class="sheet-title">{{ crew.name }}</h2>
        </div>

        <!-- Precios -->
        <div class="sheet-price">
          <span class="price-tag">${{ crew.mxn }}<small>{{ t('mxn') }}</small></span>
          <div class="sheet-price-sub">
            <span>${{ crew.usd }} {{ t('usd') }}</span>
          </div>
        </div>

        <!-- Instrucciones de Xbox -->
        <div class="crew-steps">
          <h3 class="crew-steps-title">{{ t('activacionTitulo') }}</h3>
          <ol>
            <li>
              <strong>{{ t('activacionPaso1') }}</strong>
              {{ t('activacionPaso1Text') }}
            </li>
            <li>
              <strong>{{ t('activacionPaso2') }}</strong>
              {{ t('activacionPaso2Text') }}
            </li>
            <li>
              <strong>{{ t('activacionPaso3') }}</strong>
              {{ t('activacionPaso3Text') }}
            </li>
          </ol>
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
  crew: {
    type: Object,
    default: null
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
.crew-steps {
  padding: 16px 18px;
  border-radius: var(--r-md);
  background: var(--sun-50);
}

.crew-steps-title {
  margin-bottom: 12px;
  font-size: 14px;
  letter-spacing: 0.01em;
}

.crew-steps ol {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.crew-steps li {
  position: relative;
  padding-left: 14px;
  border-left: 3px solid var(--sun);
  color: var(--ink-2);
  font-size: 14px;
  line-height: 1.5;
}

.crew-steps strong {
  display: block;
  color: var(--ink);
}
</style>
