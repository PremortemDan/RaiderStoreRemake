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
import { WHATSAPP_URL, FACEBOOK_URL, WALLPAPER_INTERVAL_MS, ADD_FRIENDS_URL } from './config';
import whatsapplogo from './assets/whatsapplogo.png';
import facebooklogo from './assets/facebooklogo.png';
import raiderLogo from './assets/RaiderLogo.webp';
import raiderStoreLogo from './assets/RaiderStore.png';
import fortnitewallpaper1 from './assets/fortnitewallpaper1.webp';
import fortnitewallpaper2 from './assets/fortnitewallpaper2.webp';
import fortnitewallpaper3 from './assets/fortnitewallpaper3.webp';

const { t } = useLanguage();
const { t: rt } = useReactiveLanguage();
const { items: cartItems, addToCart, removeFromCart } = useCart();

// ===== Fondo rotativo del banner principal =====
const wallpapers = [fortnitewallpaper1, fortnitewallpaper2, fortnitewallpaper3];
const currentWallpaper = ref(0);
let wallpaperInterval = null;

// ===== Estado de la interfaz =====
// Cada pestaña lleva el trazo de su icono (SVG 24x24, estilo línea)
const tabs = [
  { id: 'skins', label: 'skinsTab', icon: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z' },
  { id: 'pases', label: 'pasesTab', icon: 'M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4zM9 6v12' },
  { id: 'recargas', label: 'recargasTab', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.5 8.5 12 16l3.5-7.5' },
  { id: 'crew', label: 'crewTab', icon: 'M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z' },
  { id: 'otros', label: 'otrosTab', icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z' }
];

const steps = [
  { title: 'Agrega a RSPAVOS', text: 'Envía solicitud de amistad a nuestras cuentas.', link: ADD_FRIENDS_URL },
  { title: 'Arma tu carrito', text: 'Skins, packs, pases, pavos y más.' },
  { title: 'Confirma por WhatsApp', text: 'Te enviamos el regalo directo a tu cuenta.' }
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

onMounted(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    wallpaperInterval = setInterval(() => {
      currentWallpaper.value = (currentWallpaper.value + 1) % wallpapers.length;
    }, WALLPAPER_INTERVAL_MS);
  }
});

onBeforeUnmount(() => {
  clearInterval(wallpaperInterval);
});
</script>


<template>
  <div id="app">
    <a href="#contenido" class="skip-link">Saltar al contenido</a>
    <div class="page-glow" aria-hidden="true"></div>

    <!-- Barra de navegación flotante -->
    <header class="topbar">
      <nav class="navbar">
        <img
          :src="raiderStoreLogo"
          alt="RaiderStore"
          class="navbar-logo"
          width="1289"
          height="236"
          role="link"
          tabindex="0"
          @click="reloadPage"
          @keydown.enter="reloadPage"
        >
        <label class="search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7.5"></circle>
            <path d="m20.5 20.5-4.2-4.2"></path>
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            class="search-input"
            :placeholder="t('buscar')"
            :aria-label="t('buscar')"
            @focus="activeTab = 'skins'"
          />
        </label>
        <button
          type="button"
          class="cart-button"
          :class="{ 'has-items': cartItems.length > 0 }"
          :aria-label="`${t('carritoCompras')} (${cartItems.length})`"
          @click="toggleCart"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 7h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"></path>
            <path d="M9 7V6a3 3 0 0 1 6 0v1"></path>
          </svg>
          <span class="cart-label">Carrito</span>
          <span class="cart-count" aria-hidden="true">{{ cartItems.length }}</span>
        </button>
      </nav>
    </header>

    <!-- Banner principal -->
    <section class="hero">
      <div class="hero-media" aria-hidden="true">
        <div
          v-for="(wallpaper, index) in wallpapers"
          :key="index"
          class="hero-layer"
          :class="{ active: index === currentWallpaper }"
          :style="{ backgroundImage: `url(${wallpaper})` }"
        ></div>
      </div>
      <div class="hero-inner">
        <div class="hero-copy">
          <span class="hero-kicker">
            <span class="dot"></span>
            Tienda de regalos de Fortnite
          </span>
          <h1 class="hero-title">Elige, agrega al carrito y confirma por WhatsApp</h1>
          <p class="hero-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9"></circle>
              <path d="M12 7v5l3 2"></path>
            </svg>
            Debes tener al menos 48 horas de amistad para poder recibir regalos en tu cuenta.
          </p>
        </div>
        <img
          :src="raiderLogo"
          alt="Raider"
          class="hero-avatar"
          width="200"
          height="200"
        />
      </div>
      <ol class="steps">
        <li v-for="(step, index) in steps" :key="step.title" class="step">
          <span class="step-num">{{ index + 1 }}</span>
          <div>
            <p class="step-title">
              <a v-if="step.link" :href="step.link" target="_blank" rel="noopener noreferrer">{{ step.title }} ↗</a>
              <template v-else>{{ step.title }}</template>
            </p>
            <p class="step-text">{{ step.text }}</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- Pestañas de servicios -->
    <div class="tabs-wrap">
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path :d="tab.icon"></path>
          </svg>
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
      <section>
        <div class="section-head">
          <h2 class="section-title">{{ t('pasesBatalla') }}</h2>
          <p class="section-sub">Se envían como regalo a tu cuenta.</p>
        </div>
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
      <section>
        <div class="section-head">
          <h2 class="section-title">{{ t('recargasPavos') }}</h2>
          <p class="section-sub">Recarga directa en cuentas principales, secundarias o nuevas.</p>
        </div>
        <div class="cosmetics-grid">
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
      <section>
        <div class="section-head">
          <h2 class="section-title">{{ t('crewFortnite') }}</h2>
          <p class="section-sub">Activación vía Xbox, válida en todas las plataformas.</p>
        </div>
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
      <section>
        <div class="section-head">
          <h2 class="section-title">{{ t('otrosTitulo') }}</h2>
          <p class="section-sub">Streaming y suscripciones a buen precio.</p>
        </div>
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

    <footer class="site-footer">
      <img :src="raiderStoreLogo" alt="RaiderStore" class="footer-logo" width="1289" height="236" />
      <p>Pedidos rápidos y seguros por WhatsApp. RaiderStore no está afiliado a Epic Games.</p>
    </footer>

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
  background: var(--brand);
  color: #fff;
  border-radius: 999px;
  font-weight: 700;
}

.skip-link:focus {
  left: 8px;
}

/* Manchas de color suaves detrás de todo */
.page-glow {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(40vw 40vw at 8% 0%, rgba(109, 92, 255, 0.16), transparent 70%),
    radial-gradient(36vw 36vw at 100% 10%, rgba(59, 130, 246, 0.14), transparent 70%),
    radial-gradient(40vw 30vw at 70% 100%, rgba(255, 184, 0, 0.1), transparent 70%);
}

/* ========== Barra de navegación ========== */
.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 12px 20px 0;
  background: linear-gradient(180deg, var(--bg) 55%, transparent);
}

