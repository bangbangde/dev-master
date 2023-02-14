import { 
  genKey,
  createDeepCopy,
  comparePlainObjects
} from "./utils";

/**
 * 一条命令相当于一个事务，包含若干条原子操作，所有同步的原子操作结束后同步结果到 editor
 */
const startTransaction = (editor, fn) => {
  editor.operations = [];
  return new Promise((resolve) => {
    let res;
    try {
      const [content, selection] = createDeepCopy([editor.content, editor.selection]);
      // 原子操作都应用到副本上
      res = fn({
        ...editor,
        content,
        selection
      });
    } catch(err) {
      console.error(err);
    } finally {
      // 应用所有原子操作产生的更新
      const {content, selection} = res || {};
      editor.content = content;
      editor.selection = selection;
      editor.onChange({
        operations: editor.operations,
        ...res
      });
      resolve(res);
    }
  })
}

const Helper = {
  node: {
    getNodeByPath(content, path) {
      return path.reduce((p, c) => p[c], {children: content});
    }
  },
  text: {
    equals(node, target) {
      const ignore = {
        type: null,
        text: null
      }
      return comparePlainObjects({...node, ...ignore}, {...target, ...ignore})
    }
  },
  selection: {
  }
}

const apply = (editor, operation) => {
  // 操作的是副本，成功后再更新回 editor
  const content = createDeepCopy(editor.content);
  let selection = editor.selection && createDeepCopy(editor.selection);

  switch(operation.type) {
    case 'insert_node': 
      const { node, path } = operation;
      const target = path.slice(0, path.length - 1).reduce((p, c) => p[c], content);
      const index = path[path.length - 1];
      target.splice(index, 0, node);    
      break;
    case 'insert_text': break;
    case 'set_selection': break;
    default:
      throw new Error('unknown operation type: ' + op.type);
  }

  editor.content = content;
  editor.selection = selection;
  editor.operations.push(operation);

  /**
   * 因为原子操作都是同步的，所以可以将刷新操作放到微任务队列，
   * 保证一个指令不管调用了几个原子操作只触发一次刷新。
   */
  if (editor.isFlushing) return;
  editor.isFlushing = true;
  Promise.resolve().then(() => {
    // 可以在这里做 normalize
  }).then(() => {
    editor.isFlushing = false;
    editor.onChange();
    editor.operations = []
  })
}

const command = {
  insertText(editor, text) {
    const { curTextProps, selection } = editor;
    if (!selection) return;
    // TODO
  },
  insertNodes(editor, nodes) {
    const {content, selection} = editor;
    if (selection) {
      // TODO
    } else {
      nodes.forEach((node, i) => {
        editor.apply({
          type: 'insert_node',
          node, 
          path: [content.length + i]
        });
      });
    }
  },
  setSelection(editor, newSelection, shouldUpdateDom) {
    editor.apply({
      type: 'set_selection',
      newSelection,
      shouldUpdateDom
    })
  }
}

export const createEditor = () => {
  const editor = {
    key: genKey(),
    content: [],
    operations: [],
    isFlushing: false,
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
     *  isCollapsed: boolean
     *  isForward: boolean
     *  anchor: { path: number[], offset: number },
     *  focus: { path: number[], offset: number}
     * }
     */
    selection: null,
    onChange: () => {},
    addCurTextProp(prop, value) {},
    removeCurTextProps(prop, value) {}
  }

  editor.apply = apply.bind(null, editor);
  editor.command = (function(){
    const tmp = {};
    Object.entries(command).forEach(([k, fn]) => {
      tmp[k] = fn.bind(null, editor);
    });
    return tmp;
  })();

  return editor;
}
