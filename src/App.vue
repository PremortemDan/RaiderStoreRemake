<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import CosmeticStore from './components/CosmeticStore.vue';
import PasesCard from './components/PasesCard.vue';
import PavosCard from './components/PavosCard.vue';
import CrewCard from './components/CrewCard.vue';
import CrewPurchaseModal from './components/CrewPurchaseModal.vue';
import PurchaseModal from './components/PurchaseModal.vue';
import OthersCard from './components/OthersCard.vue';
import OthersPurchaseModal from './components/OthersPurchaseModal.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import ChatBot from './components/ChatBot.vue';
import { useLanguage, useReactiveLanguage } from './utils/useLanguage';
import { useCart } from './composables/useCart';
import { pases, crew, recargas, otros } from './data/products';
import { WHATSAPP_URL, FACEBOOK_URL, WALLPAPER_INTERVAL_MS } from './config';
import whatsapplogo from './assets/whatsapplogo.png';
import facebooklogo from './assets/facebooklogo.png';
import raiderLogo from './assets/RaiderLogo.webp';
import fortnitewallpaper1 from './assets/fortnitewallpaper1.webp';
import fortnitewallpaper2 from './assets/fortnitewallpaper2.webp';
import fortnitewallpaper3 from './assets/fortnitewallpaper3.webp';

const { t } = useLanguage();
const { t: rt } = useReactiveLanguage();
const { items: cartItems, addToCart, removeFromCart } = useCart();

// ===== Fondo de pantalla rotativo =====
// Las imágenes ya vienen desenfocadas (sin filter: blur en CSS) para no sobrecargar la GPU.
const wallpapers = [fortnitewallpaper1, fortnitewallpaper2, fortnitewallpaper3];
const currentWallpaper = ref(0);
let wallpaperInterval = null;

// ===== Estado de la interfaz =====
const tabs = [
  { id: 'skins', label: 'skinsTab' },
  { id: 'pases', label: 'pasesTab' },
  { id: 'recargas', label: 'recargasTab' },
  { id: 'crew', label: 'crewTab' },
  { id: 'otros', label: 'otrosTab' }
];

const activeTab = ref('skins');
const searchQuery = ref('');
const showCart = ref(false);
const chatOpen = ref(false);

const showPurchaseModal = ref(false);
const selectedItem = ref(null);
const showCrewModal = ref(false);
const selectedCrewItem = ref(null);
const showOthersModal = ref(false);
const selectedOtherItem = ref(null);

const closeCart = () => {
  showCart.value = false;
};

const toggleCart = () => {
  showCart.value = !showCart.value;
};

const openPurchaseModal = (item) => {
  selectedItem.value = item;
  showPurchaseModal.value = true;
};

const openCrewModal = (item) => {
  selectedCrewItem.value = item;
  showCrewModal.value = true;
};

const openOthersModal = (item) => {
  selectedOtherItem.value = item;
  showOthersModal.value = true;
};

// Los tres modales agregan al carrito y se cierran
const addItemToCart = (item) => {
  addToCart(item);
  showPurchaseModal.value = false;
};

const addCrewToCart = (item) => {
  addToCart(item);
  showCrewModal.value = false;
};

const addOtherToCart = (item) => {
  addToCart(item);
  showOthersModal.value = false;
};

const onChatToggle = (isOpen) => {
  chatOpen.value = isOpen;
};

const reloadPage = () => {
  window.location.reload();
};

// Escape cierra el carrito y los modales abiertos desde esta pantalla
const onKeydown = (event) => {
  if (event.key !== 'Escape') return;
  showCart.value = false;
  showPurchaseModal.value = false;
  showCrewModal.value = false;
  showOthersModal.value = false;
};

