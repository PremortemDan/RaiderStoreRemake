<script setup>
import CosmeticStore from './components/CosmeticStore.vue';
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-container-right">
        <div class="logo">
          <span class="title">RaiderStore</span>
        </div>
      </div>
      <div class="navbar-container">
        <div class="search-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            class="search-input"
            placeholder="Buscar..."
          />
        </div>
        <svg class="world-icon"  xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
         <svg class="cart-icon" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <circle cx="9" cy="21" r="1"></circle>
           <circle cx="20" cy="21" r="1"></circle>
           <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
         </svg>
      </div>
    </nav>
    <main class="main-content">
      <CosmeticStore />
    </main>
  </div>
</template>

<style scoped>
.navbar {
  background-color: #111;
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
.world-icon {
  width: 30px;  /* Cambia el valor al tamaño que necesites */
  height: auto;
  padding: 0 10px;
}
.world-icon:hover {
  color: #fff;
  cursor: pointer;
}
.cart-icon {
  width: 30px;  /* Cambia el valor al tamaño que necesites */
  padding: 0 10px;
  margin-right: auto;
}
.cart-icon:hover {
  color: #fff;
  cursor: pointer;
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
</style>
