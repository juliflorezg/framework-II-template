import React, { FC} from "react";
import { BlockComponent } from "@my-app/app/src/framework/engine/types";
import Link, { LinkProps } from "../ui/Link";


export const StoreLink: FC<BlockComponent<LinkProps>> = ({ children, componentName, props }) => {
  return (
    <Link {...props} />
  );
}