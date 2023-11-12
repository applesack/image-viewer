<template>
  <div class="overlay select-none overflow-hidden" ref="overlayRef">
    <div class="relative">
      <!-- 内容 -->
      <TheSlot :v-node="defaultSlot"></TheSlot>

      <!-- 滚动条容器 -->
      <div class="absolute bottom-px h-4.5 w-full px-px" :class="{ hidden: !slider.isOverflow }">
        <!-- 滑轨 -->
        <div class="mx-0.5 flex h-4.5 items-center justify-center rounded-full bg-gray-100">
          <!-- 滑轨控制按钮 - 开始 -->
          <div class="flex w-5 items-center justify-end">
            <Triangle type="left" class="mr-1 cursor-pointer"></Triangle>
          </div>

          <!-- 滑块 -->
          <div class="flex flex-1 items-center">
            <div
              class="border-px right-0 box-border h-2.5 rounded border-neutral-300 bg-neutral-400 hover:cursor-pointer"
              :style="{ width: `${slider.blockWidth}px`, marginLeft: `${slider.offset}px` }"
              ref="blockRef"></div>
          </div>

          <!-- 滑轨控制按钮 - 结束 -->
          <div class="flex w-5 items-center justify-start">
            <Triangle type="right" class="ml-1 cursor-pointer"></Triangle>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, useSlots, watch } from "vue";
import createSlot from "./createSlot.ts";
import Triangle from "./Triangle.vue";
import { minmax } from "../../utils/helper.ts";

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

const slotRef = ref<HTMLElement>();
const overlayRef = ref<HTMLElement>();
const slider = reactive({
  isOverflow: false,
  blockWidth: 0,
  rate: 50,
  offset: 0,
  containerWidth: 0,
  slotWidth: 0,
  trackWidth: 0,
  trackOffsetLeft: 0,
  event: {
    mouseX: 0,
    blockX: 0,
    isDown: false,
  },
});

const TheSlot = createSlot((el) => {
  slotRef.value = el;
});

// 重新计算否显示滑块和滑块的尺寸
const reCalcSize = () => {
  // 计算滑轨相对于屏幕左侧起始点的距离
  slider.trackOffsetLeft = (overlayRef.value?.getBoundingClientRect()?.x ?? 0) + (5 + 20);

  // 初始化各项参数
  slider.slotWidth = slotRef.value!!.scrollWidth;
  const containerRect = overlayRef.value!!.getBoundingClientRect();
  slider.containerWidth = containerRect.right - containerRect.left;
  if (slider.slotWidth > slider.containerWidth) {
    slider.isOverflow = true;
    // 计算滑轨宽度 = 容器宽度 - (两边的按钮(20px) + 容器间边距(5px)) * 2
    slider.trackWidth = slider.containerWidth - (5 + 20) * 2;
    slider.blockWidth = slider.trackWidth * (slider.containerWidth / slider.slotWidth);
  } else {
    // 如果尺寸改变后容器足够放下内容，那么隐藏滚动条
    slider.isOverflow = false;
  }
};

// 重新计算滑块的偏移量
const reCalcOffset = () => {
  const rate = minmax(slider.rate, 0, 100);
  const availableTrackWidth = slider.trackWidth - slider.blockWidth;
  slider.offset = availableTrackWidth * (rate / 100);
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
  const moved = slider.event.blockX - slider.trackOffsetLeft + (e.clientX - slider.event.mouseX);
  slider.rate = minmax((moved / (slider.trackWidth - slider.blockWidth)) * 100, 0, 100);
};

// 处理鼠标松开事件
const handleMouseUp = () => {
  slider.event.isDown = false;
};

onMounted(() => {
  reCalcSize();

  blockRef.value?.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", handleMouseMove, true);
  document.removeEventListener("mouseup", handleMouseUp, true);
});
</script>
