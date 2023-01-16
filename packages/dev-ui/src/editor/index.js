import { genKey } from "./utils";

const createOperation = {
  insertText: (path, text) => ({ type: 'insert_text', path, text }),
  removeText: (path, offset, backword) => ({ type: 'remove_text', path, offset, backword }),
  insertNode: (path, offset, node) => ({}),
  splitNode: (path) => ({}),
  mergeNode: (range) => ({}),
  setNode: (path, property) => ({ type: 'set_node', property })
}

export const createEditor = () => {
  let content = null;
  let selection = null;
  let operations = [];

  const editor = {
    key: genKey(),
    command: {
      insertText: text => {},
      insertNode: node => {}
    },
    setContent(content) {

    }
  }
  return editor;
}