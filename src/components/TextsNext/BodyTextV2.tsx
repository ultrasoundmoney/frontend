import type { FC, ReactNode } from "react";
import { TextInter } from "../Texts";

type Props = {
  children: ReactNode;
  className?: string;
  inline?: boolean;
  skeletonWidth?: string;
};

const BodyTextV2: FC<Props> = ({
  children,
  className = "",
  inline,
  skeletonWidth,
}) => (
  <TextInter
    className={`text-xs md:text-base ${className}`}
    inline={inline}
    skeletonWidth={skeletonWidth}
  >
    {children}
  </TextInter>
);

export default BodyTextV2;
