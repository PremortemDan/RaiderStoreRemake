<script setup>
import { ref, onMounted, watch } from 'vue';
import CosmeticStore from './components/CosmeticStore.vue';
import PasesCard from './components/PasesCard.vue';
import PavosCard from './components/PavosCard.vue';
import CrewCard from './components/CrewCard.vue';
import CrewPurchaseModal from './components/CrewPurchaseModal.vue';
import PurchaseModal from './components/PurchaseModal.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import ChatBot from './components/ChatBot.vue';
import { useLanguage, useReactiveLanguage } from './utils/useLanguage';
import paseDeBatalla from './assets/paseDeBatalla.png';
import PaseOG from './assets/PaseOG.png';
import PaseLego from './assets/PaseLego.png';
import PaseFestival from './assets/PaseFestival.png';
import pavosImg from './assets/pavos.png';
import crewImg from './assets/crew.png';
import whatsapplogo from './assets/whatsapplogo.png';
import facebooklogo from './assets/facebooklogo.png';
import fortnitewallpaper1 from './assets/fortnitewallpaper1.jpg';
import fortnitewallpaper2 from './assets/fortnitewallpaper2.jpg';
import fortnitewallpaper3 from './assets/fortnitewallpaper3.jpg';

const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL || '';
const facebookUrl = import.meta.env.VITE_FACEBOOK_URL || '';

// Fondos de pantalla rotativos
const wallpapers = [fortnitewallpaper1, fortnitewallpaper2, fortnitewallpaper3];
const currentWallpaper = ref(0);

let wallpaperInterval = null;

onMounted(() => {
  wallpaperInterval = setInterval(() => {
    currentWallpaper.value = (currentWallpaper.value + 1) % wallpapers.length;
  }, 8000);
});

const CART_STORAGE_KEY = 'raiderstore_cart';

const cartItems = ref(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]'));
const showCart = ref(false);
const searchQuery = ref('');
const { t } = useLanguage();
const { t: rt } = useReactiveLanguage();

const activeTab = ref('skins');
const showPurchaseModal = ref(false);
const showCrewModal = ref(false);
const selectedItem = ref(null);
const selectedCrewItem = ref(null);
const chatOpen = ref(false);

// Datos de pases
const pases = ref([
  {
    id: 'bp',
    name: 'Pase de Batalla',
    price: 800,
    mxn: '115.00',
    usd: '6.61',
    rarity: 'rare',
    type: 'default',
    imageUrl: paseDeBatalla
  },
  {
    id: 'og',
    name: 'Pase OG',
    price: 800,
    mxn: '115.00',
    usd: '6.61',
    rarity: 'legendary',
    type: 'default',
    imageUrl: PaseOG
  },
  {
    id: 'lego',
    name: 'Pase LEGO',
    price: 1200,
    mxn: '145.00',
    usd: '8.39',
    rarity: 'epic',
    type: 'default',
    imageUrl: PaseLego
  },
  {
    id: 'festival',
    name: 'Pase Festival',
    price: 1200,
    mxn: '145.00',
    usd: '8.39',
    rarity: 'legendary',
    type: 'default',
    imageUrl: PaseFestival
  }
]);

// Datos de Crew de Fortnite
const crew = ref([
  {
    id: 'crew-1',
    name: '1 Mes de crew',
    label: '1 mes de Crew',
    price: 0,
    mxn: '89.00',
    usd: '5.15',
    rarity: 'rare',
    type: 'default',
    imageUrl: crewImg
  },
  {
    id: 'crew-3',
    name: '3 Meses de crew',
    label: '3 meses de Crew',
    price: 0,
    mxn: '199.00',
    usd: '11.51',
    rarity: 'epic',
    type: 'default',
    imageUrl: crewImg
  },
  {
    id: 'crew-6',
    name: '6 Meses de crew',
    label: '6 meses de Crew',
    price: 0,
    mxn: '350.00',
    usd: '20.25',
    rarity: 'legendary',
    type: 'default',
    imageUrl: crewImg
  }
]);

