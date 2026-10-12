import { ref, watch } from 'vue';
import { CART_STORAGE_KEY } from '../config';

// Carrito compartido (un solo estado para toda la app). Reemplaza el CustomEvent 'add-to-cart'
// que se disparaba en window y cuyo listener nunca se quitaba.

const loadCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // localStorage bloqueado (modo privado) o contenido corrupto
    return [];
  }
};

const items = ref(loadCart());

watch(
  items,
  (value) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Sin espacio o bloqueado: el carrito sigue funcionando en memoria
    }
  },
  { deep: true }
);

export function useCart() {
  const addToCart = (item) => {
    items.value.push(item);
  };

  const removeFromCart = (index) => {
    items.value.splice(index, 1);
  };

  const clearCart = () => {
    items.value = [];
  };

  return { items, addToCart, removeFromCart, clearCart };
}
