import type { FC, ReactNode } from "react";
import { TextRoboto } from "../Texts";

type Props = {
  amountPostfix?: string;
  children: ReactNode;
  className?: string;
  skeletonWidth?: string;
  unitPostfix?: string;
};

const QuantifyText: FC<Props> = ({
  amountPostfix = "",
  children,
  className = "",
  unitPostfix = "",
}) => (
  <TextRoboto className={className}>
    {children}
    {amountPostfix && amountPostfix}
    {unitPostfix && (
      <span className="text-slateus-400 ml-1">{unitPostfix}</span>
    )}
  </TextRoboto>
);

export default QuantifyText;
