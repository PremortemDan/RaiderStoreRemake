<template>
  <div class="language-menu-wrapper">
    <svg 
      class="world-icon" 
      @click="showMenu = !showMenu"
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>

    <div v-if="showMenu" class="language-dropdown">
      <button 
        v-for="lang in languages" 
        :key="lang.code"
        :class="{ 'language-option': true, 'active': currentLanguage === lang.code }"
        @click="selectLanguage(lang.code)"
      >
        <span class="flag">{{ lang.flag }}</span>
        <span class="lang-name">{{ lang.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { languages } from '../utils/translations';

const props = defineProps({
  modelValue: {
    type: String,
    default: 'es'
  }
});

const emit = defineEmits(['update:modelValue']);

const showMenu = ref(false);
const currentLanguage = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  currentLanguage.value = newVal;
});

const selectLanguage = (langCode) => {
  currentLanguage.value = langCode;
  emit('update:modelValue', langCode);
  showMenu.value = false;
  // Cerrar menú al hacer clic fuera
  setTimeout(() => {
    document.addEventListener('click', closeMenu);
  }, 0);
};

const closeMenu = (e) => {
  if (e.target.closest('.language-menu-wrapper')) return;
  showMenu.value = false;
  document.removeEventListener('click', closeMenu);
};
</script>

<style scoped>
.language-menu-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.world-icon {
  width: 24px;
  height: auto;
  padding: 0 8px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.world-icon:hover {
  color: #FFD700;
  transform: scale(1.1);
}

.language-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  background: linear-gradient(135deg, #04154D 0%, #0771B8 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  min-width: 180px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  z-index: 500;
  overflow: hidden;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.language-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  font-weight: 600;
}

.language-option:last-child {
  border-bottom: none;
}

.language-option:hover {
  background: rgba(255, 215, 0, 0.1);
  color: #FFD700;
  padding-left: 20px;
}

.language-option.active {
  background: rgba(255, 215, 0, 0.2);
  color: #FFD700;
  border-left: 3px solid #FFD700;
  padding-left: 13px;
}

@media (max-width: 767px) {
  .world-icon {
    width: 20px;
    padding: 0 6px;
  }

  .language-dropdown {
    min-width: 140px;
  }

  .language-option {
    gap: 8px;
    padding: 10px 12px;
    font-size: 12px;
  }

  .language-option:hover {
    padding-left: 16px;
  }

  .language-option.active {
    padding-left: 9px;
  }

  .flag {
    font-size: 16px;
  }
}

.flag {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.lang-name {
  flex: 1;
}
</style>