onMounted(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    wallpaperInterval = setInterval(() => {
      currentWallpaper.value = (currentWallpaper.value + 1) % wallpapers.length;
    }, WALLPAPER_INTERVAL_MS);
  }
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  clearInterval(wallpaperInterval);
  window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <div id="app">
    <a href="#contenido" class="skip-link">Saltar al contenido</a>

    <!-- Fondo de pantalla rotativo -->
    <div class="wallpaper-background" aria-hidden="true">
      <div
        v-for="(wallpaper, index) in wallpapers"
        :key="index"
        class="wallpaper-layer"
        :class="{ active: index === currentWallpaper }"
        :style="{ backgroundImage: `url(${wallpaper})` }"
      ></div>
      <div class="wallpaper-overlay"></div>
    </div>

    <nav class="navbar">
      <div class="navbar-container-right">
        <div class="logo">
          <img
            src="./assets/RaiderStore.png"
            alt="RaiderStore"
            width="300"
            height="50"
            role="link"
            tabindex="0"
            @click="reloadPage"
            @keydown.enter="reloadPage"
          >
        </div>
      </div>
      <div class="navbar-container">
        <div class="search-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            :placeholder="t('buscar')"
            :aria-label="t('buscar')"
          />
        </div>
        <div class="cart-button-wrapper">
          <button
            type="button"
            class="cart-button"
            :aria-label="t('carritoCompras')"
            @click="toggleCart"
          >
            <svg class="cart-icon" :class="{ 'cart-active': cartItems.length > 0 }" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
          <span v-if="cartItems.length > 0" class="cart-badge" aria-hidden="true">{{ cartItems.length }}</span>
        </div>
      </div>
    </nav>

    <!-- Banner con logo y pestañas de servicios -->
    <div class="services-banner">
      <div class="banner-intro">
        <img
          :src="raiderLogo"
          alt="Raider"
          class="raider-logo"
          width="200"
          height="200"
          role="link"
          tabindex="0"
          @click="reloadPage"
          @keydown.enter="reloadPage"
        />
        <div class="banner-copy">
          <p class="banner-title">Elige, agrega al carrito y confirma por WhatsApp</p>
          <p class="banner-sub">
            Debes tener al menos 48 horas de amistad para poder recibir regalos en tu cuenta.
          </p>
        </div>
      </div>
      <div class="services-tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          class="service-tab"
          :class="{ active: activeTab === tab.id }"
          :aria-selected="activeTab === tab.id"
          @click="activeTab = tab.id"
        >
          {{ t(tab.label) }}
        </button>
      </div>
    </div>

    <!-- Skins y Packs (por defecto) -->
    <main v-if="activeTab === 'skins'" id="contenido" class="main-content">
      <CosmeticStore :searchQuery="searchQuery" />
    </main>

    <!-- Pases de Batalla -->
    <main v-else-if="activeTab === 'pases'" id="contenido" class="main-content">
      <section class="pases-section">
        <h2 class="series-title">{{ t('pasesBatalla') }}</h2>
        <div class="cosmetics-grid">
          <PasesCard
            v-for="pase in pases"
            :key="pase.id"
            :pase="pase"
            @select="openPurchaseModal"
          />
        </div>
      </section>
    </main>

    <!-- Recargas de Pavos -->
    <main v-else-if="activeTab === 'recargas'" id="contenido" class="main-content">
      <section class="pases-section">
        <h2 class="series-title">{{ t('recargasPavos') }}</h2>
        <div class="cosmetics-grid recargas-grid">
          <PavosCard
            v-for="recarga in recargas"
            :key="recarga.id"
            :pavos="recarga"
            @select="openPurchaseModal"
          />
        </div>
      </section>
    </main>

    <!-- Crew de Fortnite -->
    <main v-else-if="activeTab === 'crew'" id="contenido" class="main-content">
      <section class="pases-section">
        <h2 class="series-title">{{ t('crewFortnite') }}</h2>
        <div class="cosmetics-grid">
          <CrewCard
            v-for="item in crew"
            :key="item.id"
            :crew="item"
            @select="openCrewModal"
          />
        </div>
      </section>
    </main>

    <!-- Otros (streaming y suscripciones) -->
    <main v-else-if="activeTab === 'otros'" id="contenido" class="main-content">
      <section class="pases-section">
        <h2 class="series-title">{{ t('otrosTitulo') }}</h2>
        <div class="cosmetics-grid">
          <OthersCard
            v-for="item in otros"
            :key="item.id"
            :other="item"
            @select="openOthersModal"
          />
        </div>
      </section>
    </main>

    <!-- Modal de Compra Crew -->
    <CrewPurchaseModal
      :isOpen="showCrewModal"
      :crew="selectedCrewItem"
      @close="showCrewModal = false"
      @add-to-cart="addCrewToCart"
    />

    <!-- Modal de Compra Otros -->
    <OthersPurchaseModal
      :isOpen="showOthersModal"
      :other="selectedOtherItem"
      @close="showOthersModal = false"
      @add-to-cart="addOtherToCart"
    />

    <!-- Modal de Compra (Pases y Recargas) -->
    <PurchaseModal
      :isOpen="showPurchaseModal"
      :cosmetic="selectedItem"
      :customAccountMessage="activeTab === 'recargas' ? rt('accountMsgPavos') : ''"
      @close="showPurchaseModal = false"
      @add-to-cart="addItemToCart"
    />

    <!-- Carrito de Compras -->
    <ShoppingCart
      :isOpen="showCart"
      :items="cartItems"
      @close="closeCart"
      @remove-item="removeFromCart"
    />

    <!-- Botones flotantes de redes sociales (solo si hay enlace configurado) -->
    <div v-if="(WHATSAPP_URL || FACEBOOK_URL) && !showCart && !showPurchaseModal && !showCrewModal && !showOthersModal && !chatOpen" class="social-floating">
      <a
        v-if="WHATSAPP_URL"
        :href="WHATSAPP_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="social-float-btn whatsapp"
        title="WhatsApp"
        aria-label="WhatsApp"
      >
        <img :src="whatsapplogo" alt="" />
      </a>
      <a
        v-if="FACEBOOK_URL"
        :href="FACEBOOK_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="social-float-btn facebook"
        title="Facebook"
        aria-label="Facebook"
      >
        <img :src="facebooklogo" alt="" />
      </a>
    </div>

    <!-- ChatBot de Ayuda -->
    <ChatBot @toggle="onChatToggle" />
  </div>
