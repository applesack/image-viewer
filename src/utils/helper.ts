/**
 * ## 将输入[value]限定到max和min之间
 *
 * 如果value大于max，取max; 如果value小于min，取min
 */
export function minmax(value: number, min: number, max: number): number {
  return Math.max(Math.min(value, max), min);
}

export function getEleOffsetRelativeToWindow(ele?: HTMLElement): { offsetX: number; offsetY: number } {
  console.log(ele?.getBoundingClientRect())
  let offsetX = 0;
  let offsetY = 0;
  while (ele) {
    offsetX = ele.offsetLeft
    offsetY = ele.offsetTop
    ele = ele.offsetParent as HTMLElement
  }

  return {
    offsetX,
    offsetY,
  };
}
