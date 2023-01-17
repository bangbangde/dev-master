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
  let _selection = null;
  let _operations = [];

  const editor = {
    key: genKey(),
    plugins,
    command: {
      insertText: text => {},
      insertNode: node => {}
    },
    getContent() {
      return JSON.parse(JSON.stringify(_content));
    },
    setContent(content) {
      _content = JSON.parse(JSON.stringify(content));
      editor.onChange()
    },
    onChange: () => {}
  }
  return editor;
}