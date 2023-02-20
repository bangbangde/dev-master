<script setup lang="ts">
import { reactive } from "vue";
import * as Api from "@/api";

interface IData {
  list: Array<{ from: "user" | "ai"; text: string }>;
  text: string;
  loading: boolean;
}

const data: IData = reactive({
  list: [],
  text: "",
  loading: false,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sendMessage(ev: MouseEvent) {
  const msg = data.text;
  data.loading = true;
  return Api.chat(msg)
    .then((res) => {
      // eslint-disable-next-line no-debugger
      debugger;
      data.list.push({
        from: "ai",
        text: res,
      });
    })
    .finally(() => {
      data.loading = false;
    });
}
</script>

<template>
  <div class="chat">
    <div class="list">
      <div class="list-item" v-for="(item, i) in data.list" :key="i">
        <div class="avatar" :class="[item.from]"></div>
        <div class="content">{{ item.text }}</div>
      </div>
    </div>
    <div class="foot-input">
      <textarea v-model="data.text"></textarea>
      <button class="btn-send" @click="sendMessage">
        <svg
          stroke="currentColor"
          fill="none"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4 mr-1"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat {
  padding: 20px;
}

.foot-input {
  position: absolute;
  top: calc(100vh - 150px);
  left: 0;
  right: 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 0.75rem 0.75rem 1em;
  overflow: hidden;
}

.foot-input textarea {
  border: none;
  width: 100%;
  resize: none;
  max-height: 200px;
  min-height: 24px;
  overflow-y: hidden;
  appearance: none;
  background-color: #fff;
  border-color: #8e8ea0;
  border-radius: 0;
  border-width: 1px;
  font-size: 1rem;
  line-height: 1.5rem;
}

textarea:focus-visible {
  outline: none;
}

.foot-input .btn-send {
  background-color: transparent;
  border: none;
  line-height: 0;
}

.btn-send svg {
  width: 1.3em;
  height: 1.3em;
  cursor: pointer;
  color: rgb(142, 142, 160);
}
</style>
