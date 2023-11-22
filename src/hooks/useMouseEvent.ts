import { onMounted, onUnmounted, ref } from "vue";

type SimpleMouseEvent = "up" | "down"

export function useMouseEvent() {
  const mouseEvent = ref<SimpleMouseEvent>('up')

  const mouseUpEventHandler = () => mouseEvent.value = 'up'
  const mouseDownEventHandler = () => mouseEvent.value = 'down'

  onMounted(() => {
    document.addEventListener('mouseup', mouseUpEventHandler)
    document.addEventListener('mousedown', mouseDownEventHandler)
  })

  onUnmounted(() => {
    document.removeEventListener('mouseup', mouseUpEventHandler)
    document.removeEventListener('mousedown', mouseDownEventHandler)
  })

  return mouseEvent
}
