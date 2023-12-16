<template>
  <header class="toolbar flex h-12 w-full justify-center bg-image-bg">
    <!-- 左侧 logo + 文件名 -->
    <section class="flex">
      <ToolbarDecorator type="logo" icon="photo-library" />
      <h1 class="ml-2 flex items-center justify-start">{{ props.filename }}</h1>
    </section>

    <!-- 工具按钮组 -->
    <section class="flex flex-1 items-center justify-center space-x-1">
      <ToolbarDecorator icon="photo-library" is-active/>
      <ToolbarDecorator icon="photo-library" />
      <ToolbarDecorator icon="photo-library" disabled/>
      <ToolbarDecorator icon="photo-library" />
    </section>

    <!-- 缩放按钮组 + 关闭按钮 -->
    <section class="flex items-center justify-end">
      <section class="flex items-center justify-center space-x-1">
        <ToolbarDecorator icon="photo-library" is-active icon-size="large"/>
        <ToolbarDecorator icon="photo-library"/>
        <ToolbarDecorator icon="photo-library" disabled/>
      </section>
      <ToolbarDecorator type="control" icon="photo-library" class="ml-6" />
    </section>
  </header>
</template>

<script setup lang="ts">
import { ToolbarProps } from "./types.ts";
import ToolbarDecorator from "./ToolbarDecorator.vue";

defineOptions({
  name: "Toolbar",
});

const props = withDefaults(defineProps<ToolbarProps>(), {
  filename: "",
});
</script>
