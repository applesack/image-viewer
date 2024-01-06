export interface ToolbarProps {
  filename?: string;
}

export type DecoratorSize = "md" | "lg" | "xl";
export type DecoratorType = "button" | "logo" | "control";

export interface DecoratorProps {
  icon: string;
  iconSize?: DecoratorSize;
  type?: DecoratorType;
  isActive?: boolean;
  disabled?: boolean;
}
