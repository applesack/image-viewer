<template>
  <i class="icon relative inline-flex h-[1em] w-[1em] items-center justify-center" :style="customStyle">
    <svg aria-hidden="true" class="h-[1em] w-[1em]">
      <use :href="symbolId" :class="customClassNames"></use>
    </svg>
  </i>
</template>

<script setup lang="ts">
import { IconProps } from "./types.ts";
import { computed, CSSProperties, inject } from "vue";
import { anotherTheme, DefaultAppConfig, GlobalConfigKey } from "../../common/config.ts";

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
  isActive: false,
  disabled: false,
});

const config = inject(GlobalConfigKey, DefaultAppConfig);

const symbolId = computed(
  () => `#${props.prefix}-${props.name}-${props.isActive ? anotherTheme(config.theme) : config.theme}`,
);

const customStyle = computed((): CSSProperties => {
  return {
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
