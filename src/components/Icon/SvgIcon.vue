<template>
  <i role="img" class="icon relative inline-flex h-[1em] w-[1em] items-center justify-center" :style="customStyle">
    <svg aria-hidden="true" class="h-[1em] w-[1em]">
      <use :href="symbolId" :class="customClassNames"></use>
    </svg>
  </i>
</template>

<script setup lang="ts">
import { IconProps } from "./types.ts";
import { computed, CSSProperties } from "vue";

// 图标来源 https://fonts.google.com/icons

defineOptions({
  name: "SvgIcon",
  inheritAttrs: false,
});

const inherit = "inherit" as const;

const props = withDefaults(defineProps<IconProps>(), {
  prefix: "icon",
  size: inherit,
  color: inherit,
  rotation: 0,
  isActive: false,
  disabled: false,
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);

const customStyle = computed((): CSSProperties => {
  return {
    transform: `rotate(${props.rotation}deg)`,
    fontSize: props.size,
  };
});

const customClassNames = computed(() => {
  if (props.disabled) {
    return "fill-icon-inactive";
  }
  return props.isActive ? "fill-invert" : "fill-current";
});
</script>
