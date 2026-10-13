<template>
  <BaseModal :open="isOpen" :label="cosmetic?.name" @close="closeModal">
    <template v-if="cosmetic">
      <div class="sheet-art" :class="{ 'is-cover': isCosmetic }" :style="{ '--rar': rarityColor(cosmetic.rarity) }">
        <img :src="cosmetic.imageUrl" :alt="cosmetic.name" />
      </div>

      <div class="sheet-body">
        <div class="sheet-head">
          <span v-if="cosmetic.type && cosmetic.type !== 'default'" class="sheet-kicker">{{ cosmetic.type }}</span>
          <h2 class="sheet-title">{{ cosmetic.name }}</h2>
        </div>

        <!-- Precios -->
        <div class="sheet-price">
          <span class="price-tag">${{ cosmetic.mxn || calculatePriceMXN(cosmetic.price) }}<small>{{ t('mxn') }}</small></span>
          <div class="sheet-price-sub">
            <span v-if="cosmetic.price > 0" class="vb-chip">
              <VbucksIcon :size="16" />
              {{ cosmetic.price.toLocaleString('es-MX') }}
            </span>
            <span>${{ cosmetic.usd || calculatePriceUSD(cosmetic.price) }} {{ t('usd') }}</span>
          </div>
        </div>

        <!-- Mensaje de cuenta -->
        <div v-if="customAccountMessage" class="notice">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
          <p>{{ customAccountMessage }}</p>
        </div>
        <div v-else class="notice">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z" /></svg>
          <p>{{ t('accountMsg') }} <a :href="ADD_FRIENDS_URL" target="_blank" rel="noopener noreferrer">{{ t('hazloAqui') }}</a></p>
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
import { computed } from 'vue';
import BaseModal from './BaseModal.vue';
import VbucksIcon from './VbucksIcon.vue';
import { useReactiveLanguage } from '../utils/useLanguage';
import { calculatePriceMXN, calculatePriceUSD } from '../utils/pricing';
import { rarityColor } from '../utils/rarity';
import { ADD_FRIENDS_URL } from '../config';

const { t } = useReactiveLanguage();

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  cosmetic: {
    type: Object,
    default: null
  },
  customAccountMessage: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'add-to-cart']);

// Los cosméticos de la API traen arte a sangre; pases y pavos son iconos con fondo transparente
const isCosmetic = computed(() => Boolean(props.cosmetic?.offerId));

const closeModal = () => {
  emit('close');
};

const addToCart = () => {
  emit('add-to-cart', props.cosmetic);
  closeModal();
};
</script>
