import type { FC, ReactNode } from "react";
import { TextInter } from "../Texts";

type Props = {
  children: ReactNode;
  className?: string;
  color?: string;
  skeletonWidth?: string;
};

const LabelText: FC<Props> = ({
  children,
  className = "",
  color = "text-slateus-200",
}) => (
  <TextInter
    className={`
      font-light
      text-xs
      uppercase tracking-widest
      ${className}
      ${color}
    `}
  >
    {children}
  </TextInter>
);

export default LabelText;
