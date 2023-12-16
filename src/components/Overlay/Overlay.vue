<template>
  <div class="overlay select-none overflow-hidden rounded-xl border-2 border-gray-300" ref="overlayRef">
    <div class="relative">
      <!-- 内容 -->
      <div class="z-10 h-full border border-solid border-neutral-300 bg-gray-100 px-2 py-3">
        <TheSlot
          :node="defaultSlot"
          class="overflow-hidden rounded-md transition-[margin-left]"
          :style="{
            marginLeft: `${slider.contentOffset}px`,
            transitionDuration: `${slider.style.enableAnimation ? 75 : 0}ms`,
          }"></TheSlot>
      </div>

      <!-- 滚动条容器 -->
      <div
        class="absolute bottom-px h-4.5 w-full px-px transition-[height] duration-75"
        :class="{ hidden: !slider.isOverflow, '!h-3': slider.style.folded }"
        @mouseover="handleMouseOverSliderContainer"
        @mouseleave="handleMouseLeaveSliderContainer">
        <!-- 滑轨 -->
        <div
          class="mx-0.5 flex h-4.5 items-center justify-center rounded-full bg-gray-100 transition-[height] duration-75"
          :class="{ '!h-3': slider.style.folded }">
          <!-- 滑轨控制按钮 - 开始 -->
          <div
            class="flex w-5 items-center justify-end transition-opacity duration-75"
            :class="{ 'opacity-0': slider.style.folded }">
            <Triangle type="left" class="mr-1" @click="handleClickControlStart"></Triangle>
          </div>

          <!-- 滑块 -->
          <div class="flex flex-1 items-center">
            <div
              class="border-px right-0 box-border h-2.5 rounded border-neutral-300 bg-neutral-400 transition-[margin-left] duration-75"
              :style="{
                width: `${slider.blockWidth}px`,
                height: `${slider.style.folded ? 4 : 10}px`,
                marginLeft: `${slider.blockOffset}px`,
                transitionDuration: `${slider.style.enableAnimation ? 75 : 0}ms`,
              }"
              ref="blockRef"></div>
          </div>

          <!-- 滑轨控制按钮 - 结束 -->
          <div
            class="flex w-5 items-center justify-start transition-opacity duration-75"
            :class="{ 'opacity-0': slider.style.folded }">
            <Triangle type="right" class="ml-1" @click="handleClickControlEnd"></Triangle>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, useSlots, watch } from "vue";
import Triangle from "./Triangle.vue";
import { minmax, createSlot } from "../../utils/helper.ts";

defineOptions({
  name: "Overlay",
});

// 获取 slot 的实际元素，并计算元素的高度/宽度
// 由于最前面的可能是注释 <!-- -->，
// 所以这里遍历找出第一个非注释的dom节点
const slots = useSlots();
const defaultSlot = ref<any | null>(null);
for (let s of Array.from((slots.default && slots.default()) || [])) {
  if ("type" in s && typeof s.type === "string") {
    defaultSlot.value = s;
    break;
  }
}

const contentRef = ref<HTMLElement>();
const overlayRef = ref<HTMLElement>();
const slider = reactive({
  isOverflow: false,
  blockWidth: 0,
  rate: 0,
  blockOffset: 0,
  contentOffset: 0,
  containerWidth: 0,
  containerBorder: 2,
  contentWidth: 0,
  trackWidth: 0,
  trackOffsetLeft: 0,
  style: {
    enableAnimation: false,
    folded: true,
    foldTimer: 1,
  },
  event: {
    mouseX: 0,
    blockX: 0,
    isDown: false,
  },
});

const TheSlot = createSlot((el) => {
  contentRef.value = el;
});

// 重新计算否显示滑块和滑块的尺寸
const reCalcSize = () => {
  // 计算滑轨相对于屏幕左侧起始点的距离
  slider.trackOffsetLeft = (overlayRef.value?.getBoundingClientRect()?.x ?? 0) + (5 + 20);

  // 初始化各项参数
  slider.contentWidth = contentRef.value!!.scrollWidth;
  const containerRect = overlayRef.value!!.getBoundingClientRect();
  slider.containerWidth = containerRect.right - containerRect.left;
  if (slider.contentWidth > slider.containerWidth) {
    slider.isOverflow = true;
    // 计算滑轨宽度 = 容器宽度 - (两边的按钮(20px) + 容器间边距(5px)) * 2
    slider.trackWidth = slider.containerWidth - (5 + 20) * 2;
    slider.blockWidth = slider.trackWidth * ((slider.containerWidth - 16) / slider.contentWidth);
  } else {
    // 如果尺寸改变后容器足够放下内容，那么隐藏滚动条
    slider.isOverflow = false;
  }
};

// 重新计算滑块的偏移量
const reCalcOffset = () => {
  const rate = minmax(slider.rate, 0, 100) / 100;

  // 滑动滑块
  const availableTrackWidth = slider.trackWidth - slider.blockWidth;
  slider.blockOffset = availableTrackWidth * rate;

  // 滑动内容
  const availableContentWidth = slider.contentWidth - slider.containerWidth + 16 + 5;
  slider.contentOffset = -(availableContentWidth * rate);
};

// 当滑轨的偏移量百分比发生变化时
watch(
  () => slider.rate,
  () => {
    reCalcOffset();
  },
  {
    immediate: true,
  },
);

const handleClickControlStart = () => {
  slider.style.enableAnimation = true;
  slider.rate = minmax(slider.rate - 10, 0, 100);
};

const handleClickControlEnd = () => {
  slider.style.enableAnimation = true;
  slider.rate = minmax(slider.rate + 10, 0, 100);
};

const handleMouseOverSliderContainer = () => {
  clearTimeout(slider.style.foldTimer);
  slider.style.folded = false;
};

const handleMouseLeaveSliderContainer = () => {
  slider.style.foldTimer = setTimeout(() => {
    if (slider.event.isDown) {
      handleMouseLeaveSliderContainer();
      return;
    }
    slider.style.folded = true;
  }, 500) as unknown as number;
};

const blockRef = ref<HTMLElement>();

// 处理鼠标按下事件
const handleMouseDown = (e: MouseEvent) => {
  slider.event.mouseX = e.clientX;
  slider.event.blockX = blockRef.value!!.getBoundingClientRect().x;
  slider.event.isDown = true;
};

// 处理鼠标移动事件
const handleMouseMove = (e: MouseEvent) => {
  if (!slider.event.isDown) {
    return;
  }
  slider.style.enableAnimation = false;
  const moved = slider.event.blockX - slider.trackOffsetLeft + (e.clientX - slider.event.mouseX);
  slider.rate = minmax((moved / (slider.trackWidth - slider.blockWidth)) * 100, 0, 100);
};

// 处理鼠标松开事件
const handleMouseUp = () => {
  slider.event.isDown = false;
};

// 处理鼠标滚轮事件
const handleMouseWheel = (e: WheelEvent) => {
  const direction = e.deltaY > 0 ? 1 : -1;
  const amount = 7 * direction;
  slider.style.enableAnimation = true;
  slider.rate = minmax(slider.rate + amount, 0, 100);
};

onMounted(() => {
  reCalcSize();

  overlayRef.value?.addEventListener("wheel", handleMouseWheel);
  blockRef.value?.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", handleMouseMove, true);
  document.removeEventListener("mouseup", handleMouseUp, true);
});
</script>
