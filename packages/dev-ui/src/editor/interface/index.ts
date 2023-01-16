// 文档由 Block 及 Text 元素构成
export interface Document {
  meta: {
    [key: string]: unknown
  }
  children: Element[]
}

export interface Node {
  key: string
  [key: string]: unknown
}

export interface Element extends Node {
  isBlock: Boolean
}

/**
 * 文本节点
 */
export interface Text extends Element {
  
  text: string
}