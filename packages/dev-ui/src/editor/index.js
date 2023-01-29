import { genKey } from "./utils";

const createOperation = {
  insertText: (path, text) => ({ type: 'insert_text', path, text }),
  removeText: (path, offset, backword) => ({ type: 'remove_text', path, offset, backword }),
  insertNode: (path, offset, node) => ({}),
  splitNode: (path) => ({}),
  mergeNode: (head, tail) => ({}),
  setNode: (path, property) => ({ type: 'set_node', property })
}

/**
 * 原子操作
 */
const AtomicOperations = {
  // 文字操作
  insertText(editor, text) {},
  removeText(editor) {},
  // 节点操作
  insertNode(editor, node) {},
  mergeNode(editor) {},
  moveNode(editor) {},
  removeNode(editor) {},
  setNode(editor) {},
  splitNode(editor) {},
  // 选区操作
  setSelection(editor, selection) {}
}

/**
 * 上层操作指令，内部分解为原子操作
 */
const commands = {
  insertText(editor, text) {
    const { selection } = editor;
    if (!selection) return;
    editor.apply([
      AtomicOperations.insertText(editor, text),
      AtomicOperations.setSelection(editor, selection)
    ])
  }
}

export const createEditor = () => {
  const editor = {
    key: genKey(),
    content: [],
    operations: [],
    /**
     * selection: {
     *  collapsed: boolean
     *  start: { path: number[], offset: number },
     *  end: { path: number[], offset: number}
     * }
     */
    selection: null,
    onChange: () => {},
    apply: (operations) => {

    },
    commands: commands.map(fn => fn.bind(null, editor))
  }
  return editor;
}