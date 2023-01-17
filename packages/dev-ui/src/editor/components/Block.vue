<template>
  <div class="se-block">
    <slot></slot>
  </div>
</template>

<script setup>
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style>
.se-block {
  border: 1px dashed lightgreen;
  min-height: 1em;
  margin: 4px 0;
}
</style>