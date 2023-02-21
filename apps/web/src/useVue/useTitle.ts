import { onMounted, onUnmounted } from "vue";

export default function useTitle(title: string) {
  let titleBack = "";
  onMounted(() => {
    titleBack = document.title;
    document.title = title;
  });
  onUnmounted(() => {
    document.title = titleBack;
  });
}
