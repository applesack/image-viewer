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
        cursor: `${state.style.cursor}`,
      }" />
  </div>
</template>

<script setup lang="ts">
import { SingleImage, SingleImageEmits } from "./types.ts";
import { onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { isApproximate } from "../../utils/helper.ts";
import { useMousePosition } from "../../hooks/useMousePosition.ts";
import { useMouseEvent } from "../../hooks/useMouseEvent.ts";

defineOptions({
  name: "ImageView",
});

// todo 画面缩小时使用动画，画面放大时关闭动画效果
// todo 如果容器尺寸变化前图片处于垂直/水平居中，那么变化后也保持垂直/水平居中

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
  hasInitOffset: false,
  style: {
    height: 0,
    width: 0,
    left: 0,
    top: 0,
    cursor: "default",
  },
  drag: {
    draggable: false,
    down: false,
    x: 0,
    y: 0,
  },
});

const emits = defineEmits<SingleImageEmits>();

const { mouseX, mouseY } = useMousePosition();
const mouseEvent = useMouseEvent();

/**
 * 获取缩放点位于图片的位置
 */
interface GetScalePointer {
  (): { px: number; py: number };
}

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

const getImageCenterPointer: GetScalePointer = () => {
  // FIXME 如果left和top值可靠的话，可以这么搞

  const containerBounding = containerRef.value!!.getBoundingClientRect();
  const imageBounding = imageRef.value!!.getBoundingClientRect();
  const clipBounding = {
    left: Math.max(containerBounding.left, imageBounding.left),
    right: Math.min(containerBounding.right, imageBounding.right),
    top: Math.max(containerBounding.top, imageBounding.top),
    bottom: Math.min(containerBounding.bottom, imageBounding.bottom),
  };
  const halfX = (clipBounding.right - clipBounding.left) / 2;
  const halfY = (clipBounding.bottom - clipBounding.top) / 2;
  const px = clipBounding.right - halfX - imageBounding.left;
  const py = clipBounding.bottom - halfY - imageBounding.top;
  return {
    px,
    py,
  };
};
const getScalePointer = ref<GetScalePointer>(getImageCenterPointer);
const getImageCenterPointerByMousePosition: GetScalePointer = () => {
  const imageBounding = imageRef.value!!.getBoundingClientRect();
  const px = mouseX.value - imageBounding.left;
  const py = mouseY.value - imageBounding.top;
  const pointer = {
    px,
    py,
  };
  getScalePointer.value = getImageCenterPointer;
  return pointer;
};

const getScale = (containerValue: number, imageValue: number): number => containerValue / imageValue;

// 初始化图片的初始缩放值
const initImageScale = () => {
  state.hasInitOffset = false;
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
      if (isApproximate(state.preContainerWidth, curWidth) || isApproximate(state.preContainerHeight, curHeight)) {
        // 如果容器尺寸变化前和容器是自适应容器的，那么容器尺寸变化后也保持一致
        scale = fixedContentScale();
      } else {
        // TODO 优化对角线缩放的算法，只计算图片可视部分的缩放比例
        const preDiagonalLen = Math.sqrt(Math.pow(state.preContainerWidth, 2) + Math.pow(state.preContainerHeight, 2));
        const curDiagonalLen = Math.sqrt(Math.pow(state.containerWidth, 2) + Math.pow(state.containerHeight, 2));
        const diff = curDiagonalLen / preDiagonalLen;
        scale = scale * diff;
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
    getScalePointer.value = getImageCenterPointer;
    return;
  }
  const oldScale = state.scale;
  state.scale = scale;
  emits("change-scale", Math.floor(state.scale * 100));
  reposition(oldScale);
};

// 根据现有数据将图片重新定位
const reposition = (oldScale: number, offset: { left: number; top: number } | null = null) => {
  const image = getImage()!!;
  const scaleWidth = image.naturalWidth * state.scale;
  const scaleHeight = image.naturalHeight * state.scale;
  const doScale = () => {
    state.style.width = scaleWidth;
    state.style.height = scaleHeight;
  };

  // 计算图片左上角的位置

  if (offset !== null) {
    doScale();
    state.style.left += offset.left;
    state.style.top += offset.top;
    return;
  }

  if (!state.hasInitOffset) {
    if (image.naturalWidth === 0 && image.naturalHeight === 0) {
      // 如果在图片未完成加载时可能会触发这个方法，此时图片的高宽位置为0，继续计算的话无意义
      return;
    }

    state.hasInitOffset = true;
    // 初始化位置，使图片居中显示
    doScale();
    state.style.left = (state.containerWidth - state.style.width) / 2;
    state.style.top = (state.containerHeight - state.style.height) / 2;
  } else {
    const getDiff = (len: number): number => {
      const rate = state.scale / oldScale;
      return len * rate - len;
    };

    const center = getScalePointer.value();
    state.style.left -= getDiff(center.px);
    state.style.top -= getDiff(center.py);

    // 如果图片高宽均大于容器，缩放后不应该在容器四周存在空缺
    // 图片宽度小于容器高或宽，居中

    if (scaleWidth > state.containerWidth) {
      if (state.style.left > 0) {
        state.style.left = 0;
      }
      if (state.style.left + scaleWidth < state.containerWidth) {
        state.style.left = state.containerWidth - scaleWidth;
      }
    } else {
      state.style.left = (state.containerWidth - scaleWidth) / 2;
    }

    if (scaleHeight > state.containerHeight) {
      if (state.style.top > 0) {
        state.style.top = 0;
      }
      if (state.style.top + scaleHeight < state.containerHeight) {
        state.style.top = state.containerHeight - scaleHeight;
      }
    } else {
      state.style.top = (state.containerHeight - scaleHeight) / 2;
    }

    doScale();
  }
};

