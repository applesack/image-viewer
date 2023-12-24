<template>
  <div class="h-screen w-screen">
    <div class="inline-flex w-full items-center space-x-1 overflow-x-auto" ref="boxRef">
      <div
        class="h-24 w-24 shrink-0 grow-0 bg-pink-100"
        v-for="i in 50"
        :key="i"
        :id="`box-${i}`"
        @click="handleClick(i)">
        {{ i }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, reactive, ref } from "vue";
import { GlobalConfigKey, useApplicationConfig } from "./common/configs.ts";
import { useSlideContent } from "./hooks/useSlideContent.ts";
import { NullableElement } from "./common/constants.ts";

const boxRef = ref<HTMLElement>();
const slideContainer = useSlideContent(boxRef);

const handleClick = (id: number) => {
  const getElement = (): NullableElement => {
    return document.getElementById(`box-${id}`);
  };

  slideContainer.scrollTo(getElement()!, "center");
};

onMounted(() => {
  // const el = document.getElementById('box-11')
  // console.log(el?.offsetLeft)
  //
  // const el2 = document.getElementById('box-17')
  // console.log(el2?.offsetLeft)
});

const items = reactive([1, 1, 1, 1, 1]);

// setTimeout(() => {
//   items.push(2, 3, 4);
// }, 3000);

const config = useApplicationConfig();
provide(GlobalConfigKey, config);

// setTimeout(() => {
//   config.theme = "dark";
// }, 3000);
</script>
