<script setup>
import { computed } from 'vue';
import ShopCard from './ShopCard.vue';
import { calculatePriceMXN, calculatePriceUSD } from '../utils/pricing';

const props = defineProps({
  bundle: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);

// La rareza del pack es la del artículo más raro que contiene
const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

const bundleRarity = computed(() => {
  if (!props.bundle.items || props.bundle.items.length === 0) return 'rare';

  let highestRarity = 'common';
  let highestIndex = 0;

  props.bundle.items.forEach((item) => {
    const rarity = (item.rarity || 'common').toLowerCase();
    const index = rarityOrder.indexOf(rarity);
    if (index > highestIndex) {
      highestIndex = index;
      highestRarity = rarity;
    }
  });

  return highestRarity;
});

const itemsLine = computed(() => (props.bundle.items || []).map((item) => item.name).join(', '));
</script>

<template>
  <ShopCard
    :name="bundle.name"
    :image="bundle.imageUrl"
    :rarity="bundleRarity"
    :vbucks="bundle.price"
    :mxn="calculatePriceMXN(bundle.price)"
    :usd="calculatePriceUSD(bundle.price)"
    fit="cover"
    badge="Pack"
    badge-tone="chrome"
    :detail="itemsLine"
    @select="$emit('select', bundle)"
  />
</template>
