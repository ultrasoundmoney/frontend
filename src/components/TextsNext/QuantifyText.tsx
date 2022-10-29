import type { FC, ReactNode } from "react";
import { BaseText } from "../Texts";

type Props = {
  amountPostfix?: string;
  children: ReactNode;
  className?: string;
  color?: string;
  size?: string;
  unitPostfix?: string;
};

const QuantifyText: FC<Props> = ({
  amountPostfix,
  children,
  className,
  color,
  unitPostfix,
  size,
}) => (
  <div className={className}>
    <BaseText font="font-roboto" color={color} size={size}>
      {children}
      {amountPostfix === undefined ? undefined : amountPostfix}
    </BaseText>
    {unitPostfix && (
      <BaseText
        font="font-roboto"
        color="text-slateus-400"
        className="ml-1"
        size={size}
      >
        {unitPostfix}
      </BaseText>
    )}
  </div>
);

export default QuantifyText;
