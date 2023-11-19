import { defineComponent } from "vue";

/**
 * ## 将输入[value]限定到max和min之间
 *
 * 如果value大于max，取max; 如果value小于min，取min
 */
export function minmax(value: number, min: number, max: number): number {
  return Math.max(Math.min(value, max), min);
}

interface HtmlElementHandler {
  (el: HTMLElement): void;
}

export function createSlot(handler: HtmlElementHandler) {
  return defineComponent({
    props: ["vNode"],
    mounted() {
      handler(this.$el)
    },
    render() {
      return this.$props.vNode;
    },
  });
}