</template>

<style scoped>
.skip-link {
  position: absolute;
  left: -9999px;
  top: 8px;
  z-index: 2000;
  padding: 8px 14px;
  background: var(--raider);
  color: var(--ink-on-brand);
  border-radius: 8px;
  font-weight: 700;
}

.skip-link:focus {
  left: 8px;
}

.navbar {
  background-color: rgba(16, 13, 32, 0.88);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  box-sizing: border-box;
}

.navbar {
  justify-content: space-between;
  padding: 0 max(20px, calc((100% - 1200px) / 2 + 20px));
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  height: 60px;
}

.navbar-container-right {
  display: flex;
  align-items: center;
  height: 60px;
}

.logo img {
  cursor: pointer;
}

.cart-button-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.cart-button {
  display: flex;
  align-items: center;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
}

.cart-button:focus-visible,
.service-tab:focus-visible,
.logo img:focus-visible,
.raider-logo:focus-visible,
.social-float-btn:focus-visible {
  outline: 3px solid var(--raider);
  outline-offset: 3px;
  border-radius: 8px;
}

.cart-icon {
  width: 30px;
  padding: 0 10px;
  margin-right: auto;
  transition: all 0.3s ease;
  color: #9ca3af;
}

.cart-button:hover .cart-icon {
  color: var(--raider);
  transform: scale(1.1);
}

.cart-icon.cart-active {
  color: #ffffff;
}

.cart-button:hover .cart-icon.cart-active {
  color: var(--raider);
}

.cart-badge {
  position: absolute;
  top: 25px;
  right: -8px;
  background: var(--grad-brand);
  color: var(--ink-on-brand);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  box-shadow: 0 2px 8px rgba(255, 122, 26, 0.4);
  z-index: 10;
  pointer-events: none;
}

.search-container {
  display: flex;
  padding: 0 0 0 10px;
  align-items: center;
  gap: 0;
  background-color: var(--dusk-700);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.search-container:focus-within {
  border-color: var(--raider);
}

.search-input {
  padding: 8px 14px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 14px;
  width: 250px;
  outline: none;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: #888;
}

/* ========== Banner de servicios ========== */
.services-banner {
  width: 100%;
  max-width: 1200px;
  min-width: 0;
  margin: 0 auto;
  padding: 18px 20px 6px;
  box-sizing: border-box;
}

.banner-intro {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-bottom: 16px;
}

.raider-logo {
  width: 124px;
  height: auto;
  flex-shrink: 0;
  cursor: pointer;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.55));
}

.banner-copy {
  max-width: 54ch;
}

.banner-title {
  margin: 0 0 6px;
  color: var(--chrome-100);
  font: 700 34px/1.05 var(--display);
  letter-spacing: 0.01em;
}

.banner-sub {
  margin: 0;
  color: var(--chrome-300);
  font-size: 14px;
  line-height: 1.5;
}

/* Pestañas: placas inclinadas como en la tienda del juego. El texto va recto. */
.services-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 4px 10px;
  scrollbar-width: none;
}

.services-tabs::-webkit-scrollbar {
  display: none;
}

.service-tab {
  position: relative;
  isolation: isolate;
  flex-shrink: 0;
  padding: 11px 26px 9px;
  border: 0;
  background: none;
  color: var(--chrome-300);
  font: 700 20px/1 var(--display);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.15s ease;
}

.service-tab::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: rgba(23, 19, 43, 0.82);
  border-bottom: 3px solid rgba(255, 255, 255, 0.14);
  transform: skewX(-10deg);
  transition: background 0.15s ease, border-color 0.15s ease;
}

