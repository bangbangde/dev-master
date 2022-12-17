<template>
  <div class="se-block">
    <component
      v-for="(item, index) in content"
      :ref="el => compRefs[item.key] = el"
      :id="item.key"
      :key="item.key"
      :data-text-index="index"
      :is="compMap[item.is]"
      :content="item.content"
      v-bind="item.props"
    />
  </div>
</template>

<script setup>
import { ref, inject, useAttrs } from 'vue';
import Text from './SeText.vue';

const compMap = {
  'text': Text
}

const compRefs = inject('compRefs');

const props = defineProps({
  /**
   * [
   *  { key: 'j32o8c2', is: 'text', content: 'hello world', props: {} }
   * ]
   */
  content: Array
});

const attrs = useAttrs();

/**
 * 接管输入行为
 */
function handleKeydown(ev, selection) {
  const textIndex = selection.focusNode.parentElement.dataset['text-index'];
  console.log(ev, textIndex);
}

defineExpose({
  is: 'block',
  id: attrs.id,
  handleKeydown
})

</script>

<style>
.se-block {
  border: 1px dashed lightgreen;
  min-height: 1em;
  margin: 4px 0;
}
</style>