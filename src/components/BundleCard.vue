<script setup>
import { computed } from 'vue';
import ShopCard from './ShopCard.vue';
import { calculatePriceMXN, calculatePriceUSD } from '../utils/pricing';
import { highestRarity } from '../utils/rarity';

const props = defineProps({
  bundle: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);

const bundleRarity = computed(() => highestRarity(props.bundle.items));

const itemsLine = computed(() => (props.bundle.items || []).map((item) => item.name).join(', '));
</script>

<template>
  <ShopCard
    :name="bundle.name"
    :image="bundle.imageUrl"
    :images="bundle.renderImages"
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
