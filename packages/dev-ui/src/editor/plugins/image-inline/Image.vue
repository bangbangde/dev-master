<template>
  <img :src="src" :alt="alt" width="20" height="20" />
</template>

<script setup>
defineProps({
  src: String,
  alt: String
})
</script>
<script>
export default {
  inheritAttrs: false
}
</script>