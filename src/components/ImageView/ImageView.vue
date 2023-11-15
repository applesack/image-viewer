<template>
  <div class="image-view relative h-full w-full overflow-hidden" ref="containerRef">
    <img
      class="absolute"
      :src="state.src"
      alt=""
      ref="imageRef"
      :style="{
        width: `${state.style.width}px`,
        height: `${state.style.height}px`,
        left: `${state.style.left}px`,
        top: `${state.style.top}px`,
      }" />
  </div>
</template>

<script setup lang="ts">
import { SingleImage, SingleImageEmits } from "./types.ts";
import { onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

defineOptions({
  name: "ImageView",
});

// todo 画面缩小时使用动画，画面放大时关闭动画效果

const props = defineProps<SingleImage>();
const state = reactive({
  src: "",
  scale: 1,
  containerWidth: 0,
  containerHeight: 0,
  containerLeft: 0,
  containerTop: 0,
  center: {
    x: 0,
    y: 0,
  },
  style: {
    height: 0,
    width: 0,
    left: 0,
    top: 0,
  },
});

const emits = defineEmits<SingleImageEmits>();

const containerRef = ref<HTMLElement>();
const onContainerResize = () => {
  const bounding = containerRef.value!!.getBoundingClientRect();
  state.containerWidth = bounding.width;
  state.containerHeight = bounding.height;
  state.containerLeft = bounding.left;
  state.containerTop = bounding.top;
};

const imageRef = ref<HTMLImageElement>();
const getImage = (): HTMLImageElement | null => {
  return imageRef.value || null;
};

const getScale = (containerValue: number, imageValue: number): number => (containerValue / imageValue);

// 初始化图片的初始缩放值
const initImageScale = () => {
  const image = getImage()!!;
  const naturalWidth = image.naturalWidth;
  const naturalHeight = image.naturalHeight;

  // 如果图片原始尺寸大于容器，那么按照最窄的一条边进行缩放
  let scale = 1;
  if (naturalWidth > state.containerWidth || naturalHeight > state.containerHeight) {
    scale = Math.min(getScale(state.containerWidth, naturalWidth), getScale(state.containerHeight, naturalHeight));
  }
  recalculateScale(scale);
};

// 根据预期缩放值重新计算实际缩放值
const recalculateScale = (newScale: number) => {
  const image = getImage()!!;
  const naturalWidth = image.naturalWidth;
  const naturalHeight = image.naturalHeight;

  // 缩放值
  // 最大值5000
  // 最小值: 如果容器刚好能容纳图片的原始尺寸，不允许缩小

  let scale = newScale;
  if (scale > 50) {
    scale = 50;
  }
  const scaleWidth = naturalWidth * scale;
  const scaleHeight = naturalHeight * scale;
  if (scaleWidth < state.containerWidth || scaleHeight < state.containerHeight) {
    let minScale = Math.min(Number.MAX_VALUE, getScale(state.containerWidth, naturalWidth));
    scale = Math.min(minScale, getScale(state.containerHeight, naturalHeight));
  }

  if (scale === state.scale) {
    return;
  }
  state.scale = scale;
  emits("change-scale",  Math.floor(state.scale * 100));
};

// 根据现有数据将图片重新定位
const reposition = () => {
  const image = getImage()!!
  console.log(state.scale, state.containerWidth, state.containerHeight, image.naturalWidth, image.naturalHeight)
  state.style.width = image.naturalWidth * state.scale
  state.style.height = image.naturalHeight * state.scale
};

watch(
  () => props.src,
  () => {
    state.src = props.src;
  },
  {
    immediate: true,
  },
);

watch([() => state.containerWidth, () => state.containerHeight], () => {
  console.log('resize')
  // 根据当前scale值
  recalculateScale(state.scale);
});

watch(
  () => state.scale,
  () => {
    if (state.scale === 0) {
      return
    }
    reposition();
  },
);

const resizeObserver = new ResizeObserver(onContainerResize);

onMounted(() => {
  onContainerResize();
  resizeObserver.observe(containerRef.value!!, {
    box: "content-box",
  });
  imageRef.value!!.addEventListener('load', () => {
    initImageScale()
  })
});

onBeforeUnmount(() => {
  resizeObserver.disconnect();
});
</script>
