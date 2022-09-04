import type { FC, ReactNode } from "react";
import { TextInter } from "../Texts";

type Props = {
  children: ReactNode;
  className?: string;
  inline?: boolean;
};

const BodyTextV2: FC<Props> = ({ children, className = "", inline }) => (
  <TextInter className={`text-xs md:text-base ${className}`} inline={inline}>
    {children}
  </TextInter>
);

export default BodyTextV2;
