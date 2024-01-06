<template>
  <div class="toolbar-decorator" :class="customClassNames">
    <SvgIcon :name="icon" :size="customIconSize" :is-active="isActive" :disabled="disabled" />
  </div>
</template>

<script setup lang="ts">
import type { DecoratorSize, DecoratorProps } from "./types.ts";
import { computed } from "vue";
import SvgIcon from "../Icon/SvgIcon.vue";

defineOptions({
  name: "Decorator",
});

const props = withDefaults(defineProps<DecoratorProps>(), {
  iconSize: "md",
  type: "button",
  secondary: false,
  isActive: false,
  disabled: false,
});

const getTypeClassNames = () => {
  const commonStyle = "flex justify-center items-center";
  switch (props.type) {
    case "logo":
      return `h-12 w-12 ${commonStyle} bg-image-logo-bg`;
    case "button":
      return `h-10 w-10 ${commonStyle} rounded`;
    case "control":
      return `h-10 w-14 ${commonStyle} mb-auto`;
  }
};

const getHoverClassNames = (): string => {
  if (props.disabled) {
    return "";
  }
  switch (props.type) {
    case "logo":
      return "hover:bg-image-logo-a-bg";
    case "button":
      return "hover:bg-image-btn-hover";
    case "control":
      return "hover:bg-danger";
  }
};

const getIconSizeClassNames = (size: DecoratorSize): string => {
  switch (size) {
    case "md":
      return "1.125rem";
    case "lg":
      return "1.25rem";
    case "xl":
      return "1.375rem";
  }
};

const getActiveClassNames = () => {
  return props.isActive ? "bg-highlight hover:bg-highlight-hover" : "";
};

const customClassNames = computed(() => {
  return [getTypeClassNames(), props.isActive ? getActiveClassNames() : getHoverClassNames()];
});

const customIconSize = computed((): string => {
  return getIconSizeClassNames(props.iconSize);
});
</script>
