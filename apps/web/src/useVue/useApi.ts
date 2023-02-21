import { ref, type Ref } from "vue";

export default function useApi<T>(api: Promise<T>) {
  const loading = ref(false);
  const data: Ref<T | null> = ref(null);
  const error: Ref<Error | null> = ref(null);
  loading.value = true;

  api
    .then((res) => {
      data.value = res;
    })
    .catch((err) => {
      error.value = err;
    })
    .finally(() => {
      loading.value = false;
    });

  return {
    loading,
    data,
    error,
  };
}
