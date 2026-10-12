<script setup>
import { computed } from 'vue';
import ShopCard from './ShopCard.vue';
import { useReactiveLanguage } from '../utils/useLanguage';

const props = defineProps({
  other: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);

const { t } = useReactiveLanguage();

const formatDispositivos = (n) => {
  if (!n) return '';
  return n === 1 ? `1 ${t('dispositivo')}` : `${n} ${t('dispositivos')}`;
};

const formatDuracion = (dias) => {
  if (!dias) return '';
  if (dias <= 30) return `${dias} ${t('dias')}`;
  const meses = dias / 30;
  const valor = Number.isInteger(meses) ? meses : Number(meses.toFixed(1));
  return `${valor} ${t('meses')}`;
};

const meta = computed(() =>
  [formatDispositivos(props.other.dispositivos), formatDuracion(props.other.dias)]
    .filter(Boolean)
    .join(', ')
);
</script>

<template>
  <ShopCard
    :name="props.other.name"
    :image="props.other.imageUrl"
    :rarity="props.other.rarity"
    :mxn="props.other.mxn"
    :usd="props.other.usd"
    :meta="meta"
    :detail="props.other.instrucciones"
    @select="$emit('select', props.other)"
  />
</template>
