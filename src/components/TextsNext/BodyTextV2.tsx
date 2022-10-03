import type { FC, ReactNode } from "react";
import { BaseText } from "../Texts";

type Props = {
  children: ReactNode;
  className?: string;
  inline?: boolean;
};

const BodyTextV2: FC<Props> = ({ children, className = "", inline }) => (
  <BaseText
    font="font-inter"
    size="text-xs md:text-base"
    className={className}
    inline={inline}
  >
    {children}
  </BaseText>
);

export default BodyTextV2;
