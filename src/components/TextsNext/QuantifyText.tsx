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
    {unitPostfix && <>&nbsp;{unitPostfix}</>}
  </TextRoboto>
);

export default QuantifyText;
