import type { FC, ReactNode } from "react";
import { TextInter } from "../Texts";

type Props = {
  children: ReactNode;
  className?: string;
  skeletonWidth?: string;
};

const LabelText: FC<Props> = ({ children, className = "" }) => (
  <TextInter
    className={`
      font-light
      text-slateus-200 text-xs
      uppercase tracking-widest
      ${className}
    `}
  >
    {children}
  </TextInter>
);

export default LabelText;