.navbar {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 8px 8px 8px 22px;
  border-radius: 20px;
  background: var(--nav-bg);
  backdrop-filter: blur(14px) saturate(1.4);
  box-shadow: 0 12px 30px -12px rgba(21, 23, 46, 0.5);
}

.navbar-logo {
  width: 168px;
  height: auto;
  flex-shrink: 0;
  cursor: pointer;
}

.search {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 10px;
  min-width: 0;
  max-width: 440px;
  margin-left: auto;
  padding: 0 16px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.09);
  color: rgba(255, 255, 255, 0.6);
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  cursor: text;
}

.search:focus-within {
  background: rgba(255, 255, 255, 0.14);
  box-shadow: 0 0 0 2px rgba(124, 110, 255, 0.8);
  color: #fff;
}

.search-input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  outline: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.cart-button {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 8px 0 16px;
  border: 0;
  border-radius: 14px;
  background: #fff;
  color: var(--ink-fixed);
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.2s ease;
}

.cart-button:hover {
  transform: translateY(-1px);
}

.cart-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border-radius: 10px;
  background: #eceffa;
  color: #4a4f6c;
  font-size: 13px;
}

.cart-button.has-items .cart-count {
  background: var(--grad-brand);
  color: #fff;
}

.navbar-logo:focus-visible,
.cart-button:focus-visible {
  outline: 3px solid #8b7dff;
  outline-offset: 3px;
  border-radius: 10px;
}

/* ========== Banner principal ========== */
.hero {
  position: relative;
  width: calc(100% - 40px);
  max-width: 1200px;
  margin: 20px auto 0;
  overflow: hidden;
  border-radius: var(--r-xl);
  background: var(--night);
  color: #fff;
  isolation: isolate;
}

.hero-media {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.hero-media::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(100deg, rgba(43, 30, 140, 0.94) 0%, rgba(74, 59, 230, 0.78) 45%, rgba(59, 130, 246, 0.35) 100%),
    linear-gradient(0deg, rgba(21, 23, 46, 0.7) 0%, transparent 45%);
}

.hero-layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform: scale(1.08);
  transition: opacity 1.5s ease-in-out;
}

.hero-layer.active {
  opacity: 1;
  animation: hero-pan 9s ease-in-out forwards;
}

@keyframes hero-pan {
  from { transform: scale(1.08) translateX(0); }
  to { transform: scale(1.08) translateX(-3%); }
}

.hero-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 40px 44px 28px;
}

.hero-copy {
  max-width: 620px;
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  font-size: 13px;
  font-weight: 700;
  backdrop-filter: blur(6px);
}

.hero-kicker .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.25);
}

.hero-title {
  margin: 16px 0 14px;
  color: #fff;
  font-family: var(--display);
  font-size: clamp(34px, 5vw, 58px);
  font-weight: 700;
  line-height: 0.98;
  letter-spacing: 0.005em;
  text-transform: uppercase;
  text-wrap: balance;
}

.hero-note {
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-weight: 500;
}

.hero-note svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--sun);
}

.hero-avatar {
  width: 168px;
  height: auto;
  flex-shrink: 0;
  border-radius: 50%;
  filter: drop-shadow(0 18px 30px rgba(0, 0, 0, 0.45));
  animation: float 5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 0;
  padding: 0 20px 20px;
  list-style: none;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px);
}

