<template>
  <div class="slide-box" :class="customContainerNames">
    <div class="inline-flex" ref="slotRef">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SlideBoxProps } from "./types.ts";
import { computed, onMounted, reactive, ref } from "vue";
import { useResizeListener } from "../../hooks/useResizeListener.ts";

defineOptions({
  name: "SlideBox",
});

const props = withDefaults(defineProps<SlideBoxProps>(), {
  axis: "x",
  overlay: true,
  getPlacement: "center",
});

const slotRef = ref<HTMLElement>();
const slide = reactive({
  containerWidth: 0,
  contentWidth: 0,
});

const customContainerNames = computed(() => {
  if (props.axis === "x") {
    return "overflow-x-hidden w-full";
  } else {
    return "overflow-y-hidden h-full";
  }
});

const isOverflow = computed(() => slide.contentWidth > slide.containerWidth);

const customContainerStyles = computed(() => {
  isOverflow.value;
  return {};
});

const placementClassNames = (): string[] => {
  const preset = ["flex", "items-center"];

  switch (props.placement) {
    case "left":
      preset.push("justify-start");
      break;
    case "center":
      preset.push("justify-center");
      break;
    case "right":
      preset.push("justify-end");
      break;
  }
  return preset;
};

const containerResizeHandler = () => {
  const rect = slotRef.value?.getBoundingClientRect();
  console.log(rect);
};

onMounted(() => {
  useResizeListener(containerResizeHandler, slotRef.value!!);
});
</script>
