import { genKey } from "./utils";

const createOperation = {
  insertText: (path, text) => ({ type: 'insert_text', path, text }),
  removeText: (path, offset, backword) => ({ type: 'remove_text', path, offset, backword }),
  insertNode: (path, node) => ({}),
  splitNode: (path) => ({}),
  mergeNode: (range) => ({}),
  setNode: (path, property) => ({ type: 'set_node', property })
}

export const createEditor = () => {
  const editor = {
    key: genKey(),
    content: null,
    selection: null,
    operations: [],
    command: {
      insertText() {},
      insertNode() {},
      setNode() {}
    },
    setContent(content) {

    }
  }
  return editor;
}