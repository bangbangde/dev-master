<template>
  <div class="simple-editor">
    <div
      class="se-container"
      contenteditable="true"
      @beforeinput="beforeinput"
      @keydown="handleKeydown"
      @mouseup="handleMouse"
      @compositionstart="handleCompositionstart"
      @compositionend="handleCompositionend"
    >
      <Children :children="data.content" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, provide, onMounted } from "vue";
import { getDirectParentComp, useEventListener } from "./utils.js";
import Children from "./components/Children.vue";
import Block from "./components/Block.vue";
import Text from "./components/Text.vue"

import { createEditor } from "./index.js";

const props = defineProps({
  options: Object
})

onMounted(() => {
  init(props.options);
})

const components = {
  'block': Block,
  'text': Text
};

const nodeRefs = ref({});

provide('components', components);
provide('nodeRefs', nodeRefs);

const data = reactive({
  content: null
});

let editor = null;

function init(options) {
  editor = createEditor(options);
  const { plugins } = editor;

  // 注册插件
  if (plugins && plugins.length) {
    // 获取插件提供的组件
    plugins.forEach(plugin => {
      if (plugin.components) {
        Object.entries(plugin.components).forEach(([k, v]) => {
          components[k] = v;
        })
      }
    })
  }

  data.content = editor.content;

  // 绑定事件
  editor.onChange = () => {
    data.content = editor.content;
  }
}

function beforeinput(ev) {
  console.log('beforeinput', ev);
  ev.preventDefault();
  const selection = getSelection();
  if (selection.type === 'Range') {
    if (selection.anchorNode === selection.focusNode) {
    } else {
    }
    editor.command.splitNode()
  }
  switch (ev.inputType) {
    case 'insertText':
      editor.command.insertText(ev.data);
      break;
    case 'deleteContentBackward': break;
    case 'deleteSoftLineBackward': break;
    case 'insertParagraph': break;
    default:
      break;
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

defineExpose({
  init,
  setContent(content) {
    editor && editor.setContent(content);
  }
})

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