// Datos de recargas de pavos
const recargas = ref([
  {
    id: 'recarga-800',
    name: '800 V-Bucks',
    price: 800,
    mxn: '115.00',
    usd: '6.79',
    rarity: 'uncommon',
    type: 'default',
    imageUrl: pavosImg
  },
  {
    id: 'recarga-2400',
    name: '2,400 V-Bucks',
    price: 2400,
    mxn: '249.00',
    usd: '14.71',
    rarity: 'rare',
    type: 'default',
    imageUrl: pavosImg
  },
  {
    id: 'recarga-4500',
    name: '4,500 V-Bucks',
    price: 4500,
    mxn: '399.00',
    usd: '23.56',
    rarity: 'epic',
    type: 'default',
    imageUrl: pavosImg
  },
  {
    id: 'recarga-12500',
    name: '12,500 V-Bucks',
    price: 12500,
    mxn: '849.00',
    usd: '50.14',
    rarity: 'legendary',
    type: 'default',
    imageUrl: pavosImg
  },
  {
    id: 'recarga-14900',
    name: '14,900 V-Bucks',
    price: 14900,
    mxn: '1040.00',
    usd: '61.42',
    rarity: 'legendary',
    type: 'default',
    imageUrl: pavosImg
  },
  {
    id: 'recarga-25000',
    name: '25,000 V-Bucks',
    price: 25000,
    mxn: '1640.00',
    usd: '96.85',
    rarity: 'mythic',
    type: 'default',
    imageUrl: pavosImg
  }
]);

// Persistir carrito en localStorage cada vez que cambie
watch(cartItems, (newItems) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
}, { deep: true });

// Escuchar evento de agregar al carrito
onMounted(() => {
  window.addEventListener('add-to-cart', (event) => {
    const cosmetic = event.detail;
    cartItems.value.push(cosmetic);
    console.log('Producto añadido al carrito:', cosmetic.name);
  });
});

const toggleCart = () => {
  showCart.value = !showCart.value;
};

const closeCart = () => {
  showCart.value = false;
};

const removeFromCart = (index) => {
  cartItems.value.splice(index, 1);
};

const openPurchaseModal = (item) => {
  selectedItem.value = item;
  showPurchaseModal.value = true;
};

const addItemToCart = (item) => {
  const event = new CustomEvent('add-to-cart', { detail: item });
  window.dispatchEvent(event);
  showPurchaseModal.value = false;
};

const openCrewModal = (item) => {
  selectedCrewItem.value = item;
  showCrewModal.value = true;
};

const addCrewToCart = (item) => {
  const event = new CustomEvent('add-to-cart', { detail: item });
  window.dispatchEvent(event);
  showCrewModal.value = false;
};

const onChatToggle = (isOpen) => {
  chatOpen.value = isOpen;
};

const reloadPage = () => {
  window.location.reload();
};
</script>

<template>
  <div id="app">
    <!-- Fondo de pantalla rotativo -->
    <div class="wallpaper-background">
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
          <img src="./assets/RaiderStore.png" alt="RaiderStore Logo" width="300" height="50" @click="reloadPage">
        </div>
      </div>
      <div class="navbar-container">
        <div class="search-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            :placeholder="t('buscar')"
          />
        </div>
        <div class="cart-button-wrapper">
          <svg class="cart-icon" :class="{ 'cart-active': cartItems.length > 0 }" @click="toggleCart" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span v-if="cartItems.length > 0" class="cart-badge">{{ cartItems.length }}</span>
        </div>
      </div>
    </nav>

    <!-- Banner con logo y tabs de servicios -->
    <div class="services-banner">
      <img src="./assets/RaiderLogo.png" alt="Raider Logo" class="raider-logo" @click="reloadPage" />
      <div class="services-tabs">
        <button
          class="service-tab"
          :class="{ active: activeTab === 'skins' }"
          @click="activeTab = 'skins'"
        >
           {{ t('skinsTab') }}
        </button>
        <button
          class="service-tab"
          :class="{ active: activeTab === 'pases' }"
          @click="activeTab = 'pases'"
        >
           {{ t('pasesTab') }}
        </button>
        <button
          class="service-tab"
          :class="{ active: activeTab === 'recargas' }"
          @click="activeTab = 'recargas'"
        >
           {{ t('recargasTab') }}
        </button>
        <button
          class="service-tab"
          :class="{ active: activeTab === 'crew' }"
          @click="activeTab = 'crew'"
        >
           {{ t('crewTab') }}
        </button>
      </div>
    </div>

    <!-- Pestaña Skins y Packs (por defecto) -->
    <main v-if="activeTab === 'skins'" class="main-content">
      <CosmeticStore :searchQuery="searchQuery" />
    </main>

    <!-- Pestaña Pases de Batalla -->
    <main v-if="activeTab === 'pases'" class="main-content">
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

    <!-- Pestaña Recargas de Pavos -->
    <main v-if="activeTab === 'recargas'" class="main-content">
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

    <!-- Pestaña Crew de Fortnite -->
    <main v-if="activeTab === 'crew'" class="main-content">
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

    <!-- Modal de Compra Crew -->
    <CrewPurchaseModal
      :isOpen="showCrewModal"
      :crew="selectedCrewItem"
      @close="showCrewModal = false"
      @add-to-cart="addCrewToCart"
    />

    <!-- Modal de Compra (Pases, Recargas y Crew) -->
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

    <!-- Botones flotantes de redes sociales -->
    <div v-if="!showCart && !showPurchaseModal && !showCrewModal && !chatOpen" class="social-floating">
      <a
        :href="whatsappUrl || '#'"
        target="_blank"
        rel="noopener"
        class="social-float-btn whatsapp"
        title="WhatsApp"
      >
        <img :src="whatsapplogo" alt="WhatsApp" />
      </a>
      <a
        :href="facebookUrl || '#'"
        target="_blank"
        rel="noopener"
        class="social-float-btn facebook"
        title="Facebook"
      >
        <img :src="facebooklogo" alt="Facebook" />
      </a>
    </div>

    <!-- ChatBot de Ayuda -->
    <ChatBot @toggle="onChatToggle" />
  </div>
