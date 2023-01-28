// export * 不会导出 default
// 冲突的变量会直接抛弃
export * from './a.mjs';
export * from './b.mjs';
export default {
  name: 'index',
  index: '*'
}