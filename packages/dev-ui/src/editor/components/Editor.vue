<template>
  <div class="simple-editor">
    <div
      class="se-container"
      contenteditable="true"
      @beforeinput="beforeinput"
      @keydown="handleKeydown"
      @mousedown="handleMousedown"
      @compositionstart="handleCompositionstart"
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
import Editor from "../index";
import SeBlock from "./SeBlock.vue";

// 响应式数据
const data = reactive({
  content: null
});

// 组件名-组件映射
const compMap = {
  'block': SeBlock
}

// 组件id-组件引用映射
const compRefs = ref({});

// 编辑器实例
const editor = new Editor({
  onContentUpdate(content) {
    data.content = content;
  }
});

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

function handleCaretInput(comp, ev, offset) {
  if (ev.inputType === 'insertText') {
    comp.insertText(ev.data, offset);
    return;
  }
}

function beforeinput(ev) {
  console.log('beforeinput', ev);
  // 接管所有输入行为
  ev.preventDefault();

  // composition 输入全部交由 composition 相关事件处理器
  if (ev.inputType === 'insertCompositionText') return false;

  const selection = getSelection();
  
  if (selection.type === 'Caret') { 

    // 目前 comp 都是 Text 组件
    const { comp } = getDirectParentComp(selection.focusNode);
    handleCaretInput(comp, ev, selection.focusOffset);

  } else if (selection.type === 'Range') {
    const anchor = getDirectParentComp(selection.anchorNode);

    if (selection.anchorNode === selection.focusNode) {
      anchor.comp.deleteAndCollapse(selection, () => {
        if (ev.inputType === 'deleteContentBackward') return;
        handleCaretInput(anchor.comp, ev, selection.focusOffset)
      });
    } else {
      const focus = getDirectParentComp(selection.focusNode);
      // TODO: 跨节点选区
    }
    
  } else {
    debugger
  }
}

function handleCompositionstart(ev) {
  ev.preventDefault();
  console.log('handleCompositionstart', ev);
}

function handleCompositionend(ev) {
  const selection = getSelection();
  console.log('handleCompositionend', ev, selection);
}

provide('compRefs', compRefs);
editor.setContent([]);

</script>

<style scoped>
.simple-editor {
  outline: 1px solid lightcoral;
  margin: 8px;
}
.se-container {
  border-radius: 4px;
  box-sizing: border-box;
  min-height: 1024px;
  padding: 20px 40px 90px 40px;
}
.se-container:focus-visible {
    outline: none;
}
</style>