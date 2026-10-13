<script>
// Contador compartido entre todos los modales: si hay dos abiertos (carrito + checkout)
// el scroll de la página se libera solo al cerrar el último.
let lockCount = 0;
</script>

<script setup>
import { watch, onBeforeUnmount } from 'vue';

// Contenedor común de todos los modales: fondo, animación, botón de cerrar,
// tecla Escape y bloqueo del scroll de la página. En móvil se abre como hoja inferior.
const props = defineProps({
  open: { type: Boolean, default: false },
  label: { type: String, default: '' },
  // 'sm' para fichas de producto, 'md' para el checkout
  size: { type: String, default: 'sm' }
});

const emit = defineEmits(['close']);

const onKeydown = (event) => {
  if (event.key === 'Escape') emit('close');
};

const lock = () => {
  window.addEventListener('keydown', onKeydown);
  if (lockCount++ === 0) document.body.style.overflow = 'hidden';
};
const unlock = () => {
  window.removeEventListener('keydown', onKeydown);
  if (--lockCount <= 0) {
    lockCount = 0;
    document.body.style.overflow = '';
  }
};

let locked = false;
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && !locked) {
      lock();
      locked = true;
    } else if (!isOpen && locked) {
      unlock();
      locked = false;
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (locked) unlock();
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @click.self="emit('close')">
        <div class="modal-sheet" :class="`size-${size}`" role="dialog" aria-modal="true" :aria-label="label">
          <button type="button" class="icon-btn modal-close" aria-label="Cerrar" @click="emit('close')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--backdrop);
  backdrop-filter: blur(6px);
}

.modal-sheet {
  position: relative;
  width: 100%;
  max-height: calc(100svh - 48px);
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--surface);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-lg);
}

.size-sm {
  max-width: 460px;
}

.size-md {
  max-width: 560px;
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 5;
  background: color-mix(in srgb, var(--surface) 90%, transparent);
  box-shadow: var(--shadow-sm);
}

.modal-close:hover {
  transform: rotate(90deg);
}

/* Animación */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.22s ease;
}

.modal-enter-active .modal-sheet,
.modal-leave-active .modal-sheet {
  transition: transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1.1), opacity 0.22s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-sheet,
.modal-leave-to .modal-sheet {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}

/* Móvil: hoja inferior */
@media (max-width: 600px) {
  .modal-backdrop {
    align-items: flex-end;
    padding: 0;
  }

  .modal-sheet {
    max-width: none;
    max-height: 92svh;
    border-radius: var(--r-xl) var(--r-xl) 0 0;
  }

  .modal-enter-from .modal-sheet,
  .modal-leave-to .modal-sheet {
    transform: translateY(100%);
    opacity: 1;
  }
}
</style>
