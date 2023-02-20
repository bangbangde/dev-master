<template>
  <textarea
    :rows="line"
    :value="modelValue"
    @input="
      $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
    "
  ></textarea>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps(["modelValue", "maxLine"]);
defineEmits(["update:modelValue"]);

const line = computed(() => {
  let line = (props.modelValue || "").split("\n").length;
  if (line === 0) {
    line = 1;
  } else if (line > props.maxLine) {
    line = props.maxLine;
  }
  return line;
});
</script>
