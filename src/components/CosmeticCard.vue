<template>
  <div class="cosmetic-card">
    <div class="card-image-container">
      <img :src="cosmetic.imageUrl" :alt="cosmetic.name" class="card-image" />
      <div v-if="cosmetic.isNew" class="badge-new">NUEVO</div>
      <div class="price-badge">{{ cosmetic.price }}</div>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ cosmetic.name }}</h3>
      <p class="card-type">{{ cosmetic.type }}</p>
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
  border-radius: 12px;
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
  width: 150%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  margin-left: -25%;
}

.cosmetic-card:hover .card-image {
  transform: scale(1.05);
}

.badge-new {
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(135deg, #ff006e, #ff3c87);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
}

.price-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(170, 59, 255, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
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
  font-size: 16px;
  font-weight: 600;
  color: #f3f4f6;
  line-height: 1.3;
}

.card-type {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}


.rarity-common {
  background: rgba(150, 150, 150, 0.3);
  color: #d1d5db;
}

.rarity-uncommon {
  background: rgba(34, 197, 94, 0.3);
  color: #86efac;
}

.rarity-rare {
  background: rgba(59, 130, 246, 0.3);
  color: #93c5fd;
}

.rarity-epic {
  background: rgba(168, 85, 247, 0.3);
  color: #d8b4fe;
}

.rarity-legendary {
  background: rgba(249, 115, 22, 0.3);
  color: #fed7aa;
}

.rarity-mythic {
  background: rgba(236, 72, 153, 0.3);
  color: #f472b6;
}

</style>
