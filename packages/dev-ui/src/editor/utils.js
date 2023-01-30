import { onMounted, onUnmounted } from 'vue';

export function useEventListener(target, event, callback) {
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}

export const genKey = () => Math.random().toString(32).slice(2);

export const createDeepCopy = obj => JSON.parse(JSON.stringify(obj));

/**
 * 判断两个 plain 对象是否相同【属性数量、对应属性值均相同即可】
 * @param {*} a object
 * @param {*} b object
 * @returns boolean
 */
export const comparePlainObjects = (a, b) => {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA !== keysB) return false;
  return keysA.every(k => a[k] === b[k]);
}

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

export function debounce(fn, delay = 0, {immediate = false, maxWait, debug = false}) {
  let lastInvokeTime = 0;
  let timerId = null;
  let firstInvokeTime = 0;

  const log = (...args) => {
    debug && console.log(...args);
  }

  function debounced(...args) {
    log('debounce: event');
    if (immediate) {
      // 立即执行
      const time = Date.now();
      if (time - lastInvokeTime > delay) {
        fn(...args);
        log('debounce: invoked immediate');
        if (maxWait) {
          setTimeout(() => {
            log('debounce: immediate maxWait');
            lastInvokeTime = 0;
          }, maxWait);
        }
      } else {
        log('debounce: discard');
      }
      
      lastInvokeTime = time;
    } else {
      // 延后执行
      const time = Date.now();
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;

        if (maxWait && (time - firstInvokeTime > maxWait)) {
          fn(...args);
          log('debounce: invoked delay (Timeout)');
          firstInvokeTime = time;
        } else {
          timerId = setTimeout(() => {
            fn(...args);
            log('debounce: invoked delay');
            timerId = null;
          }, delay);
          log('debounce: delay reset');
        }
      } else {
        timerId = setTimeout(() => {
          fn(...args);
          log('debounce: invoked delay');
          timerId = null;
        }, delay);
        firstInvokeTime = time;
        log('debounce: delay set');
      }
    }
  }
  return debounced;
}