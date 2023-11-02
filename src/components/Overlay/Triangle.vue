<template>
  <svg class="icon w-[12px] h-[10px]" :class="rotateDeg" width="12" height="10" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
    <polygon class="triangle fill-[#8b8988] stroke-[#8b8988] stroke-[25]" stroke-linejoin="round" points="15,85 105,85 60,15"/>
  </svg>
</template>

<script setup lang="ts">
import { TriangleProps } from "./types.ts";
import { computed } from "vue";

defineOptions({
  name: "Triangle",
});

const props = withDefaults(defineProps<TriangleProps>(), {
  type: "top",
});

const rotateDeg = computed(() => {
  switch (props.type) {
    case "top":
      return "rotate-0";
    case "right":
      return "rotate-90";
    case "bottom":
      return "rotate-180";
    default:
      return "-rotate-90";
  }
});
</script>
