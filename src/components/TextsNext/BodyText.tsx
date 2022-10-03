import type { FC, ReactNode } from "react";
import { TextInter } from "../Texts";

// If your design supports Mobile XS 320px, and it should, then you probably want BodyTextV2.

type Props = {
  children: ReactNode;
  className?: string;
  inline?: boolean;
  skeletonWidth?: string;
};

/**
 * @deprecated build on BodyTextV2 instead to support smaller screens better.
 */
const BodyText: FC<Props> = ({ children, className = "", inline }) => (
  <TextInter
    className={`text-base font-light md:text-lg ${className}`}
    inline={inline}
  >
    {children}
  </TextInter>
);

export default BodyText;
