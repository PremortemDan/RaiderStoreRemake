<script setup>
import ShopCard from './ShopCard.vue';

defineProps({
  crew: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);
</script>

<template>
  <ShopCard
    :name="crew.name"
    :alt="crew.label"
    :image="crew.imageUrl"
    :rarity="crew.rarity"
    :mxn="crew.mxn"
    :usd="crew.usd"
    name-size="lg"
    @select="$emit('select', crew)"
  />
</template>
