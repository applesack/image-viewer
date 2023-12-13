<template>
  <i class="icon relative inline-flex h-[1em] w-[1em] items-center justify-center fill-current" :style="customStyle">
    <svg aria-hidden="true" class="h-[1em] w-[1em]">
      <use :href="symbolId" :fill="color"></use>
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
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);

const customStyle = computed((): CSSProperties => {
  return {
    fontSize: props.size,
  };
});
</script>
