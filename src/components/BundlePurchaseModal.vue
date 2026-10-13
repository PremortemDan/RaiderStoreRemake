<template>
  <BaseModal :open="isOpen" :label="bundle?.name" @close="closeModal">
    <template v-if="bundle">
      <div class="sheet-art is-cover" :style="{ '--rar': rarityColor(highestRarity(bundle.items)) }">
        <img :src="bundle.imageUrl" :alt="bundle.name" />
      </div>

      <div class="sheet-body">
        <div class="sheet-head">
          <span class="sheet-kicker">Pack · {{ bundle.items.length }} {{ t('itemsIncluidos').replace(':', '') }}</span>
          <h2 class="sheet-title">{{ bundle.name }}</h2>
        </div>

        <!-- Items incluidos -->
        <ul class="bundle-items">
          <li v-for="(item, index) in visibleItems" :key="`${item.name}-${index}`" :style="{ '--rar': rarityColor(item.rarity) }">
            <span class="dot"></span>
            {{ item.name }}
          </li>
          <li v-if="hiddenCount > 0" class="more">
            <button type="button" @click="showAll = true">+{{ hiddenCount }} más</button>
          </li>
        </ul>

        <!-- Precios -->
        <div class="sheet-price">
          <span class="price-tag">${{ calculatePriceMXN(bundle.price) }}<small>{{ t('mxn') }}</small></span>
          <div class="sheet-price-sub">
            <span class="vb-chip">
              <VbucksIcon :size="16" />
              {{ bundle.price.toLocaleString('es-MX') }}
            </span>
            <span>${{ calculatePriceUSD(bundle.price) }} {{ t('usd') }}</span>
          </div>
        </div>

        <!-- Mensaje de cuenta -->
        <div class="notice">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z" /></svg>
          <p>{{ t('accountMsg') }} <a :href="ADD_FRIENDS_URL" target="_blank" rel="noopener noreferrer">{{ t('hazloAqui') }}</a></p>
        </div>

        <!-- Botones de acción -->
        <div class="sheet-actions">
          <button type="button" class="btn btn-primary" @click="addToCart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
            {{ t('agregarCarrito') }}
          </button>
          <button type="button" class="btn btn-ghost" @click="closeModal">{{ t('cerrar') }}</button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import VbucksIcon from './VbucksIcon.vue';
import { useReactiveLanguage } from '../utils/useLanguage';
import { calculatePriceMXN, calculatePriceUSD } from '../utils/pricing';
import { rarityColor, highestRarity } from '../utils/rarity';
import { ADD_FRIENDS_URL } from '../config';

const { t } = useReactiveLanguage();

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  bundle: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'add-to-cart']);

// Los packs grandes traen hasta ~20 artículos: se muestran los primeros y el resto bajo demanda
const MAX_VISIBLE_ITEMS = 8;
const showAll = ref(false);
const items = computed(() => props.bundle?.items || []);
const visibleItems = computed(() => (showAll.value ? items.value : items.value.slice(0, MAX_VISIBLE_ITEMS)));
const hiddenCount = computed(() => items.value.length - visibleItems.value.length);

watch(() => props.bundle, () => {
  showAll.value = false;
});

const closeModal = () => {
  emit('close');
};

const addToCart = () => {
  emit('add-to-cart', props.bundle);
  closeModal();
};
</script>

<style scoped>
.bundle-items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.bundle-items li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 11px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--rar) 12%, white);
  color: var(--ink);
  font-size: 13px;
  font-weight: 700;
}

.bundle-items .more {
  padding: 0;
  background: none;
}

.bundle-items .more button {
  height: 100%;
  padding: 6px 12px;
  border: 1px dashed var(--line-strong);
  border-radius: 999px;
  background: var(--surface);
  color: var(--brand);
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.bundle-items .more button:hover {
  border-color: var(--brand);
}

.bundle-items .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--rar);
}
</style>
