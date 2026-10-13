<template>
  <Transition name="drawer">
    <div v-if="isOpen" class="cart-overlay" @click.self="closeCart">
      <aside class="cart-panel" role="dialog" aria-modal="true" :aria-label="t('carritoCompras')">
        <header class="cart-header">
          <div>
            <h2>{{ t('carritoCompras') }}</h2>
            <p class="cart-sub">{{ items.length }} {{ items.length === 1 ? 'artículo' : 'artículos' }}</p>
          </div>
          <button type="button" class="icon-btn" aria-label="Cerrar" @click="closeCart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </header>

        <div class="cart-content">
          <div v-if="items.length === 0" class="empty-cart">
            <span class="empty-emoji" aria-hidden="true">🛒</span>
            <p class="empty-title">{{ t('carritoVacio') }}</p>
            <p class="empty-text">Explora la tienda y agrega tus skins favoritas.</p>
            <button type="button" class="btn btn-primary" @click="closeCart">Ir a la tienda</button>
          </div>

          <TransitionGroup v-else tag="ul" name="list" class="cart-items">
            <li v-for="(item, index) in items" :key="`${item.offerId || item.id || item.name}-${index}`" class="cart-item">
              <div class="item-thumb" :style="{ '--rar': rarityColor(item.rarity) }">
                <img :src="item.imageUrl" :alt="item.name" />
              </div>
              <div class="item-details">
                <h4 class="item-name">{{ item.name }}</h4>
                <div class="item-prices">
                  <span class="price-tag item-mxn">${{ item.mxn || calculatePriceMXN(item.price) }}<small>{{ t('mxn') }}</small></span>
                  <span v-if="item.price > 0" class="vb-chip">
                    <VbucksIcon :size="14" />
                    {{ item.price.toLocaleString('es-MX') }}
                  </span>
                </div>
                <span class="item-usd">${{ item.usd || calculatePriceUSD(item.price) }} {{ t('usd') }}</span>
              </div>
              <button type="button" class="remove-btn" :aria-label="`Quitar ${item.name}`" @click="removeItem(index)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></svg>
              </button>
            </li>
          </TransitionGroup>
        </div>

        <footer v-if="items.length > 0" class="cart-footer">
          <dl class="totals">
            <div v-if="totalVbucks > 0" class="total-row">
              <dt>{{ t('totalVbucks').replace(':', '') }}</dt>
              <dd class="vb-chip"><VbucksIcon :size="14" />{{ totalVbucks.toLocaleString('es-MX') }}</dd>
            </div>
            <div class="total-row">
              <dt>{{ t('totalUsd').replace(':', '') }}</dt>
              <dd>${{ totalUSD.toFixed(2) }}</dd>
            </div>
            <div class="total-row is-main">
              <dt>{{ t('total') }}</dt>
              <dd class="price-tag">${{ totalMXN.toFixed(2) }}<small>{{ t('mxn') }}</small></dd>
            </div>
          </dl>
          <button type="button" class="btn btn-primary btn-block" @click="showCheckout = true">
            {{ t('procederPago') }}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </footer>
      </aside>

      <!-- Modal de Checkout -->
      <CheckoutModal
        :isOpen="showCheckout"
        :items="items"
        @close="showCheckout = false"
      />
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import CheckoutModal from './CheckoutModal.vue';
import VbucksIcon from './VbucksIcon.vue';
import { useReactiveLanguage } from '../utils/useLanguage';
import { calculatePriceMXN, calculatePriceUSD, sumVbucks, sumMXN, sumUSD } from '../utils/pricing';
import { rarityColor } from '../utils/rarity';

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

const emit = defineEmits(['close', 'remove-item']);
const showCheckout = ref(false);

const closeCart = () => {
  emit('close');
};

const removeItem = (index) => {
  emit('remove-item', index);
};

// Escape cierra el carrito, salvo que el checkout esté abierto (ese se cierra primero)
const onKeydown = (event) => {
  if (event.key === 'Escape' && !showCheckout.value) closeCart();
};

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      window.addEventListener('keydown', onKeydown);
    } else {
      window.removeEventListener('keydown', onKeydown);
      showCheckout.value = false;
    }
  }
);

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));

const totalVbucks = computed(() => sumVbucks(props.items));
const totalMXN = computed(() => sumMXN(props.items));
const totalUSD = computed(() => sumUSD(props.items));
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--backdrop);
  backdrop-filter: blur(4px);
}

.cart-panel {
  position: absolute;
  top: 12px;
  right: 12px;
  bottom: 12px;
  display: flex;
  flex-direction: column;
  width: calc(100% - 24px);
  max-width: 420px;
  overflow: hidden;
  border-radius: var(--r-xl);
  background: var(--surface);
  box-shadow: var(--shadow-lg);
}

/* Animación del cajón */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}

.drawer-enter-active .cart-panel,
.drawer-leave-active .cart-panel {
  transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .cart-panel,
.drawer-leave-to .cart-panel {
  transform: translateX(calc(100% + 24px));
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px 24px;
  border-bottom: 1px solid var(--line);
}

.cart-header h2 {
  font-size: 22px;
}

.cart-sub {
  margin-top: 2px;
  color: var(--ink-3);
  font-size: 13px;
  font-weight: 600;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  padding: 24px;
  text-align: center;
}

.empty-emoji {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  margin-bottom: 8px;
  border-radius: 50%;
  background: var(--brand-50);
  font-size: 40px;
}

.empty-title {
  color: var(--ink);
  font-size: 18px;
  font-weight: 800;
}

.empty-text {
  margin-bottom: 12px;
  color: var(--ink-3);
  font-size: 14px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: var(--r-md);
  background: var(--surface-2);
}

.item-thumb {
  --rar: var(--brand);
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  overflow: hidden;
  border-radius: 12px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--rar) 45%, white), color-mix(in srgb, var(--rar) 85%, black));
}

.item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

.item-details {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.item-name {
  overflow: hidden;
  font-size: 15px;
  font-weight: 800;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.item-prices {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
}

.item-mxn {
  font-size: 22px;
}

.item-usd {
  color: var(--ink-3);
  font-size: 12px;
  font-weight: 600;
}

.remove-btn {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--ink-3);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.remove-btn:hover {
  background: var(--danger-50);
  color: var(--danger);
}

/* Animación al quitar artículos */
.list-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.list-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.list-move {
  transition: transform 0.25s ease;
}

.cart-footer {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 20px 20px;
  border-top: 1px solid var(--line);
}

.totals {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
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
  padding-top: 8px;
  border-top: 1px dashed var(--line-strong);
  color: var(--ink);
  font-size: 16px;
  font-weight: 800;
}

.total-row.is-main .price-tag {
  font-size: 34px;
}

@media (max-width: 480px) {
  .cart-panel {
    top: auto;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    max-width: none;
    height: 88svh;
    border-radius: var(--r-xl) var(--r-xl) 0 0;
  }

  .drawer-enter-from .cart-panel,
  .drawer-leave-to .cart-panel {
    transform: translateY(100%);
  }
}
</style>
