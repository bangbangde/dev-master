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

// 插入字符（composition时可能有多个字符，应只响应 compositionend）
function insertText(data, offset) {
  const newContent = props.content.substring(0, offset) + data + props.content.substring(offset);
  console.log(props.content, newContent);
  emit('update:content', newContent);
  nextTick(() => {
    const textNode = textRef.value.childNodes[0];
    if (textNode.data === newContent) {
      getSelection().collapse(textNode, offset + data.length);
    } else {
      console.warn('文本不一致，放弃光标定位');
    }
  })
  ev.preventDefault();
}
// 回退键删除
function deleteContentBackward(offset) {
  if (offset === 0) {
    emit('deleteContentBackward:empty');
    return;
  }
  const newContent = props.content.substring(0, offset - 1) + props.content.substring(offset);
  console.log(props.content, newContent);
  emit('update:content', newContent);
  nextTick(() => {
    let textNode = textRef.value.childNodes[0];
    if (textNode) {
      if (textNode.data === newContent) {
        selection.collapse(textNode, offset - 1);
      } else {
        console.warn('文本不一致，放弃光标定位');
      }
    } else {
      // 零宽字符仅用于 dom 层面占位，没有进入响应式数据，再次输入后会被刷掉
      textNode = textRef.value.appendChild(document.createTextNode('\u200D'));
    }
  })
  ev.preventDefault();
}

function setSelection() {
  const textNode = textRef.value.childNodes[0];
  getSelection().collapseToEnd(textNode);
}

defineExpose({
  insertText,
  deleteContentBackward,
  setSelection
})
</script>

<style>
.se-text {
  font-size: 14px;
}
.se-text::before {
  content: '\200D'
}
</style>