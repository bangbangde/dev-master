<template>
  <div class="code-block">
    <code>{{ code }}</code>
  </div>
</template>
<script setup>
defineProps({
  code: String
})
</script>