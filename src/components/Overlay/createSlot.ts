import { defineComponent } from "vue";

interface HtmlElementHandler {
  (el: HTMLElement): void;
}

export default (handler: HtmlElementHandler) => {
  return defineComponent({
    props: ["vNode"],
    mounted() {
      handler(this.$el)
    },
    render() {
      return this.$props.vNode;
    },
  });
};
