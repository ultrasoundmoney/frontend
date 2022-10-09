import type { FC, ReactNode } from "react";
import { BaseText } from "../Texts";

type Props = {
  children: ReactNode;
  className?: string;
};

const LinkText: FC<Props> = ({ children, className = "" }) => (
  <BaseText
    className={`
      cursor-pointer
      hover:underline
      hover:brightness-90
      active:brightness-75
      ${className}
    `}
    font="font-inter"
    color="text-slateus-200"
  >
    {children}
  </BaseText>
);

export default LinkText;
