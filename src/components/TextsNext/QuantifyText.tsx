import type { FC, ReactNode } from "react";
import { BaseText } from "../Texts";

type Props = {
  amountPostfix?: string;
  children: ReactNode;
  className?: string;
  color?: string;
  size?: string;
  skeletonWidth?: string;
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
  <BaseText font="font-roboto" className={className} color={color} size={size}>
    {children}
    {amountPostfix === undefined ? undefined : amountPostfix}
    {unitPostfix && (
      <BaseText
        font="font-roboto"
        color="text-slateus-400"
        className="ml-1"
        weight="font-normal"
      >
        {unitPostfix}
      </BaseText>
    )}
  </BaseText>
);

export default QuantifyText;
