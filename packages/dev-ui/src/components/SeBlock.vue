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
    />
  </div>
</template>

<script setup>
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

/**
 * 接管输入行为
 */
// function beforeinput(ev, selection) {
//   const { inputType, data, isComposing, composed } = ev;
//   const { focusNode, focusOffset } = selection;
//   const elText = focusNode.parentElement;
//   const textIndex = elText.dataset.textIndex;
//   // console.table({ inputType, data, isComposing, composed, focusNode, focusOffset, textIndex }, ['value']);
//   switch (inputType) {
//     case 'insertText':
//       const str = props.content[textIndex].content;
//       props.content[textIndex].content = str.substring(0, focusOffset) + data + str.substring(focusOffset)
//       nextTick(() => {
//         const nodeText = elText.childNodes[0];
//         const range = selection.getRangeAt(0);
//         range.setStart(nodeText, focusOffset + data.length);
//         range.setEnd(nodeText, focusOffset + data.length);
//       })
//       ev.preventDefault();
//       break;
//     case 'insertParagraph':

//       break;
//   }
  
// }

defineExpose({
  is: 'block',
  id: attrs.id,
  beforeinput
})

</script>

<style>
.se-block {
  border: 1px dashed lightgreen;
  min-height: 1em;
  margin: 4px 0;
}
</style>