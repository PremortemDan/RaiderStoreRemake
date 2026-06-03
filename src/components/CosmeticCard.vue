<template>
  <div class="cosmetic-card-wrapper" @click="selectProduct">
    <div class="cosmetic-card" :class="`rarity-${cosmetic.rarity?.toLowerCase()}`">
      <div class="card-image-container">
        <img :src="cosmetic.imageUrl" :alt="cosmetic.name" :class="{
          'card-image': ['outfit', 'character', 'skin'].includes(cosmetic.type),
          'card-image-small': !['outfit', 'character'].includes(cosmetic.type)
        }" />
        <div v-if="cosmetic.isNew" class="badge-new">¡NUEVO!</div>
        <h3 class="card-title">{{ cosmetic.name }}</h3>
        <div class="price-badge">
          <svg class="pavos-icon" width="24" height="24" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="white"/>
            <path d="M65 75 L88 135 H112 L135 75 H115 L100 115 L85 75 Z" fill="#003B8D"/> </svg>
          {{ cosmetic.price }}
        </div>
        <div class="fade-image" :class="`rarity-${cosmetic.rarity?.toLowerCase()}`" ></div>
      </div>
    </div>
    <div class="price-info">
      <div class="price-row">
        <span class="currency-label">MXN:</span>
        <span class="price-value">${{ calculatePriceMXN(cosmetic.price) }}</span>
      </div>
      <div class="price-row">
        <span class="currency-label">USD:</span>
        <span class="price-value">${{ calculatePriceUSD(cosmetic.price) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  cosmetic: {
    type: Object,
    required: true,
    validator: (obj) => obj.name && obj.price !== undefined
  }
});

const emit = defineEmits(['select']);

const selectProduct = () => {
  emit('select', props.cosmetic);
};

// Conversión: 100 V-Bucks = 7.5 MXN
const calculatePriceMXN = (vbucks) => {
  return ((vbucks / 100) * 7.5).toFixed(2);
};

// Conversión: 100 V-Bucks = 0.45 USD
const calculatePriceUSD = (vbucks) => {
  return ((vbucks / 100) * 0.45).toFixed(2);
};
</script>

<style scoped>
.cosmetic-card-wrapper {
  cursor: pointer;
  user-select: none;
}

.cosmetic-card {
  background: linear-gradient(180deg, #3D1000, #DC2F02 100%);
  border-radius: 15px;
  overflow: visible;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
}

.cosmetic-card:hover {
  box-shadow: 0px 0px 0px 3px rgb(255, 255, 255);
}

.card-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 0.6;
  overflow: hidden;
  background: rgba(250, 0, 0, 0);
  margin-top: -70px;
  margin-left: 0px;
  margin-right: -16px;
  padding-top: -15px;
  padding-left: 0;
  padding-right: 0;
}

.card-image {
  width: 140%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  margin-left: -23%;

}
.card-image-small {
  width: 140%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  margin-left: -23%;
  transform: scale(0.55);
}

.cosmetic-card:hover .card-image {
  transform: scale(1.05);
}

.cosmetic-card:hover .card-image-small{
  transform: scale(0.60);
}

.badge-new {
  position: absolute;
  bottom: 100px;
  left: 10px;
  background: #FF9F1C;
  color: rgb(0, 0, 0);
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Arial Black', sans-serif;
  font-weight: 1000;
  text-transform: uppercase;
  transform: skewX(-10deg) rotate(0deg);
  z-index: 2;
}

/* Ajustes en el badge para que el icono luzca bien */
.price-badge {
  position: absolute;
  bottom: 8px; /* Ajustado un poco hacia arriba */
  left: 0px;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px; /* Espacio entre el logo y el precio */
  z-index: 2;
}

/* Estilo específico para el icono SVG */
.pavos-icon {
  width: 26px;  /* Tamaño similar a la fuente */
  height: 26px;
  flex-shrink: 0;
}

