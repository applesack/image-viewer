<template>
  <div class="h-screen w-screen">
    <Overlay class="absolute w-2/3 left-1/2 bottom-10 -translate-x-1/2 border-2 border-neutral-700 rounded-xl">
      <div class="flex flex-row items-center justify-start space-x-8">
        <div v-for="i in 15" :key="i" class="h-[104px] w-[104px] shrink-0 bg-black text-red-600">{{ i }}</div>
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
import { onMounted } from "vue";

onMounted(() => {
  // 2549
})
</script>
