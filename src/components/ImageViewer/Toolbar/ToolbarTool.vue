<template>
  <div class="tool-button h-10 w-10" :class="dynamicCss">
    <Icon :icon="props.icon" class=""></Icon>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Icon from "../../Icon/SvgIcon.vue";
import { ToolButtonProps } from "./types.ts";

defineOptions({
  name: "ToolbarTool",
});

const props = defineProps<ToolButtonProps>()

const active = ref(false);

const dynamicCss = {
  "": active.value,
};
</script>

<style scoped></style>
