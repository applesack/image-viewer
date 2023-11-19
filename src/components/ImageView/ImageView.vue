<template>
  <div class="image-view relative h-full w-full overflow-hidden" ref="containerRef">
    <img
      draggable="false"
      class="absolute max-h-none max-w-none"
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
  adaptive: true,
  containerWidth: 0,
  containerHeight: 0,
  preContainerWidth: 0,
  preContainerHeight: 0,
  containerLeft: 0,
  containerTop: 0,
  center: {
    x: 0.5,
    y: 0.5,
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
  state.preContainerWidth = state.containerWidth;
  state.preContainerHeight = state.containerHeight;
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

const getScale = (containerValue: number, imageValue: number): number => containerValue / imageValue;

// 初始化图片的初始缩放值
const initImageScale = () => {
  const image = getImage()!!;
  const naturalWidth = image.naturalWidth;
  const naturalHeight = image.naturalHeight;

  // 如果图片原始尺寸大于容器，那么按照最窄的一条边进行缩放
  let scale = 1;
  if (naturalWidth > state.containerWidth || naturalHeight > state.containerHeight) {
    scale = Math.min(getScale(state.containerWidth, naturalWidth), getScale(state.containerHeight, naturalHeight));
    state.adaptive = true;
  } else {
    state.adaptive = false;
  }
  recalculateScale(scale, "init");
};

// 根据预期缩放值重新计算实际缩放值
const recalculateScale = (newScale: number, by: "init" | "container" | "wheel") => {
  const image = getImage()!!;
  const naturalWidth = image.naturalWidth;
  const naturalHeight = image.naturalHeight;

  let scale = newScale;
  const curWidth = naturalWidth * state.scale;
  const curHeight = naturalHeight * state.scale;
  const fixedContentScale = (): number => {
    const minScale = Math.min(Number.MAX_VALUE, getScale(state.containerWidth, naturalWidth));
    return Math.min(minScale, getScale(state.containerHeight, naturalHeight));
  };

  if (by === "container") {
    if (state.adaptive) {
      if (state.preContainerWidth === curWidth || state.preContainerHeight === curHeight) {
        // 如果容器尺寸变化前和容器是自适应容器的，那么容器尺寸变化后也保持一致
        scale = fixedContentScale();
      } else {
        const preDiagonalLen = Math.sqrt(Math.pow(state.preContainerWidth, 2) + Math.pow(state.preContainerHeight, 2));
        const curDiagonalLen = Math.sqrt(Math.pow(state.containerWidth, 2) + Math.pow(state.containerHeight, 2));
        const diff = curDiagonalLen / preDiagonalLen;
        scale = Math.min(scale * diff, 50);
      }
    }
  }

  if (scale > 50) {
    // 最大缩放比例 5000%
    scale = 50;
  }

  // 锁定最小缩放比例
  const scaleWidth = naturalWidth * scale;
  const scaleHeight = naturalHeight * scale;
  const minWid = Math.min(state.containerWidth, naturalWidth);
  const minHei = Math.min(state.containerHeight, naturalHeight);
  if (!(scaleWidth > state.containerWidth || scaleHeight > state.containerHeight)) {
    if (scaleWidth < minWid || scaleHeight < minHei) {
      scale = Math.min(minWid / naturalWidth, minHei / naturalHeight);
    }
  }

  if (by !== "init" && scale === state.scale) {
    return;
  }
  state.scale = scale;
  emits("change-scale", Math.floor(state.scale * 100));
  reposition();
};

// 根据现有数据将图片重新定位
const reposition = () => {
  const image = getImage()!!;
  state.style.width = image.naturalWidth * state.scale;
  state.style.height = image.naturalHeight * state.scale;

  // 计算图片左上角的位置
  state.style.left = -(state.style.width * state.center.x - state.containerWidth / 2);
  state.style.top = -(state.style.height * state.center.y - state.containerHeight / 2);
};

// 标准缩放: 按照当前图片在容器的中心点进行缩放, 每次缩放10%
const standardScale = (value: number) => {
  const delta = state.scale * 0.1;
  let targetScale = state.scale;
  if (value < 0) {
    targetScale += delta;
  } else {
    targetScale -= delta;
  }
  state.adaptive = true;
  recalculateScale(targetScale, "wheel");
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

// 容器缩放导致的缩放比例重新计算
watch([() => state.containerWidth, () => state.containerHeight], () => {
  // 容器大小变化时根据之前的容器尺寸重新计算预期的缩放比例
  if (state.preContainerWidth === 0) {
    recalculateScale(state.scale, "init");
    return;
  }
  recalculateScale(state.scale, "container");
});

const resizeObserver = new ResizeObserver(onContainerResize);

onMounted(() => {
  onContainerResize();
  resizeObserver.observe(containerRef.value!!, {
    box: "content-box",
  });
  imageRef.value!!.addEventListener("load", () => {
    initImageScale();
  });
  imageRef.value!!.addEventListener("wheel", (e: WheelEvent) => {
    standardScale(e.deltaY);
  });
});

onBeforeUnmount(() => {
  resizeObserver.disconnect();
});
</script>
