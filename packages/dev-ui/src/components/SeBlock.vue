<template>
  <div class="se-block">
    <component
      v-for="(item, index) in content"
      :ref="el => compRefs[item.key] = el"
      :id="item.key"
      :key="item.key"
      :data-text-index="index"
      :is="compMap[item.is]"
      v-model:content="item.content"
      v-bind="item.props"
      @deleteContentBackward:empty="handleDeleteContentBackwardEmpty(index)"
    />
  </div>
</template>

<script setup>
/**
 * 基础 Block - 文本行，仅可包含各种行内元素：text link code
 */
import { ref, inject, useAttrs, nextTick } from 'vue';
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

function handleDeleteContentBackwardEmpty(index) {
  if (props.content.length === 1) return;
  if (index === 0) return;
  props.content.splice(index, 1);
  compRefs.value[props.content[index - 1]].setSelection();
}

defineExpose({
  is: 'block',
  id: attrs.id
})

</script>

<style>
.se-block {
  border: 1px dashed lightgreen;
  min-height: 1em;
  margin: 4px 0;
}
</style>