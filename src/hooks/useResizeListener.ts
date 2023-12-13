import { onBeforeUnmount } from "vue";

export function useResizeListener(callback: ResizeObserverCallback, target?: Element, options?: ResizeObserverOptions) {
  const observer = new ResizeObserver(callback);

  if (target !== null) {
    observer.observe(target!, options);
  }

  onBeforeUnmount(() => {
    observer.disconnect();
  });

  return {
    observe: observer.observe,
  };
}
