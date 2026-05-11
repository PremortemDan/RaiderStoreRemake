<template>
  <div class="cosmetic-card" :class="`rarity-${cosmetic.rarity?.toLowerCase()}`">
    <div class="card-image-container">
      <img :src="cosmetic.imageUrl" :alt="cosmetic.name" :class="{
        'card-image': ['outfit', 'character', 'skin'].includes(cosmetic.type),
        'card-image-small': !['outfit', 'character', 'skin'].includes(cosmetic.type)
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
</template>

<script setup>
defineProps({
  cosmetic: {
    type: Object,
    required: true,
    validator: (obj) => obj.name && obj.price !== undefined
  }
});
</script>

<style scoped>
.cosmetic-card {

  background: linear-gradient(180deg, #001637, #003B8D 100%);
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
  background: #F7FF19;
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
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #003B8C);
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
  font-size: 25px;
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
  background: linear-gradient(180deg, #1a4d1a, #2d7a2d 100%);
}

.cosmetic-card.rarity-rare {
  background: linear-gradient(180deg, #001637, #003B8D 100%);
}

.cosmetic-card.rarity-epic {
  background: linear-gradient(180deg, #D96CF8, #953CAD 100%);
}

.cosmetic-card.rarity-legendary {
  background: linear-gradient(180deg, #5c3a1a, #c97f1c 100%);
}

.cosmetic-card.rarity-mythic {
  background: linear-gradient(180deg, #1a3a5c, #1f7f9f 100%);
}

.fade-image.rarity-common {
  background: linear-gradient(180deg, #2a2a2a00, #4a4a4a 100%);
}

.fade-image.rarity-uncommon {
  background: linear-gradient(180deg, #1a4d1a00, #2d7a2d 100%);
}

.fade-image.rarity-rare {
  background: linear-gradient(180deg, #00163700, #003B8D 100%);
}

.fade-image.rarity-epic {
  background: linear-gradient(180deg, #da6cf800, #953CAD 100%);
}

.fade-image.rarity-legendary {
  background: linear-gradient(180deg, #5c3a1a00, #c97f1c 100%);
}

.fade-image.rarity-mythic {
  background: linear-gradient(180deg, #1a3a5c00, #1f7f9f 100%);
}

</style>
