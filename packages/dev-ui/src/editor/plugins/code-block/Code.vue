<template>
  <se-code class="code-block">
    <code>{{ code }}</code>
  </se-code>
</template>
<script setup>
defineProps({
  code: String
})
</script>