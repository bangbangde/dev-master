<template>
  <main>
    <div class="wrapper">
      <div class="left">
        Title:
      </div>
      <div class="right">
        <AutoMeasureText text="hello world.hello world.hello world.hello world.hello world.hello world.hello world." />
      </div>
    </div>
    
  </main>
</template>

<script setup>
import { reactive, ref, computed, defineExpose, onMounted, nextTick } from 'vue';
import AutoMeasureText from '../components/AutoMeasureText.vue';

</script>
<style>
.wrapper {
  display: flex;
  max-width: 300px;
}
.left {
  flex: 0 0 auto;
}
.right {
  flex: 1 1 0;
  width: 0;
  outline: 1px solid yellowgreen;
}
</style>