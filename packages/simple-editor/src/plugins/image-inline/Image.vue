<template>
  <se-image-inline
    class="se-image-inline"
    :id="$attrs.id"
  >
    <img :src="src" :alt="alt" width="20" height="20" />
  </se-image-inline>
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