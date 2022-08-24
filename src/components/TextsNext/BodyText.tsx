import type { FC, ReactNode } from "react";
import { TextInter } from "../Texts";

// If your design supports Mobile XS 320px, and it should, then you probably want BodyTextV2.
// Consider marking this one deprecated.

type Props = {
  children: ReactNode;
  className?: string;
  inline?: boolean;
  skeletonWidth?: string;
};

const BodyText: FC<Props> = ({
  children,
  className = "",
  inline,
  skeletonWidth,
}) => (
  <TextInter
    className={`text-base md:text-lg ${className}`}
    inline={inline}
    skeletonWidth={skeletonWidth}
  >
    {children}
  </TextInter>
);

export default BodyText;
