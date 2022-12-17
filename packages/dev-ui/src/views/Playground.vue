<template>
  <main>
    <input type="text" :value="inputVal" @input="handleInput" />
  </main>
</template>

<script setup>
import { reactive, ref, computed, defineExpose, onMounted, nextTick } from 'vue';
const inputVal = ref('233');
function handleInput(ev) {
  inputVal.value = '666';
}
</script>
