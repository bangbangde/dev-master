<template>
  <div class="simple-editor">
    <div
      class="se-container"
      contenteditable="true"
      @beforeinput="beforeinput"
      @compositionstart="handleCompositionstart"
      @compositionend="handleCompositionend"
      ref="editorNode"
    >
      <Children :children="data.content" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, provide, onMounted } from "vue";
import { debounce, useEventListener } from "./utils.js";
import Children from "./components/Children.vue";
import Block from "./components/Block.vue";
import Text from "./components/Text.vue"
import { createEditor } from "./index.js";

const props = defineProps({
  options: Object
});
const data = reactive({
  content: null
});

const components = {
  'block': Block,
  'text': Text
};
const editorNode = ref(null);
const nodeRefs = {};

let editor = null;

useEventListener(document, 'selectionchange', debounce(ev => {
  if (editor) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    // 如果选区不在编辑器内则丢弃
    const rangeAncestor = range.commonAncestorContainer;
    if (!editorNode.value.contains(rangeAncestor)) return;
    function getPathByNode(node) {
      // TODO
      const path = [];
      while(node !== editorNode.value) {
        if (node.dataset?.pathIndex != undefined) {
          path.unshift(node.dataset?.pathIndex)
        }
        node = node.parentElement;
      }
      return path;
    }
    editor.command.setSelection({
      isCollapsed: selection.isCollapsed,
      isForward: selection.anchorNode === range.startContainer ? (selection.anchorOffset <= selection.focusOffset) : false,
      anchor: { path: getPathByNode(selection.anchorNode), offset: selection.anchorOffset },
      focus: { path: getPathByNode(selection.focusNode), offset: selection.focusOffset}
    }, false);
  }
}, 100, { maxWait: 100, debug: false}));

onMounted(() => {
  init(props.options);
})

function init(options) {
  const { plugins, content } = options;
  editor = createEditor();

  // 获取插件提供的组件并注册到 Editor 的组件 map 中
  if (plugins && plugins.length) {
    plugins.forEach(plugin => {
      if (plugin.components) {
        // TODO 处理插件重名的情况
        Object.entries(plugin.components).forEach(([k, v]) => {
          components[k] = v;
        })
      }
    })
  }

  // 绑定事件
  editor.onChange = () => {
    console.log('editor: onChange', editor.operations);
    data.content = editor.content;
  }

  editor.command.insertNodes(content);
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

provide('components', components);
provide('nodeRefs', nodeRefs);

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