<template>
  <span class="auto-measure-text" :class="[data.collapsed ? 'collapsed' : 'expanded']">
    <span ref="textShadow" class="text-shadow">{{ text }}</span>
    <span ref="textInner" class="text-inner">{{ text }}</span>
    <button
      v-if="data.shouldShowBtn"
      class="btn-collapse-expand"
      type="button"
      @click="handleClick"
    >{{ data.collapsed ? '展开' : '收起' }}</button>
  </span>
</template>

<script setup>
import {defineProps, reactive, watch, ref, watchPostEffect, computed} from "vue";

const props = defineProps({
  text: String
});

const textShadow = ref(null);
const textInner = ref(null);

const data = reactive({
  shaodwBundery: null,
  textBundary: null,
  collapsed: true,
  shouldShowBtn: false
});

watchPostEffect(() => {
  console.log(props.text);
  data.shaodwBundery = textShadow.value.getBoundingClientRect().width;
  data.textBundary = textInner.value.getBoundingClientRect().width;
  data.shouldShowBtn = data.textBundary < data.shaodwBundery;
})

function handleClick(ev) {
  data.collapsed = !data.collapsed;
}

</script>

<style>
.auto-measure-text {
  display: inline-block;
  position: relative;
  padding: 0 50px 0 0;
  max-width: 100%;
}
.text-shadow {
  display: inline-block;
  position: absolute;
  opacity: 0;
  white-space: nowrap;
}
.collapsed .text-inner {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  vertical-align: bottom;
 }
.btn-collapse-expand {
  position: absolute;
  right: 0;
  top: 0;
}
</style>