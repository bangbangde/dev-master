const preHandleContent = content => {
  return content;
}

const insertText = (location, text) => {

}

class Editor {
  content = [];

  selection = {
    anchor: null,
    anchorOffset: 0,
    focus: null,
    focusOffset: 0
  }

  constructor() {}

  setContent(content) {
    this.content = preHandleContent(content);
  }


}