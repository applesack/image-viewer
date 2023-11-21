import { defineComponent } from "vue";

/**
 * ## 将输入[value]限定到max和min之间
 *
 * 如果value大于max，取max; 如果value小于min，取min
 */
export function minmax(value: number, min: number, max: number): number {
  return Math.max(Math.min(value, max), min);
}

/**
 * 判断两个数值是否近似
 *
 * 判断依据是比较两数量差的绝对值，如果小于error值，那么认为两个数是近似的
 */
export function isApproximate(a: number, b: number, error: number = 2) {
  return Math.abs(a - b) < error
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
