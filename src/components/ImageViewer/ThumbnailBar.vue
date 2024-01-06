<template>
  <div
    class="thumbnail-bar flex items-center justify-center space-x-1 overflow-auto bg-image-preview-bg py-1.5"
    ref="containerRef">
    <Thumbnail
      class="shrink-0 grow-0"
      v-for="(thumbnail, thIndex) in items"
      :key="thIndex"
      @click="handleClickThumbnail(thIndex)"></Thumbnail>
  </div>
</template>

<script setup lang="ts">
import Thumbnail from "./Thumbnail.vue";
import { useSlideContent } from "../../hooks/useSlideContent.ts";
import { ref } from "vue";

defineOptions({
  name: "ThumbnailBar",
});

const containerRef = ref<HTMLElement>();
const { scrollTo } = useSlideContent(containerRef);

const handleClickThumbnail = (index: number) => {
  const root = containerRef.value!
  const selected = root.children.item(index) as HTMLElement;
  scrollTo(selected, 'side', 4)
};

const items: [] = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // "",
  // "",
  // "",
  // "",
  // "",
  // "",
  // "",
  // "",
  // "",
  // "",
  // "",
  // "",
  // "",
  // "",
  // "",
  // "",
  "",
];
</script>
