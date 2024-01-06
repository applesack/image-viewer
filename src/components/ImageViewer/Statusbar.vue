<template>
  <Drawer :open="showThumbnail" placement="top" class="statusbar bg-image-status-bar-bg">
    <!-- 缩略图区域 -->
    <template v-slot:overlay>
      <ThumbnailBar class="w-full"></ThumbnailBar>
    </template>

    <!-- 状态栏 -->
    <section class="flex h-10 w-full items-center justify-center">
      <Decorator :icon="thumbnailControlIcon" icon-size="lg" @click="toggleShowThumbnail" />
      <span class="ml-0.5 mr-auto block h-6 w-px bg-image-btn-hover"></span>

      <section class="flex items-center justify-center space-x-0.5">
        <span class="mr-2">51%</span>
        <Decorator icon="zoom-in" icon-size="lg" disabled />
        <Decorator icon="zoom-out" icon-size="lg" />
        <Decorator icon="aspect-ratio" icon-size="lg" disabled />
        <Decorator icon="real-size" icon-size="lg" />

        <span class="block h-6 w-px bg-image-btn-hover"></span>
        <Decorator icon="open-in-full" icon-size="xl" />
      </section>
    </section>
  </Drawer>
</template>

<script setup lang="ts">
import Decorator from "./Decorator.vue";
import { computed, ref } from "vue";
import ThumbnailBar from "./ThumbnailBar.vue";
import Drawer from "../Layout/Drawer/Drawer.vue";

const showThumbnail = ref<boolean>(false);
const thumbnailControlIcon = computed((): string => {
  return showThumbnail.value ? "bottom-panel-open" : "bottom-panel-close";
});

const toggleShowThumbnail = () => {
  showThumbnail.value = !showThumbnail.value;
};
</script>
