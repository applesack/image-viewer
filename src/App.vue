<template>
  <div class="h-screen w-screen">
    <Toolbar filename="12123"></Toolbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide } from "vue";
import Toolbar from "./components/ImageViewer/Toolbar/Toolbar.vue";
import { GlobalConfigKey, useApplicationConfig } from "./common/config.ts";

onMounted(() => {
  // 2549
});

const config = useApplicationConfig();
provide(GlobalConfigKey, config)

setTimeout(() => {
  config.theme = "dark";
}, 3000);
</script>