.service-tab:hover {
  color: #fff;
}

.service-tab:hover::before {
  background: rgba(43, 35, 84, 0.95);
  border-bottom-color: var(--raider);
}

.service-tab.active {
  color: var(--ink-on-brand);
}

.service-tab.active::before {
  background: var(--grad-brand);
  border-bottom-color: #fff;
}

/* ========== Contenido principal ========== */
.main-content {
  box-sizing: border-box;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px 40px 20px;
}

.main-content h1 {
  color: #f3f4f6;
  font-size: 32px;
}

/* ========== Sección de pases ========== */
.pases-section {
  padding: 20px 0;
}

.series-title {
  margin: 0;
  padding-bottom: 30px;
  white-space: nowrap;
  color: #ffffff;
  font-size: 50px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1;
  font-style: normal;
  text-transform: uppercase;
  text-align: left;
  width: 100%;
  font-family: var(--display);
}

.cosmetics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px 20px;
  row-gap: 24px;
}

.recargas-grid {
  row-gap: 24px;
}

@media (min-width: 1024px) {
  .cosmetics-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px 20px;
    row-gap: 24px;
  }
  .series-title {
    font-size: 40px;
    padding: 20px 0 40px 0;
    letter-spacing: -1px;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .cosmetics-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px 20px;
    row-gap: 24px;
  }
  .series-title {
    font-size: 25px;
    padding-bottom: 20px;
    letter-spacing: -1px;
  }
}

@media (max-width: 767px) {
  .cosmetics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px 10px;
    row-gap: 24px;
  }
  .recargas-grid {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 24px;
  }
  .series-title {
    font-size: 26px;
    padding-bottom: 20px;
    letter-spacing: -1px;
    white-space: normal;
  }
  .service-tab {
    padding: 9px 18px 7px;
    font-size: 17px;
  }
  .services-banner {
    padding: 12px 14px 4px;
  }
  .banner-intro {
    gap: 12px;
    margin-bottom: 10px;
  }
  .raider-logo {
    width: 78px;
  }
  .banner-title {
    font-size: 21px;
  }
  .banner-sub {
    font-size: 12px;
  }
}

/* ========== MÓVIL: Navbar compacto ========== */
@media (max-width: 767px) {
  .navbar {
    flex-wrap: nowrap;
    padding: 0 6px;
    align-items: center;
    height: 44px;
  }

  .navbar-container-right .logo img {
    width: 80px;
    height: auto;
  }

  .navbar-container {
    flex: 1;
    justify-content: flex-end;
    height: 44px;
    gap: 4px;
  }

  .navbar-container-right {
    height: 44px;
    width: auto;
  }

  .search-container {
    flex: 1;
    min-width: 0;
    padding-left: 8px;
  }

  .search-input {
    width: 100%;
    font-size: 11px;
    padding: 4px 8px;
  }

  .cart-icon {
    width: 18px;
    padding: 0 6px;
  }

  .cart-badge {
    top: 30px;
    right: -4px;
    width: 15px;
    height: 15px;
  }
}

/* ========== Fondo de pantalla rotativo ========== */
.wallpaper-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background-color: #0d0d12;
}

.wallpaper-layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
  transform: scale(1.1) translateX(-3%);
  will-change: opacity, transform;
}

.wallpaper-layer.active {
  opacity: 1;
  animation: pan-left 8s ease-in-out forwards;
}

@keyframes pan-left {
  from {
    transform: scale(1.1) translateX(0);
  }
  to {
    transform: scale(1.1) translateX(-3%);
  }
}

.wallpaper-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(23, 19, 43, 0.72) 0%, rgba(16, 13, 32, 0.92) 100%);
}

@media (prefers-reduced-motion: reduce) {
  .wallpaper-layer,
  .wallpaper-layer.active {
    animation: none;
    transition: none;
    transform: scale(1.1);
  }
}

/* ========== Botones flotantes de redes sociales ========== */
.social-floating {
  position: fixed;
  right: 20px;
  bottom: 86px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.social-float-btn {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.social-float-btn.whatsapp {
  background-color: #25D366;
}

.social-float-btn.facebook {
  background-color: #1877F2;
}

.social-float-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.social-float-btn img {
  width: 58px;
  height: 58px;
  object-fit: contain;
}

@media (max-width: 480px) {
  .social-floating {
    right: 10px;
    bottom: 68px;
    gap: 8px;
  }

  .social-float-btn {
    width: 50px;
    height: 50px;
  }

  .social-float-btn img {
    width: 50px;
    height: 50px;
  }
}
</style>