.fade-image {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #DC2F02);
  z-index: 1;
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
}
.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.card-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #f3f4f6;
  line-height: 1.3;
  
  position: absolute;
  /* Posicionamiento corregido */
  bottom: 35px;       /* En lugar de top 85%, usa bottom para más precisión */
  left: 12px;         /* Empieza desde la izquierda */
  right: 12px;        /* Deja un margen a la derecha, permitiendo que se estire */
  
  z-index: 2;

  /* Control de filas */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Máximo 2 filas */
  -webkit-box-orient: vertical;
  overflow: hidden;     /* Corta el texto si es muy largo y pone puntos suspensivos */
}

.card-type {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Estilos de rareza */
.cosmetic-card.rarity-common {
  background: linear-gradient(180deg, #2a2a2a, #4a4a4a 100%);
}

.cosmetic-card.rarity-uncommon {
  background: linear-gradient(180deg, #3D1A00, #8B3A00 100%);
}

.cosmetic-card.rarity-rare {
  background: linear-gradient(180deg, #3D1000, #DC2F02 100%);
}

.cosmetic-card.rarity-epic {
  background: linear-gradient(180deg, #FF8C00, #D35400 100%);
}

.cosmetic-card.rarity-legendary {
  background: linear-gradient(180deg, #7B3F00, #FF6B00 100%);
}

.cosmetic-card.rarity-mythic {
  background: linear-gradient(180deg, #5C2E00, #CC5500 100%);
}

.fade-image.rarity-common {
  background: linear-gradient(180deg, #2a2a2a00, #4a4a4a 100%);
}

.fade-image.rarity-uncommon {
  background: linear-gradient(180deg, #3D1A0000, #8B3A00 100%);
}

.fade-image.rarity-rare {
  background: linear-gradient(180deg, #3D100000, #DC2F02 100%);
}

.fade-image.rarity-epic {
  background: linear-gradient(180deg, #FF8C0000, #D35400 100%);
}

.fade-image.rarity-legendary {
  background: linear-gradient(180deg, #7B3F0000, #FF6B00 100%);
}

.fade-image.rarity-mythic {
  background: linear-gradient(180deg, #5C2E0000, #CC5500 100%);
}

/* Estilos para el wrapper y precio */
.cosmetic-card-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
  font-size: large;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.05em;
}

.price-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 35px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1;
}

.currency-label {
  font-weight: 700;
  min-width: 40px;
  color: #f3f4f6;
}

.price-value {
  color: #ffffff;
  font-weight: 700;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

/* ========== MÓVIL: 4 columnas ========== */
@media (max-width: 767px) {
  .cosmetic-card {
    border-radius: 6px;
  }

  .card-image-container {
    margin-top: -28px;
    margin-right: -6px;
    aspect-ratio: 0.6;
  }

  .card-image {
    width: 150%;
    margin-left: -25%;
  }
  .card-image-small {
    width: 150%;
    margin-left: -25%;
    transform: scale(0.7);
  }

  .cosmetic-card:hover .card-image {
    transform: scale(1.03);
  }
  .cosmetic-card:hover .card-image-small {
    transform: scale(0.73);
  }

  .card-title {
    font-size: 7px;
    font-weight: 900;
    bottom: 18px;
    left: 4px;
    right: 4px;
    -webkit-line-clamp: 2;
    line-height: 1.2;
  }

  .price-badge {
    font-size: 7px;
    bottom: 0px;
    left: 0px;
    padding: 0px 3px;
    gap: 2px;
    align-items: left;
  }

  .pavos-icon {
    width: 10px;
    height: 10px;
    padding: 0px 0px 5px 0px;
  }

  .badge-new {
    font-size: 7px;
    bottom: 48px;
    left: 3px;
    padding: 1px 3px;
    border-radius: 3px;
  }

  .fade-image {
    height: 45%;
  }

  .price-row {
    font-size: 12px;
    line-height: 0.6;
  }

  .currency-label {
    min-width: 30px;
  }

}
</style>
