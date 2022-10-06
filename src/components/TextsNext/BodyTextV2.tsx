import type { FC, ReactNode } from "react";
import { BaseText } from "../Texts";

type Props = {
  children: ReactNode;
  className?: string;
  color?: string;
  inline?: boolean;
};

const BodyTextV2: FC<Props> = ({ color, children, className = "", inline }) => (
  <BaseText
    className={className}
    color={color}
    font="font-inter"
    inline={inline}
    size="text-xs md:text-base"
  >
    {children}
  </BaseText>
);

export default BodyTextV2;
