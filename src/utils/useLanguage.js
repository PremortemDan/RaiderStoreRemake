import { computed } from 'vue';
import { translations } from './translations';

let currentLang = 'es';
const listeners = [];

export function setLanguage(lang) {
  currentLang = lang;
  listeners.forEach(fn => fn(lang));
}

export function getLanguage() {
  return currentLang;
}

export function useLanguage() {
  const t = (key) => {
    const lang = currentLang;
    return translations[lang]?.[key] || translations['es']?.[key] || key;
  };

  return {
    t,
    lang: currentLang,
  };
}

// Para componentes que necesiten reactividad con el lenguaje
import { ref, onMounted, onUnmounted } from 'vue';

export function useReactiveLanguage() {
  const lang = ref(currentLang);

  const update = (newLang) => {
    lang.value = newLang;
  };

  onMounted(() => {
    listeners.push(update);
  });

  onUnmounted(() => {
    const idx = listeners.indexOf(update);
    if (idx > -1) listeners.splice(idx, 1);
  });

  const t = (key) => {
    return translations[lang.value]?.[key] || translations['es']?.[key] || key;
  };

  return {
    t,
    lang,
  };
}