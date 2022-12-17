<template>
  <span class="se-text">{{content}}</span>
</template>

<script setup>
const props = defineProps({
  content: String
});
</script>

<style>
.se-text {
  font-size: 14px;
}
</style>