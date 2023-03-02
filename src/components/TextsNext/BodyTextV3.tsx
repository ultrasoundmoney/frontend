import type { FC, ReactNode } from "react";
import { BaseText } from "../Texts";

const BodyTextV3: FC<{
  children: ReactNode;
  className?: string;
  color?: string;
}> = ({ children, className, color }) => (
  <BaseText
    className={className}
    font="font-inter"
    color={color}
    size="text-sm md:text-base"
  >
    {children}
  </BaseText>
);

export default BodyTextV3;
