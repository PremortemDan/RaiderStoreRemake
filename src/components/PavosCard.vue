<script setup>
import ShopCard from './ShopCard.vue';

defineProps({
  pavos: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);
</script>

<template>
  <!-- El nombre ya dice los V-Bucks ("2,400 V-Bucks"), así que aquí no se repite la placa azul -->
  <ShopCard
    :name="pavos.name"
    :image="pavos.imageUrl"
    :rarity="pavos.rarity"
    :mxn="pavos.mxn"
    :usd="pavos.usd"
    name-size="lg"
    @select="$emit('select', pavos)"
  />
</template>