// 标准缩放: 按照当前图片在容器的中心点进行缩放, 每次缩放10%
const standardScale = (value: number, by: "mouse" | "other") => {
  const delta = state.scale * 0.1;
  let targetScale = state.scale;
  if (value < 0) {
    targetScale += delta;
  } else {
    targetScale -= delta;
  }
  state.adaptive = true;
  if (by === "mouse") {
    getScalePointer.value = getImageCenterPointerByMousePosition;
  }
  recalculateScale(targetScale, "wheel");
};

// 拖动操作 - 鼠标按下
const handleDragMouseDown = () => {
  if (state.style.width <= state.containerWidth && state.style.height <= state.containerHeight) {
    return;
  }
  state.drag.down = true;
  state.drag.x = 0;
  state.drag.y = 0;
};

// 拖动操作 - 鼠标移动
const handleDragMouseMove = () => {
  if (!state.drag.down) {
    return;
  }
  const updateCurrentMousePosition = () => {
    state.drag.x = mouseX.value;
    state.drag.y = mouseY.value;
  };

  if (state.drag.x === 0 && state.drag.y === 0) {
    updateCurrentMousePosition();
    return;
  }
  const v = {
    x1: state.drag.x,
    y1: state.drag.y,
    x2: mouseX.value,
    y2: mouseY.value,
  };
  updateCurrentMousePosition();

  const offset = {
    left: 0,
    top: 0,
  };
  if (state.style.width > state.containerWidth) {
    const diffX = v.x2 - v.x1;
    if (diffX > 0) {
      // 向右移动, 检查左边界
      if (state.style.left + diffX > 0) {
        offset.left = -state.style.left;
      } else {
        offset.left = diffX;
      }
    }
    if (diffX < 0) {
      // 向左移动，检查右边界
      if (state.style.left + state.style.width + diffX < state.containerWidth) {
        offset.left = state.containerWidth - (state.style.left + state.style.width);
      } else {
        offset.left = diffX;
      }
    }
  }
  if (state.style.height > state.containerHeight) {
    const diffY = v.y2 - v.y1;
    if (diffY > 0) {
      // 向下移动，检查上边界
      if (state.style.top + diffY > 0) {
        offset.top = -state.style.top;
      } else {
        offset.top = diffY;
      }
    }
    if (diffY < 0) {
      // 向上移动，检查下边界
      if (state.style.top + state.style.height + diffY < state.containerHeight) {
        offset.top = state.containerHeight - (state.style.top + state.style.height);
      } else {
        offset.top = diffY;
      }
    }
  }
  reposition(state.scale, offset);
};

// 拖动操作 - 鼠标抬起
const handleDragMouseUp = () => {
  state.drag.down = false;
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

watch([mouseX, mouseY], () => {
  handleDragMouseMove();
});

watch(mouseEvent, () => {
  if (mouseEvent.value === "up") {
    handleDragMouseUp();
  } else {
    handleDragMouseDown();
  }
});

// 图片尺寸变化时，计算当前是否可以进行拖动，然后改变指针的形态
watch(
  [() => state.style.width, () => state.style.height, () => state.drag.down],
  () => {
    const draggable = state.style.width > state.containerWidth || state.style.height > state.containerHeight;
    let next: string;
    if (draggable) {
      if (state.drag.down) {
        next = "grabbing";
      } else {
        next = "grab";
      }
    } else {
      next = "default";
    }
    if (next !== state.style.cursor) {
      state.style.cursor = next;
    }
  },
  {
    immediate: true,
  },
);

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
    standardScale(e.deltaY, "mouse");
  });
});

onBeforeUnmount(() => {
  resizeObserver.disconnect();
});
</script>
