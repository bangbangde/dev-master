## 如何呈现富文本

基于 vue 的组件易扩展。

## 如何编辑富文本

contenteditable。处理好用户各种形式的输入和选区即可。

文档初始化流程

1. 解析内容，转换为 UI 框架可用的数据结构（为每个节点生成唯一 key）


Render[vue]



Engine[reactive]


Core
 - Model
  - setDataByPath
  - contentChange
 - Command
  - 
 - 



 #### Command

 [
  {
    type: commandBatch,
    commands: []
  },
  {
    type: command,
    command: {
      range: {},
      executed: boolean,
      content: {}
      timestamp
    }
  }
 ]