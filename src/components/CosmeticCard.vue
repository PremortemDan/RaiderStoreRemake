<script setup>
import ShopCard from './ShopCard.vue';
import { calculatePriceMXN, calculatePriceUSD } from '../utils/pricing';

defineProps({
  cosmetic: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);
</script>

<template>
  <ShopCard
    :name="cosmetic.name"
    :image="cosmetic.imageUrl"
    :images="cosmetic.renderImages"
    :rarity="cosmetic.rarity"
    :vbucks="cosmetic.price"
    :mxn="calculatePriceMXN(cosmetic.price)"
    :usd="calculatePriceUSD(cosmetic.price)"
    fit="cover"
    :badge="cosmetic.isNew ? 'Nuevo' : ''"
    @select="$emit('select', cosmetic)"
  />
</template>
