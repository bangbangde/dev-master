<template>
  <div class="chat">
    <div class="list">
      <div class="list-item" v-for="(item, i) in records" :key="i">
        <div class="content">{{ item }}</div>
      </div>
      <div v-if="status.error" class="error">{{ status.error }}</div>
    </div>
    <div class="foot-input">
      <CusTextarea
        @keydown="submit"
        v-model="inputText"
        :minLine="1"
        :maxLine="4"
      ></CusTextarea>
      <button class="btn-send" @click="submit">
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

<script setup lang="ts">
import { reactive, ref, nextTick, type Ref } from "vue";
import * as Api from "@/api";
import CusTextarea from "./CusTextarea.vue";
import useTitle from "@/useVue/useTitle";

const Cache = (function () {
  const STORAGE_KEY = "chat_session";
  const load = () => {
    const storeData = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) as string
    );
    return storeData || [];
  };
  const save = (data: string[]) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };
  return {
    load,
    save,
  };
})();

const scrollToBottom = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

const records: Ref<string[]> = ref(Cache.load());
const inputText = ref("");
const status = reactive({
  loading: false,
  error: "",
});

useTitle("Hi, Miss Chen");

function submit(ev: any) {
  const { type, keyCode, shiftKey } = ev as KeyboardEvent;
  if (type === "keydown") {
    if (keyCode === 13 && !shiftKey) {
      (ev as KeyboardEvent).preventDefault();
    } else {
      return;
    }
  }

  if (inputText.value.trim() === "") return;
  if (status.loading) return;
  if (status.error !== "") {
    records.value.pop();
  }
  records.value.push("Human: " + inputText.value);
  inputText.value = "";
  const prompt = records.value.slice(-15).join("\n");
  status.loading = true;
  status.error = "";
  nextTick(scrollToBottom);

  // 滚到底部
  Api.chat(prompt)
    .then((res) => {
      status.loading = false;
      records.value.push("AI: " + res);
      Cache.save(records.value);
      nextTick(scrollToBottom);
    })
    .catch((err) => {
      status.loading = false;
      status.error = (err as Error).message;
    });
}
</script>

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
  bottom: 18px;
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
.error {
  border: 1px solid #ca3c3c;
  border-radius: 4px;
  padding: 4px 8px;
  background-color: #f1d2d2;
}
</style>
