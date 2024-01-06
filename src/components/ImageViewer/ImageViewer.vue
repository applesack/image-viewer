<template>
  <div class="flex h-full w-full flex-col items-center justify-center bg-image-bg">
    <Toolbar filename="hello world"></Toolbar>
    <Drawer
      :open="showDetailPanel"
      placement="right"
      class="w-full flex-1"
      :body-class-name="['w-full', 'flex', 'flex-col']">

      <template v-slot:overlay>
        <div>12121</div>
      </template>

      <main class="w-full flex-1">1</main>
      <Statusbar class="w-full"></Statusbar>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import Toolbar from "./Toolbar.vue";
import { ref } from "vue";
import Drawer from "../Layout/Drawer/Drawer.vue";
import Statusbar from "./Statusbar.vue";

const showDetailPanel = ref(true);

defineOptions({
  name: "ImageViewer",
});
</script>
