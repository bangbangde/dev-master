<template>
  <div class="simple-editor">
    <div
      class="se-container"
      contenteditable="true"
      @beforeinput="beforeinput"
      @keydown="handleKeydown"
      @mousedown="handleMousedown"
    >
      <component
        v-for="item in article.content"
        :key="item.key"
        :is="compMap[item.type]"></component>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import SeLine from "./SeLine.vue";

const compMap = {
  'se-line': SeLine
}

const article = reactive({
  content: [
    { type: 'se-line', content: [], key: 0 },
    { type: 'se-line', content: [], key: 0 }
  ]
})

function beforeinput(ev) {
  console.log('beforeinput', ev);
  switch (ev.inputType) {
    case 'insertParagraph':
      ev.preventDefault();
      const selection = getSelection();
      console.log(selection);
      break;
  }
}

/**
 * - 
 */
function handleKeydown(ev) {
  console.log('keydown', ev);
}

/**
 * targets:
 * - 定位到text容器
 */
function handleMousedown(ev) {
  const { target } = ev;
  console.log('mousedown', target);
  const selection = getSelection();
  console.log(selection);
}

</script>

<style scoped>
.simple-editor {
  padding: 16px;
}
.se-container {
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  min-height: 1024px;
  padding: 20px 40px 90px 40px;
  background-color: aliceblue;
}
.se-container:focus-visible {
    outline: none;
}
</style>