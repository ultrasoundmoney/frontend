import type { FC, ReactNode } from "react";
import { BaseText } from "../Texts";

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
  <BaseText font="font-roboto" className={className}>
    {children}
    {amountPostfix && amountPostfix}
    {unitPostfix && (
      <span className="ml-1 text-slateus-400">{unitPostfix}</span>
    )}
  </BaseText>
);

export default QuantifyText;
