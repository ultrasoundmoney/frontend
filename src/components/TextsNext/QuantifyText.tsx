import type { FC, ReactNode } from "react";
import type { FontWeight } from "../Texts";
import { BaseText } from "../Texts";

type Props = {
  amountPostfix?: string;
  children: ReactNode;
  className?: string;
  color?: string;
  lineHeight?: string;
  size?: string;
  tooltip?: string;
  unitPostfix?: string;
  unitPostfixColor?: string;
  unitPostfixMargin?: string;
  weight?: FontWeight;
};

const QuantifyText: FC<Props> = ({
  amountPostfix,
  children,
  className,
  color,
  lineHeight,
  size,
  tooltip,
  unitPostfix,
  unitPostfixColor = "text-slateus-200",
  unitPostfixMargin = "ml-1",
  weight,
}) => (
  <BaseText
    className={className}
    color={color}
    font="font-roboto"
    lineHeight={lineHeight}
    size={size}
    tooltip={tooltip}
    weight={weight || size === "text-xs" ? "font-normal" : undefined}
  >
    {children}
    {amountPostfix}
    {unitPostfix && (
      <BaseText
        font="font-roboto"
        color={unitPostfixColor}
        className={unitPostfixMargin}
        size={size}
        weight={weight || size === "text-xs" ? "font-normal" : undefined}
      >
        {unitPostfix}
      </BaseText>
    )}
  </BaseText>
);

export default QuantifyText;
