import type { FC, ReactNode } from "react";
import { BaseText } from "../Texts";

type Props = {
  children: ReactNode;
  className?: string;
  color?: string;
  inline?: boolean;
};

const BodyTextV3: FC<Props> = ({ children, className, color, inline }) => (
  <BaseText
    className={className}
    color={color}
    font="font-inter"
    inline={inline}
    size="text-sm sm:text-base"
    lineHeight="leading-[18px] sm:leading-[21px]"
  >
    {children}
  </BaseText>
);

export default BodyTextV3;
