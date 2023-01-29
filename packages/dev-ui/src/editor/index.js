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
  insertText(editor, text) {
    const {selection} = editor;
    const {path, offset} = selection
    const node = selection.
  },
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
    const { selection, textMode } = editor;
    if (!selection) return;
    if (textMode) {
      // 插入新的节点，因为要应用 textMode 指定的样式。这里不管当前光标所在节点和 textMode 是否匹配，一律新建 text 节点（后续归一化过程会合并）
    } else {
      editor.commit([
        AtomicOperations.insertText(editor, text),
        AtomicOperations.setSelection(editor, selection)
      ])
    }
  }
}

export const createEditor = () => {
  const editor = {
    key: genKey(),
    content: [],
    operations: [],
    /**
     * 文本节点样式，如：加粗、斜体等等
     * 后续插入的文本要应用此样式
     * 
     * 可以理解为改属性映射到富文本编辑器工具栏里的加粗、斜体等按钮的选中状态
     * link:https://lark-assets-prod-aliyun.oss-cn-hangzhou.aliyuncs.com/yuque/0/2023/png/1576151/1675002523146-resources/1155537/png/62d85f28-49b3-441e-b5ac-a11e936b5f89.png?OSSAccessKeyId=LTAI4GGhPJmQ4HWCmhDAn4F5&Expires=1675004326&Signature=4JIeUn12Mty4KGGALaD8ckw6arE%3D
     */
    textMode: null,
    /**
     * selection: {
     *  collapsed: boolean
     *  start: { path: number[], offset: number },
     *  end: { path: number[], offset: number}
     * }
     */
    selection: null,
    onChange: () => {},
    commit: (operations) => {

    },
    commands: commands.map(fn => fn.bind(null, editor))
  }
  return editor;
}