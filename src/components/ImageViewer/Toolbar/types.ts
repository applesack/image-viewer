export interface ToolbarProps {
  filename?: string;
}

export interface ToolButtonProps {
  icon: string;
}

export type DecoratorSize = "medium" | "large";
export type DecoratorType = "button" | "logo" | "control";

export interface ToolbarDecoratorProps {
  icon: string;
  iconSize?: DecoratorSize;
  type?: DecoratorType;
  isActive?: boolean;
  disabled?: boolean;
}
