<script setup lang="ts">
import { reactive, onMounted } from "vue";
import * as Api from "@/api";
import CusTextarea from "./CusTextarea.vue";

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

function submit() {
  sendMessage();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sendMessage() {
  const text = data.text;
  data.text = "";
  data.loading = true;
  data.list.push({
    from: "user",
    text,
  });
  return Api.chat(text)
    .then((res) => {
      console.log("response:", res);
      data.list.push({
        from: "ai",
        text: res.text,
      });
    })
    .finally(() => {
      data.loading = false;
    });
}

onMounted(() => {
  Api.initChat().then((res) => {
    console.log(res);
  });
  document.title = "Hi, Miss Cheng.";
});
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
      <CusTextarea
        @keydown.enter.prevent="submit"
        v-model="data.text"
        :minLine="1"
        :maxLine="4"
      ></CusTextarea>
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
  margin-bottom: 100px;
}

.foot-input {
  border-radius: 8px;
  display: flex;
  align-items: flex-end;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 0.75rem 0.75rem 1em;
  overflow: hidden;
  position: fixed;
  bottom: 62px;
  left: 1rem;
  right: 1rem;
  background: white;
}

@media (min-width: 1024px) {
  .foot-input {
    width: 1000px;
    left: 50%;
    right: unset;
    transform: translateX(-50%);
  }
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
  height: 23px;
}

.btn-send svg {
  width: 1.3em;
  height: 1.3em;
  cursor: pointer;
  color: rgb(142, 142, 160);
}

.list-item {
  margin-bottom: 8px;
}
</style>
