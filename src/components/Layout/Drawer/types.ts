import { DirectionType } from "../../../common/constants.ts";
import { CSSProperties } from "vue";

export interface DrawerProps {
  placement?: DirectionType;
  open: boolean,
  bodyStyle?: CSSProperties,
  bodyClassName?: string | string[]
}
