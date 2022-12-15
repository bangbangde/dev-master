<template>
  <div class="se-line">
    <span
      v-if="content === null"
      class="se-placeholder"
      data-placeholder="请输入"
    ></span>
    <TextVue
      v-for="item in content"
      :key="item.key"
      :value="item.value"
      :decorators="item.decorators"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TextVue from './SeText.vue';

const content = ref(null);

</script>

<style scoped>
.se-placeholder::before {
  font-size: 1em;
  content: attr(data-placeholder);
  color: lightgray;
  user-select: none;
  pointer-events: none;
}
</style>