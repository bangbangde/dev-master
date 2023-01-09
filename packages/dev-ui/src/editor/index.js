import { genKey } from "./utils";
/**
 * 预处理富文本源码
 */
function preHandleContent(content) {
  content = JSON.parse(JSON.stringify(content));
  if (!Array.isArray(content)) throw new Error('文档数据格式错误：根结点不是数组。');

  // 插入默认文本
  if (content.length === 0) {
    content.push(createBlock('hello world'));
  }
  return content;
}

/**
 * 创建 block
 * @param {string} initContent 
 * @returns 
 */
function createBlock(initContent) {
  return {
    key: genKey(),
    is: 'block',
    content: [
      { key: genKey(), is: 'text', content: initContent }
    ] 
  }
}

/**
 * Simple Editor
 */
export default class Editor {
  content = null;

  constructor() {}

  /**
   * 初始化内容
   */
  setContent(content) {
    this.content = preHandleContent(content);
  }

  /**
   * 同步数据
   */
  updateByPath(path, content) {

  }
}