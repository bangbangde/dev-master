import { onMounted, onUnmounted } from 'vue';

export function useEventListener(target, event, callback) {
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}

export const genKey = () => Math.random().toString(32).slice(2);

export const getDirectParentComp = (nodeRefs, node) => {
  if (node.id && nodeRefs.value[node.id]) {
    return {
      el: node,
      comp: nodeRefs.value[node.id]
    }
  } else {
    return node.parentElement && getDirectParentComp(node.parentElement);
  }
}

export function throttle(fn, delay){
}

export function debounce(fn,delay){
}