<template>
  <div class="overlay select-none overflow-hidden" ref="overlayRef">
    <div class="relative">
      <!-- 内容 -->
      <div class="z-10 inline-flex">

        <TheSlot
          :node="defaultSlot"
          class="overflow-hidden rounded-md transition-[margin-left]"
          :style="{
            marginLeft: `${state.contentOffset}px`,
            transitionDuration: `${style.enableAnimation ? 75 : 0}ms`,
          }"></TheSlot>
      </div>

      <!-- 滚动条容器 -->
      <div
        class="absolute bottom-px h-4.5 w-full px-px transition-[height] duration-75"
        :class="{ hidden: !state.isOverflow, '!h-3': style.folded }"
        @mouseover="handleMouseOverSliderContainer"
        @mouseleave="handleMouseLeaveSliderContainer">
        <!-- 滑轨 -->
        <div
          class="mx-0.5 flex h-4.5 items-center justify-center rounded-full bg-gray-100 transition-[height] duration-75"
          :class="{ '!h-3': style.folded }">
          <!-- 滑轨控制按钮 - 开始 -->
          <div
            class="flex w-5 items-center justify-end transition-opacity duration-75"
            :class="{ 'opacity-0': style.folded }">
            <Triangle type="left" class="mr-1" @click="handleClickControlStart"></Triangle>
          </div>

          <!-- 滑块 -->
          <div class="flex flex-1 items-center">
            <div
              class="border-px right-0 box-border h-2.5 rounded border-neutral-300 bg-neutral-400 transition-[margin-left] duration-75"
              :style="{
                width: `${state.thumbWidth}px`,
                height: `${style.folded ? 4 : 10}px`,
                marginLeft: `${state.thumbOffset}px`,
                transitionDuration: `${style.enableAnimation ? 75 : 0}ms`,
              }"
              ref="blockRef"></div>
          </div>

          <!-- 滑轨控制按钮 - 结束 -->
          <div
            class="flex w-5 items-center justify-start transition-opacity duration-75"
            :class="{ 'opacity-0': style.folded }">
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
import {
  createDefaultEvent,
  createDefaultState,
  createDefaultStyle,
  SlideEvent,
  SlideState,
  SlideStyle,
} from "./typesInternal.ts";

defineOptions({
  name: "SlideBoxX",
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
const TheSlot = createSlot((el) => {
  contentRef.value = el;
});

const state = reactive<SlideState>(createDefaultState());
const event = reactive<SlideEvent>(createDefaultEvent());
const style = reactive<SlideStyle>(createDefaultStyle());

// 重新计算否显示滑块和滑块的尺寸
const reCalcSize = () => {
  // 计算滑轨相对于屏幕左侧起始点的距离
  state.trackLeftOffset = (overlayRef.value?.getBoundingClientRect()?.x ?? 0) + (5 + 20);

  // 初始化各项参数
  state.contentWidth = contentRef.value!!.scrollWidth;
  const containerRect = overlayRef.value!!.getBoundingClientRect();
  state.containerWidth = containerRect.right - containerRect.left;
  if (state.contentWidth > state.containerWidth) {
    state.isOverflow = true;
    // 计算滑轨宽度 = 容器宽度 - (两边的按钮(20px) + 容器间边距(5px)) * 2
    state.trackWidth = state.containerWidth - (5 + 20) * 2;
    state.thumbWidth = state.trackWidth * ((state.containerWidth - 16) / state.contentWidth);
  } else {
    // 如果尺寸改变后容器足够放下内容，那么隐藏滚动条
    state.isOverflow = false;
  }
};

// 重新计算滑块的偏移量
const reCalcOffset = () => {
  const rate = minmax(state.currentAreaOffsetRate, 0, 100) / 100;

  // 滑动滑块
  const availableTrackWidth = state.trackWidth - state.thumbWidth;
  state.thumbOffset = availableTrackWidth * rate;

  // 滑动内容
  const availableContentWidth = state.contentWidth - state.containerWidth + 16 + 5;
  state.contentOffset = -(availableContentWidth * rate);
};

// 当滑轨的偏移量百分比发生变化时
watch(
  () => state.currentAreaOffsetRate,
  () => {
    reCalcOffset();
  },
  {
    immediate: true,
  },
);

const handleClickControlStart = () => {
  style.enableAnimation = true;
  state.currentAreaOffsetRate = minmax(state.currentAreaOffsetRate - 10, 0, 100);
};

const handleClickControlEnd = () => {
  style.enableAnimation = true;
  state.currentAreaOffsetRate = minmax(state.currentAreaOffsetRate + 10, 0, 100);
};

const handleMouseOverSliderContainer = () => {
  clearTimeout(style.foldTimer);
  style.folded = false;
};

const handleMouseLeaveSliderContainer = () => {
  style.foldTimer = setTimeout(() => {
    if (event.isDown) {
      handleMouseLeaveSliderContainer();
      return;
    }
    style.folded = true;
  }, 500) as unknown as number;
};

const blockRef = ref<HTMLElement>();

// 处理鼠标按下事件
const handleMouseDown = (e: MouseEvent) => {
  event.mouseX = e.clientX;
  event.thumbX = blockRef.value!!.getBoundingClientRect().x;
  event.isDown = true;
};

// 处理鼠标移动事件
const handleMouseMove = (e: MouseEvent) => {
  if (!event.isDown) {
    return;
  }
  style.enableAnimation = false;
  const moved = event.thumbX - state.trackLeftOffset + (e.clientX - event.mouseX);
  state.currentAreaOffsetRate = minmax((moved / (state.trackWidth - state.thumbWidth)) * 100, 0, 100);
};

// 处理鼠标松开事件
const handleMouseUp = () => {
  event.isDown = false;
};

// 处理鼠标滚轮事件
const handleMouseWheel = (e: WheelEvent) => {
  const direction = e.deltaY > 0 ? 1 : -1;
  const amount = 7 * direction;
  style.enableAnimation = true;
  state.currentAreaOffsetRate = minmax(state.currentAreaOffsetRate + amount, 0, 100);
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
