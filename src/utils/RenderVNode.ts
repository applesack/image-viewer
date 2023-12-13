import { defineComponent } from "vue";

const RenderVNode = defineComponent({
  name: 'CustomNode',
  props: {
    node: {
      type: [String, Object],
      required: true
    }
  },
  emits: [],
  setup(props) {
    return () => props.node
  },
  mounted() {
  },
  unmounted() {
  }
})

export default RenderVNode
