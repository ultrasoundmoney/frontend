import type { FC, ReactNode } from "react";
import { BaseText } from "../Texts";

type Props = {
  amountPostfix?: string;
  children: ReactNode;
  className?: string;
  color?: string;
  size?: string;
  unitPostfix?: string;
  unitPostfixColor?: string;
};

const QuantifyText: FC<Props> = ({
  amountPostfix,
  children,
  className,
  color,
  unitPostfix,
  unitPostfixColor = "text-slateus-400",
  size,
}) => (
  <div className={className}>
    <BaseText font="font-roboto" color={color} size={size}>
      {children}
      {amountPostfix === undefined ? undefined : amountPostfix}
      {unitPostfix && (
        <BaseText
          font="font-roboto"
          color={unitPostfixColor}
          className="ml-1"
          size={size}
        >
          {unitPostfix}
        </BaseText>
      )}
    </BaseText>
  </div>
);

export default QuantifyText;
