import type { FC, ReactNode } from "react";
import { BaseText } from "../Texts";

type Props = {
  amountPostfix?: string;
  children: ReactNode;
  className?: string;
  color?: string;
  lineHeight?: string;
  size?: string;
  unitPostfix?: string;
  unitPostfixColor?: string;
  unitPostfixMargin?: string;
};

const QuantifyText: FC<Props> = ({
  amountPostfix,
  children,
  className,
  color,
  lineHeight,
  size,
  unitPostfix,
  unitPostfixColor = "text-slateus-400",
  unitPostfixMargin = "ml-1",
}) => (
  <BaseText
    className={className}
    color={color}
    font="font-roboto"
    lineHeight={lineHeight}
    size={size}
  >
    {children}
    {amountPostfix}
    {unitPostfix && (
      <BaseText
        font="font-roboto"
        color={unitPostfixColor}
        className={unitPostfixMargin}
        size={size}
      >
        {unitPostfix}
      </BaseText>
    )}
  </BaseText>
);

export default QuantifyText;
