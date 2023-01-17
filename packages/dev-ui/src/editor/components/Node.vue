<template>
  <component
    v-for="item in children"
    v-bind="item"
    :ref="el => compRefs[item.id] = el"
    :id="item.id"
    :key="item.id"
    :is="components[item.type]"
  >
    <Node v-if="item.children?.length" :children="item.children" />
  </component>
</template>

<script setup>
import { inject } from 'vue';

defineProps({
  children: Array
});

const components = inject('components', {});
const compRefs = inject('compRefs', {});

</script>