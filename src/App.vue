<template>
  <div class="h-screen w-screen">
    <Overlay class="w-2/3">
      <!--      -->
      <div class="flex flex-row items-center justify-start space-x-8">
        <div v-for="i in 10" :key="i" class="h-40 w-40 shrink-0 bg-red-50"></div>
      </div>
      <!--      <div class="w-8 h-8 bg-red-50"></div>-->
      <!--      <div class="w-8 h-8 bg-red-50"></div>-->
      <!--      <div class="w-8 h-8 bg-red-50"></div>-->
      <!--      <div class="w-8 h-8 bg-red-50"></div>-->
      <!--      <div class="w-8 h-8 bg-red-50"></div>-->
    </Overlay>
  </div>
</template>

<script setup lang="ts">
import Overlay from "./components/Overlay/Overlay.vue";
</script>
