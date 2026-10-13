<script setup>
defineProps({
  size: { type: [Number, String], default: 16 }
});
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="100" cy="100" r="88" fill="#3a8ef0" />
    <circle cx="100" cy="100" r="70" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="8" />
    <path d="M62 70 L88 138 H112 L138 70 H116 L100 114 L84 70 Z" fill="#fff" />
  </svg>
</template>
