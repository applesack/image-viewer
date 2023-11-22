import { onMounted, onUnmounted, ref } from "vue";

export function useMousePosition() {
  const mouseX = ref<number>(0);
  const mouseY = ref<number>(0);

  const updateMousePosition = (e: MouseEvent) => {
    mouseX.value = e.pageX;
    mouseY.value = e.pageY;
  };

  onMounted(() => {
    document.addEventListener("mousemove", updateMousePosition);
  });
  onUnmounted(() => {
    document.removeEventListener("mousemove", updateMousePosition);
  });

  return {
    mouseX,
    mouseY,
  };
}
