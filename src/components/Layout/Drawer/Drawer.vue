<template>
  <div class="drawer" :class="containerLayoutClassNames">
    <div class="drawer-content flex-1" :class="props.bodyClassName" :style="props.bodyStyle">
      <slot name="default" class="h-full w-full" />
    </div>
    <Transition name="slide" v-on="transitionEvents">
      <div class="drawer-aside" :class="asideLayoutClassNames" v-show="open">
        <slot name="overlay" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { DrawerProps } from "./types.ts";
import { computed } from "vue";
import { isHorizontal } from "../../../common/constants.ts";

defineOptions({
  name: "Drawer",
});

const props = withDefaults(defineProps<DrawerProps>(), {
  placement: "right",
});

const containerLayoutClassNames = computed((): string[] => {
  const preset = ["flex"];
  switch (props.placement) {
    case "left":
      preset.push("flex-row-reverse");
      break;
    case "right":
      break;
    case "top":
      preset.push("flex-col-reverse");
      break;
    case "bottom":
      preset.push("flex-col");
      break;
  }
  return preset;
});

const asideLayoutClassNames = computed((): string[] => {
  if (isHorizontal(props.placement)) {
    return ['h-full']
  }
  return ['w-full']
})

const setAxisWidth = (el: HTMLElement, value: string) => {
  if (isHorizontal(props.placement)) {
    el.style.width = value;
  } else {
    el.style.height = value;
  }
};

const getAxisWidth = (el: HTMLElement): string => {
  if (isHorizontal(props.placement)) {
    return `${el.scrollWidth}`;
  } else {
    return `${el.scrollHeight}`;
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const transitionEvents: Record<string, (el: HTMLElement) => void> = {
  beforeEnter(el) {
    setAxisWidth(el, "0");
    el.style.overflow = "hidden";
  },
  enter(el) {
    setAxisWidth(el, `${getAxisWidth(el)}px`);
  },
  afterEnter(el) {
    setAxisWidth(el, "");
    el.style.overflow = "";
  },
  beforeLeave(el) {
    setAxisWidth(el, `${getAxisWidth(el)}px`);
    el.style.overflow = "hidden";
  },
  leave(el) {
    setAxisWidth(el, "0");
  },
  afterLeave(el) {
    setAxisWidth(el, "");
    el.style.overflow = "";
  },
};
</script>
