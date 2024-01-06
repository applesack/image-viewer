export type DirectionType = "left" | "right" | "top" | "bottom";

export type AxisType = "x" | "y";

export type Placement = "left" | "center" | "right";

export type NullableElement = HTMLElement | null | undefined

export function isHorizontal(d: DirectionType): boolean {
  return d === 'left' || d === 'right';
}
