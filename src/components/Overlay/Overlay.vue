<template>
  <div class="overlay overflow-hidden">
    <div class="relative">
      <!-- 内容 -->
      <TheSlot :v-node="defaultSlot"></TheSlot>

      <!-- 滚动条容器 -->
      <div class="absolute bottom-0 h-6 w-full bg-amber-300 px-3 py-1.5 opacity-70">
        <!-- 滑轨 -->
        <div class="absolute flex h-2 w-1/2 justify-between bg-red-400">
          <!-- 滑轨控制按钮 - 开始 -->
          <Triangle type="left"></Triangle>
          <!-- 滑轨控制按钮 - 结束 -->
          <Triangle type="right"></Triangle>
        </div>
        <!-- 滑块 -->
        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useSlots } from "vue";
import createSlot from "./createSlot.ts";
import Triangle from "./Triangle.vue";

// 获取 slot 的实际元素，并计算元素的高度/宽度
// 由于最前面的可能是注释 <!-- -->，
// 所以这里遍历找出第一个非注释的dom节点
const slots = useSlots();
const defaultSlot = ref(null);
for (let s of Array.from(slots.default())) {
  if ("type" in s && typeof s.type === "string") {
    defaultSlot.value = s;
    break;
  }
}

const slotRef = ref<HTMLElement | null>(null);

const overflow = ref<boolean>(false);
const showSlider = ref<boolean>(false);

const TheSlot = createSlot((el) => {
  slotRef.value = el;
  console.log(el.clientWidth, el.clientHeight);
});

onMounted(() => {});
</script>
