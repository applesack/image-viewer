<template>
  <div class="h-screen w-screen">
    <!--    <Overlay class="absolute w-2/3 left-1/2 bottom-10 -translate-x-1/2">-->
    <!--      <div class="flex flex-row items-center justify-start space-x-8">-->
    <!--        <div v-for="i in 20" :key="i" class="h-[104px] w-[104px] shrink-0 bg-black text-red-600">{{ i }}</div>-->
    <!--      </div>-->
    <!--    </Overlay>-->
    <ImageView :src="resources.images.fav"></ImageView>
  </div>
</template>

<script setup lang="ts">
// import Overlay from "./components/Overlay/Overlay.vue";
import { onMounted, reactive } from "vue";
import ImageView from "./components/ImageView/ImageView.vue";

const resources = reactive({
  images: {
    fav: new URL('./assets/fav.png', import.meta.url).href
  }
})

onMounted(() => {
  // 2549
});
</script>
