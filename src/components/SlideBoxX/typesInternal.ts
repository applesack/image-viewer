export interface SlideState {
  isOverflow: boolean;
  thumbWidth: number;
  thumbOffset: number;
  contentWidth: number;
  contentOffset: number;
  containerWidth: number;
  trackWidth: number;
  currentAreaOffsetRate: number;
  trackLeftOffset: number;
}

export interface SlideEvent {
  mouseX: number;
  thumbX: number;
  isDown: boolean;
}

export interface SlideStyle {
  enableAnimation: boolean;
  folded: boolean;
  foldTimer: number;
}

export function createDefaultState(): SlideState {
  return {
    isOverflow: false,
    thumbWidth: 0,
    thumbOffset: 0,
    contentWidth: 0,
    contentOffset: 0,
    containerWidth: 0,
    trackWidth: 0,
    currentAreaOffsetRate: 0,
    trackLeftOffset: 0,
  };
}

export function createDefaultEvent(): SlideEvent {
  return {
    mouseX: 0,
    thumbX: 0,
    isDown: false,
  };
}

export function createDefaultStyle(): SlideStyle {
  return {
    enableAnimation: false,
    folded: true,
    foldTimer: 1,
  };
}
