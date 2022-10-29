import type { FC, ReactNode } from "react";
import { BaseText } from "../Texts";

// If your design supports Mobile XS 320px, and it should, then you probably
// want BodyTextV2 instead.

type Props = {
  children: ReactNode;
  className?: string;
  inline?: boolean;
};

/**
 * @deprecated build on BodyTextV2 instead to support smaller screens better.
 */
const BodyText: FC<Props> = ({ children, className, inline }) => (
  <BaseText
    font="font-inter"
    className={className}
    size="text-base md:text-lg"
    inline={inline}
  >
    {children}
  </BaseText>
);

export default BodyText;
