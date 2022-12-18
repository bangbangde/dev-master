<template>
  <span class="se-text" ref="textRef">{{content}}</span>
</template>

<script setup>
import { ref, nextTick } from "vue";

const props = defineProps({
  content: String
});
const emit = defineEmits(['update:content'])

const textRef = ref(null);

function handleCaretInput(ev, selection) {
  const { inputType, data } = ev;
  const { focusOffset } = selection;

  switch (inputType) {
    case 'insertText':
      const newContent = props.content.substring(0, focusOffset) + data + props.content.substring(focusOffset);
      console.log(props.content, newContent);
      emit('update:content', newContent);
      nextTick(() => {
        const textNode = textRef.value.childNodes[0];
        const range = selection.getRangeAt(0);
        range.setStart(textNode, focusOffset + data.length);
        range.setEnd(textNode, focusOffset + data.length);
      })
      ev.preventDefault();
    break;
  }
}

defineExpose({
  handleCaretInput
})
</script>

<style>
.se-text {
  font-size: 14px;
}
</style>