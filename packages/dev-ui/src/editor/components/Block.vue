<template>
  <div class="se-block" :data-path-index="$attrs.dataPathIndex">
    <slot></slot>
  </div>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>

<style>
.se-block {
  display: block;
  border: 1px dashed lightgreen;
  min-height: 1em;
  margin: 4px 0;
}
</style>