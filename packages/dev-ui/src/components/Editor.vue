<template>
  <div class="simple-editor">
    <div
      class="se-container"
      contenteditable="true"
      @beforeinput="beforeinput"
      @keydown="handleKeydown"
      @mousedown="handleMousedown"
      @compositionend="handleCompositionend"
    >
      <component
        v-for="item in data.content"
        :ref="el => compRefs[item.key] = el"
        :id="item.key"
        :key="item.key"
        :is="compMap[item.is]"
        :content="item.content"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, provide } from "vue";
import SeBlock from "./SeBlock.vue";
import { genKey } from "./utils";

// 组件名-组件映射
const compMap = {
  'block': SeBlock
}

// 组件引用
const compRefs = ref({});
provide('compRefs', compRefs);

// 文档数据
const article = {
  meta: {
    title: 'demo',
    author: 'Frank'
  },
  content: []
};

/**
 * 预处理文档数据
 * - 给相关组件增加 key
 */
function preHandleData(data) {
  data = JSON.parse(JSON.stringify(data));
  if (!data.content?.length) {
    data.content = [
      { 
        key: genKey(),
        is: 'block',
        content: [
          { key: genKey(), is: 'text', content: 'hello world' }
        ] 
      }
    ]
  }
  return data;
}

// 响应式文档数据
const data = reactive(preHandleData(article));

const getDirectParentComp = (node) => {
  if (node.id && compRefs.value[node.id]) {
    return {
      el: node,
      comp: compRefs.value[node.id]
    }
  } else {
    return node.parentElement && getDirectParentComp(node.parentElement);
  }
}

/*
 *********************
 * 事件处理器
 **********************
 */

function beforeinput(ev) {
  const selection = getSelection();
  console.log(ev, selection.type, selection);
  if (selection.type === 'Caret') { // 光标
    const { comp } = getDirectParentComp(selection.focusNode);
    comp.handleCaretInput(ev, selection);
  } else if (selection.type === 'Range') { // 选区
    const { comp } = getDirectParentComp(selection.getRangeAt(0).commonAncestorContainer);
    comp.handleRangeInput(ev, selection);
  } else {
    debugger
  }
}

function handleCompositionend(ev) {
  const selection = getSelection();
  console.log('handleCompositionend', ev, selection);
  const { comp } = getDirectParentComp(selection.focusNode);
  comp.handleRangeInput(ev, selection);
}
 
function handleKeydown(ev) {
  // ev.preventDefault();
  // console.log('keydown', ev);
  // const selection = getSelection();
  // const { type, focusNode, } = selection;
  // // 光标在文本节点上
  // if (type === 'Caret' && focusNode.nodeType === 3) {
  //   const elLine = focusNode.parentElement.parentElement;
  //   const compLine = compRefs.value[elLine.id];
  //   compLine.handleKeydown(ev, selection);
  // }
}

function handleMousedown(ev) {
  // const { target } = ev;
  // const selection = getSelection();
  // console.log(target, selection);
}

</script>

<style scoped>
.simple-editor {
  padding: 16px;
  border: 2px solid gray;
  background-color: aqua;
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