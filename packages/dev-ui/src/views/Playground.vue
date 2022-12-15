<script setup>
import { reactive, ref, computed, defineExpose, onMounted } from 'vue';

// 响应式变量
let title = ref('hello world');
const data = reactive({
  title,
  count: 0,
  list: [1, 2, 3]
});

// 计算属性
const computedTitle = computed(() => title.value + ' ' + data.count + "!");

// refs
const input = ref(null);
const itemRefs = ref(null);

// methods
const increase = () => {
  data.count++;
}

// 暴露接口给父组件
defineExpose({
  data,
  increase
})

// 生命周期函数
onMounted(() => {
  console.log(input, itemRefs);
});
</script>

<template>
  <main>
    <h1 ref="input" @click="increase">{{computedTitle}}</h1>
    <ul>
      <li v-for="item in data.list" ref="itemRefs">{{ item }}</li>
    </ul>
  </main>
</template>
