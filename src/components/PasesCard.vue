<script setup>
import ShopCard from './ShopCard.vue';

defineProps({
  pase: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);
</script>

<template>
  <ShopCard
    :name="pase.name"
    :image="pase.imageUrl"
    :rarity="pase.rarity"
    :vbucks="pase.price"
    :mxn="pase.mxn"
    :usd="pase.usd"
    @select="$emit('select', pase)"
  />
</template>
