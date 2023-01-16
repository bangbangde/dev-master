import { genKey } from "./utils";

export const createEditor = () => {
  const editor = {
    key: genKey(),
    content: null,
    selection: null,
    command: {
    },
    setContent(content) {}
  }
  return editor;
}