import { genKey } from "./utils";

const createOperation = {
  insertText: (path, text) => ({ type: 'insert_text', path, text }),
  removeText: (path, offset, backword) => ({ type: 'remove_text', path, offset, backword }),
  insertNode: (path, offset, node) => ({}),
  splitNode: (path) => ({}),
  mergeNode: (head, tail) => ({}),
  setNode: (path, property) => ({ type: 'set_node', property })
}

export const createEditor = ({
  plugins = [],
  content = null
}) => {
  let _content = content;

  const editor = {
    key: genKey(),
    plugins,
    command: {
      // 文本
      insertText: (editor, text, options) => {},
      removeText: (editor, text, options) => {},
      // 节点
      insertNode: (editor, options) => {},
      mergeNodes: node => {},
      // 选区控制
      collapse: () => {},
      move: () => {},
      select: () => {},
      setSelection: () => {}
    },
    setContent(content) {
      _content = JSON.parse(JSON.stringify(content));
      editor.onChange();
    },
    onChange: () => {},
    get content() {
      return JSON.parse(JSON.stringify(_content));
    },
    // get location() {
    //   const selection = getSelection();
    //   const range = selection.getRangeAt(0);
    //   return {
    //     selection,
    //     range,
    //     collapsed: range.collapsed,
    //     start: {
    //       node: range.startContainer,
    //       offset: range.startOffset,
    //       ref: null,
    //       path: null
    //     },
    //     end: {
    //       node: range.endContainer,
    //       offset: range.endOffset,
    //       ref: null,
    //       path: null
    //     }
    //   }
    // }
  }
  return editor;
}