</template>

<style scoped>
.navbar {
  background-color: #111111c3;
  display: flex;
  padding: 0 0px;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  box-sizing: border-box;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: left;
  height: 60px;
}
.navbar-container-right {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: left;
  height: 60px;
}

.logo span {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.logo img {
  cursor: pointer;
}

.cart-button-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.cart-icon {
  width: 30px;
  padding: 0 10px;
  margin-right: auto;
  transition: all 0.3s ease;
  color: #9ca3af;
}

.cart-icon:hover {
  color: #FF6B00;
  cursor: pointer;
  transform: scale(1.1);
}

.cart-icon.cart-active {
  color: #ffffff;
}

.cart-icon.cart-active:hover {
  color: #FF6B00;
}

.cart-badge {
  position: absolute;
  top: 25px;
  right: -8px;
  background: linear-gradient(135deg, #FF8C00 0%, #D35400 100%);
  color: #ffffff;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  box-shadow: 0 2px 8px rgba(255, 107, 0, 0.4);
  z-index: 10;
}

.search-container {
  display: flex;
  padding: 0 0 0 10px;
  align-items: center;
  gap: 0;
  background-color: #222;
  border: 1px solid #333;
  border-radius: 999px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.search-container:focus-within {
  border-color: #555;
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

.search-btn {
  padding: 8px 12px;
  border: none;
  border-left: 1px solid #333;
  background: transparent;
  color: #aaa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;
}

.search-btn:hover {
  background-color: #333;
  color: #fff;
}

/* ========== Banner de servicios ========== */
.services-banner {
  text-align: center;
  padding: 15px 20px 5px 20px;
}

.raider-logo {
  width: 200px;
  height: auto;
  margin-bottom: 8px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
}

.services-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.service-tab {
  padding: 10px 24px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  color: #b0b0b0;
  font-size: 15px;
  font-weight: 700;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.service-tab:hover {
  border-color: rgba(255, 140, 0, 0.5);
  color: #FF8C00;
  background: rgba(255, 140, 0, 0.1);
}

.service-tab.active {
  background: linear-gradient(135deg, #FF8C00 0%, #D35400 100%);
  border-color: #FF8C00;
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(255, 140, 0, 0.3);
}

/* ========== Contenido principal ========== */
.main-content {
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
  font-weight: 900;
  letter-spacing: -2px;
  line-height: 1;
  font-style: oblique;
  text-transform: uppercase;
  text-align: left;
  width: 100%;
}

.cosmetics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px 20px;
  row-gap: 160px;
}

.recargas-grid {
  row-gap: 40px;
}

@media (min-width: 1024px) {
  .cosmetics-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px 20px;
    row-gap: 100px;
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
    gap: 40px 20px;
    row-gap: 80px;
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
    gap: 6px;
    row-gap: 30px;
  }
  .recargas-grid {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 20px;
  }
  .series-title {
    font-size: 18px;
    padding-bottom: 20px;
    letter-spacing: -1px;
    white-space: normal;
  }
  .service-tab {
    padding: 8px 16px;
    font-size: 11px;
  }
  .raider-logo {
    width: 140px;
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

  .world-icon {
    width: 18px;
    padding: 0 3px;
  }

  .cart-icon {
    width: 18px;
    padding: 0 6px;
  }

  .cart-badge {
    top: 30px;
    right: -4px;
    background: linear-gradient(135deg, #FF8C00 0%, #D35400 100%);
    color: #ffffff;
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }
}

/* ========== Fondo de pantalla rotativo ========== */
.wallpaper-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}

.wallpaper-layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
  filter: blur(8px);
  transform: scale(1.1) translateX(-3%);
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
  background: rgba(0, 0, 0, 0.6);
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
