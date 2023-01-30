import { 
  genKey,
  createDeepCopy,
  comparePlainObjects
} from "./utils";

/**
 * 一条命令相当于一个事务，包含若干条原子操作，所有同步的原子操作结束后同步结果到 editor
 */
const startTransaction = (editor, fn) => {
  return new Promise((resolve) => {
    let res;
    try {
      const [content, selection] = createDeepCopy([editor.content, editor.selection]);
      res = fn(content, selection);
    } finally {
      const {content, selection} = res || {};
      editor.content = content;
      editor.selection = selection;
      editor.onChange(res);
      resolve(res);
    }
  })
}

const Node = {
  getNodeByPath(content, path) {
    return path.reduce((p, c) => p[c], {children: content});
  },
  text: {
    // 判断两个文本节点类型是否相同
    equals(node, target) {
      const ignore = {
        type: null,
        text: null
      }
      return comparePlainObjects({...node, ...ignore}, {...target, ...ignore})
    }
  }
}

/**
 * 原子操作
 * 
 * 所有操作都会返回全新的 content 以及 selection
 */
const AtomicOperations = {
  // 文字操作
  insertText(content, selection, options) {
    const { path, offset, text } = op;
    return { content, selection };
  },
  removeText(content, selection, options) {
    return { content, selection };
  },
  // 节点操作
  insertNode(content, selection, options) {
    const { node, path } = options;
    const target = path.slice(0, path.length - 1).reduce((p, c) => p[c], content);
    const index = path[path.length - 1];
    target.splice(index, 0, node);
    return { content, selection };
  },
  mergeNode(content, selection, options) {
    return { content, selection };
  },
  moveNode(content, selection, options) {
    return { content, selection };
  },
  removeNode(content, selection, options) {
    return { content, selection };
  },
  setNode(content, selection, options) {
    return { content, selection };
  },
  splitNode(content, selection, options) {
    return { content, selection };
  },
  // 选区操作
  setSelection(content, selection, options) {
    const { newProperties } = options;
    return { content, selection: { ...selection, ...newProperties } };
  }
}

/**
 * 上层操作指令，内部分解为原子操作
 * * 所有变更都必须由 command 发起
 */
const command = {
  /**
   * 插入文本
   * 职责：
   * - 判断是否需要插入新的节点
   * - 将操作拆解为 removeNode、mergeNode、splitNode
   */
  insertText(editor, text) {
    startTransaction(editor, (content, selection) => {
      const { curTextProps } = editor.curTextProps;
      const {anchor, focus, collapsed} = selection;
      if (collapsed) {
        const targetNode = Node.getNodeByPath(content, anchor.path);

        if (curTextProps && !Node.text.equals(targetNode, curTextProps)) {
          // 需要插入新的文本节点以应用新的样式
          return AtomicOperations.insertText(content, selection, { text });
        } else {
          // 样式匹配，可以在当前文本节点直接插入
          return AtomicOperations.insertText(content, selection, { text });
        }
      } else {
        const anchorNode = Node.getNodeByPath(content, anchor.path);
        const focusNode = Node.getNodeByPath(content, focus.path);
        // TODO
      }
    })
  },
  insertNodes(editor, nodes) {
    startTransaction(editor, (content, selection) => {
      if (selection) {
        // TODO
      } else {
        let res;
        nodes.forEach((node, i) => {
          res = AtomicOperations.insertNode(content, selection, {
            node, 
            path: [content.length + i]
          });
        });
        return res;
      }
    });
  },
  setSelection(editor, newProperties) {
    startTransaction(editor, (content, selection) => {
      return AtomicOperations.setSelection(content, selection, { newProperties });
    });
  }
}

export const createEditor = () => {
  const editor = {
    key: genKey(),
    content: [],
    /**
     * 文本节点样式，如：加粗、斜体等等
     * 后续插入的文本要应用此样式
     * 
     * 可以理解为改属性映射到富文本编辑器工具栏里的加粗、斜体等按钮的选中状态
     * link:https://lark-assets-prod-aliyun.oss-cn-hangzhou.aliyuncs.com/yuque/0/2023/png/1576151/1675002523146-resources/1155537/png/62d85f28-49b3-441e-b5ac-a11e936b5f89.png?OSSAccessKeyId=LTAI4GGhPJmQ4HWCmhDAn4F5&Expires=1675004326&Signature=4JIeUn12Mty4KGGALaD8ckw6arE%3D
     */
    curTextProps: null,
    /**
     * selection: {
     *  collapsed: boolean
     *  anchor: { path: number[], offset: number },
     *  focus: { path: number[], offset: number}
     * }
     */
    selection: null,
    onChange: () => {},
    addCurTextProp(prop, value) {},
    removeCurTextProp(prop, value) {}
  }

  editor.command = (function(){
    const tmp = {};
    Object.entries(command).forEach(([k, fn]) => {
      tmp[k] = fn.bind(null, editor);
    });
    return tmp;
  })();

  return editor;
}
