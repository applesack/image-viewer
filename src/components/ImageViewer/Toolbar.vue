<template>
  <header class="toolbar relative flex h-12 w-full justify-center">
    <!-- 左侧 logo + 文件名 -->
    <section class="mr-auto flex">
      <Decorator type="logo" icon="photo-library" />
      <h1 class="ml-4 flex items-center justify-start text-sm">{{ props.filename }}</h1>
    </section>

    <!-- 工具按钮组 -->
    <section class="absolute flex items-center justify-center space-x-1">
      <Decorator icon="rotate-90" />
      <Decorator icon="delete" />
      <Decorator icon="favorite" disabled />
      <Decorator icon="info" />
      <Decorator icon="print" />
      <Decorator icon="more-horiz" />
    </section>

    <!-- 缩放按钮组 + 关闭按钮 -->
    <section class="flex items-center justify-end">
      <Decorator type="control" icon="close" class="ml-6" />
    </section>
  </header>
</template>

<script setup lang="ts">
import { ToolbarProps } from "./types.ts";
import Decorator from "./Decorator.vue";

defineOptions({
  name: "Toolbar",
});

const props = withDefaults(defineProps<ToolbarProps>(), {
  filename: "",
});
</script>
