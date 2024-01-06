<template>
  <div class="h-screen w-screen">
    <ImageViewer> </ImageViewer>
  </div>
</template>

<script setup lang="ts">
import { provide } from "vue";
import { GlobalConfigKey, useApplicationConfig } from "./common/configs.ts";
import ImageViewer from "./components/ImageViewer/ImageViewer.vue";

const config = useApplicationConfig();
provide(GlobalConfigKey, config);

// setTimeout(() => {
//   config.theme = "dark";
// }, 3000);
</script>