.step-num {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: #fff;
  color: var(--brand);
  font-size: 14px;
  font-weight: 800;
}

.step-title {
  color: #fff;
  font-size: 15px;
  font-weight: 800;
}

.step-title a {
  color: var(--sun);
  text-decoration: none;
}

.step-title a:hover {
  text-decoration: underline;
}

.step-text {
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
  line-height: 1.4;
}

/* ========== Pestañas ========== */
.tabs-wrap {
  width: calc(100% - 40px);
  max-width: 1200px;
  margin: 20px auto 0;
}

.services-tabs {
  display: flex;
  gap: 6px;
  width: max-content;
  max-width: 100%;
  padding: 6px;
  overflow-x: auto;
  border-radius: 18px;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  scrollbar-width: none;
}

.services-tabs::-webkit-scrollbar {
  display: none;
}

.service-tab {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 16px;
  border: 0;
  border-radius: 13px;
  background: transparent;
  color: var(--ink-2);
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.service-tab:hover {
  background: var(--surface-2);
  color: var(--ink);
}

.service-tab.active {
  background: var(--tab-active-bg);
  color: #fff;
}

.service-tab.active svg {
  color: var(--sun);
}

/* ========== Contenido ========== */
.main-content {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 28px 20px 56px;
  flex: 1;
}

.section-head {
  margin-bottom: 20px;
}

.section-title {
  font-size: 28px;
}

.section-sub {
  margin-top: 4px;
  color: var(--ink-3);
  font-size: 15px;
}

.cosmetics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
}

/* ========== Pie de página ========== */
.site-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 32px 20px 96px;
  color: var(--ink-3);
  font-size: 13px;
  text-align: center;
}

.footer-logo {
  width: 130px;
  height: auto;
  filter: brightness(0) saturate(100%) invert(9%) sepia(19%) saturate(2400%) hue-rotate(207deg);
  opacity: 0.85;
}

/* En modo oscuro el logo se queda blanco */
@media (prefers-color-scheme: dark) {
  .footer-logo {
    filter: none;
    opacity: 0.7;
  }
}

/* ========== Botones flotantes de redes sociales ========== */
.social-floating {
  position: fixed;
  right: 20px;
  bottom: 88px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.social-float-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 8px 20px -6px rgba(21, 23, 46, 0.4);
  transition: transform 0.2s ease;
}

.social-float-btn.whatsapp {
  background-color: #25d366;
}

.social-float-btn.facebook {
  background-color: #1877f2;
}

.social-float-btn:hover {
  transform: translateY(-2px) scale(1.05);
}

.social-float-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* ========== Responsive ========== */
@media (max-width: 900px) {
  .steps {
    grid-template-columns: 1fr;
  }

  .hero-avatar {
    width: 120px;
  }
}

@media (max-width: 767px) {
  .topbar {
    padding: 8px 10px 0;
  }

  .navbar {
    gap: 8px;
    padding: 6px 6px 6px 14px;
    border-radius: 16px;
  }

  .navbar-logo {
    width: 96px;
  }

  .search {
    height: 38px;
    padding: 0 10px;
    gap: 6px;
    border-radius: 11px;
  }

  .search-input {
    font-size: 13px;
  }

  .cart-button {
    height: 38px;
    padding: 0 5px 0 10px;
    border-radius: 11px;
    gap: 6px;
  }

  .cart-label {
    display: none;
  }

  .cart-count {
    min-width: 24px;
    height: 24px;
    border-radius: 8px;
    font-size: 12px;
  }

  .hero,
  .tabs-wrap {
    width: calc(100% - 20px);
  }

  .hero {
    margin-top: 12px;
    border-radius: 22px;
  }

  .hero-inner {
    padding: 22px 18px 16px;
    gap: 12px;
  }

  .hero-title {
    margin: 12px 0 10px;
  }

  .hero-note {
    font-size: 12px;
  }

  .hero-avatar {
    width: 76px;
    align-self: flex-start;
  }

  .steps {
    padding: 0 10px 10px;
    gap: 6px;
  }

  .step {
    padding: 10px 12px;
  }

  .step-num {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    font-size: 13px;
  }

  .step-title {
    font-size: 14px;
  }

  .step-text {
    font-size: 12px;
  }

  .tabs-wrap {
    margin-top: 14px;
  }

  /* En móvil se ven todas las pestañas a la vez, en varias filas */
  .services-tabs {
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    overflow: visible;
  }

  .service-tab {
    flex: 1 1 auto;
    justify-content: center;
    height: 38px;
    padding: 0 12px;
    font-size: 13px;
  }

  .main-content {
    padding: 20px 10px 40px;
  }

  .section-title {
    font-size: 22px;
  }

  .section-sub {
    font-size: 13px;
  }

  .cosmetics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .social-floating {
    right: 12px;
    bottom: 76px;
    gap: 8px;
  }

  .social-float-btn {
    width: 46px;
    height: 46px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-layer,
  .hero-layer.active,
  .hero-avatar {
    animation: none;
    transition: none;
  }
}
</style>
