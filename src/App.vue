<script setup>
import { ref, onMounted } from 'vue';
import CosmeticStore from './components/CosmeticStore.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import LanguageMenu from './components/LanguageMenu.vue';
import ChatBot from './components/ChatBot.vue';

const cartItems = ref([]);
const showCart = ref(false);
const searchQuery = ref('');
const currentLanguage = ref('es');

// Escuchar evento de agregar al carrito
onMounted(() => {
  window.addEventListener('add-to-cart', (event) => {
    const cosmetic = event.detail;
    cartItems.value.push(cosmetic);
    // Opcional: mostrar notificación
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
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-container-right">
        <div class="logo">
          <img src="./assets/RaiderStore.png" alt="RaiderStore Logo" width="300" height="50">
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
            placeholder="Buscar por nombre o categoría..."
          />
        </div>
        <LanguageMenu v-model="currentLanguage" />
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
    <main class="main-content">
      <CosmeticStore :searchQuery="searchQuery" />
    </main>

    <!-- Carrito de Compras -->
    <ShoppingCart
      :isOpen="showCart"
      :items="cartItems"
      @close="closeCart"
      @remove-item="removeFromCart"
    />

    <!-- ChatBot de Ayuda -->
    <ChatBot />
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

title {
  font-family: 'Luckiest Guy', cursive;
  letter-spacing: 1px; /* Para que se vea más compacta como el logo */
  text-transform: uppercase; /* El estilo Fortnite siempre va en mayúsculas */
  font-style: oblique;

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

.cart-button-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.cart-icon {
  width: 30px;  /* Cambia el valor al tamaño que necesites */
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

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.main-content h1 {
  color: #f3f4f6;
  font-size: 32px;
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
</style>
