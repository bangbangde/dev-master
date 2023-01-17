<template>
  <div class="section-home">
    <p>Simple Editor</p>
    <VueEditor ref="vueEditor" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import VueEditor from "@/editor/Editor.vue";
import doc from "@/editor/demo.json";
// 插件
import ImageInline from "@/editor/plugins/image-inline/index.js";
import CodeBlock from "@/editor/plugins/code-block/index.js";

const vueEditor = ref(null);

onMounted(() => {
  vueEditor.value.init({
    plugins: [ImageInline, CodeBlock],
    content: doc
  });
});

</script>

<style scoped>
</style>