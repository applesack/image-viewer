import { onUnmounted, ref, Ref, watch } from "vue";
import { NullableElement } from "../common/constants.ts";
import { minmax } from "../utils/helper.ts";

/**
 * 元素的定位
 * - side: 当元素不在容器的可视区域内，通过滑动来让元素出现在最靠近可视区域的一侧；如果元素已经处于容器，则不操作
 * - center: 如果容器内元素宽度超过容器产生溢出，那么尽可能让元素位于容器中央
 */
export type Placement = "side" | "center";

export interface SlideContainer {
  scrollTo(childEl: HTMLElement, placement?: Placement, padding?: number): void;
}

/**
 * 对[elementRef]进行增强，使得在容器内可以响应鼠标滚轮来对内容进行水平滚动
 *
 * @param containerRef 被增强的容器，响应式
 * @return 返回一个控制容器滚动的实例，允许在容器内滚动到指定元素
 */
export function useSlideContent(containerRef: Ref<NullableElement>): SlideContainer {
  const containerWidth = ref<number>(0);
  const scrollOffset = ref<number>(0);

  const fixOffset = (expect: number): number => {
    const containerScrollWidth = containerRef.value!.scrollWidth
    const maxOffset = containerScrollWidth - containerWidth.value;
    return minmax(expect, 0, maxOffset);
  };

  const wheelEventHandler = (event: WheelEvent) => {
    scrollOffset.value = fixOffset(scrollOffset.value + event.deltaY);
  };

  const resizeHandler = () => {
    const bounding = containerRef.value?.getBoundingClientRect();
    if (!bounding) return;

    containerWidth.value = bounding.width;
    scrollOffset.value = containerRef.value!.scrollLeft;
  };
  const observer = new ResizeObserver(resizeHandler);

  const register = (element: NullableElement) => element?.addEventListener("wheel", wheelEventHandler);
  const unRegister = (element: NullableElement) => element?.removeEventListener("wheel", wheelEventHandler);

  const scrollTo = (childEl: HTMLElement, placement: Placement = "side", padding: number = 0) => {
    const getChildInfo = () => {
      const childBounding = childEl.getBoundingClientRect();
      const childLeft = childEl.offsetLeft;
      const childRight = childLeft + childBounding.width;
      const containerLeft = scrollOffset.value;
      const containerRight = containerLeft + containerWidth.value;
      return {
        childLeft,
        childRight,
        childWidth: childBounding.width,
        isOverflow: childLeft < containerLeft || childRight > containerRight,
        getPlacement: () => {
          return childLeft < containerLeft ? "left" : "right";
        },
      };
    };

    const info = getChildInfo();
    if (placement === "side") {
      if (!info.isOverflow) {
        return;
      }
      if (info.getPlacement() === "left") {
        scrollOffset.value = info.childLeft - padding;
      } else {
        scrollOffset.value = info.childRight - containerWidth.value + padding;
      }
    } else {
      if (containerWidth.value >= containerRef.value!.scrollWidth) {
        console.log("ret");
        return;
      }
      const centerOffset = info.childLeft - containerWidth.value / 2 + info.childWidth / 2;
      scrollOffset.value = fixOffset(centerOffset);
    }
  };

  watch(containerRef, (newValue, oldValue) => {
    unRegister(oldValue);
    register(newValue);
    if (oldValue) {
      observer.unobserve(oldValue!);
    }
    if (newValue) {
      observer.observe(newValue);
    }
  });

  watch(
    scrollOffset,
    () => {
      containerRef.value?.scrollTo({
        left: scrollOffset.value,
        behavior: "smooth"
      });
    },
    {
      immediate: true,
    },
  );

  onUnmounted(() => {
    unRegister(containerRef.value);
    observer.disconnect();
  });

  return {
    scrollTo,
  };
}
