import React, { FC } from "react";
import { Unit } from "./ComingSoon/CurrencyControl";
import { AmountUnitSpace } from "./Spacing";
import { UnitText } from "./Texts";

export const Amount: FC<{
  className?: string;
  unit: Unit | "months";
  unitPrefix?: string;
}> = ({ className, children, unitPrefix, unit }) => (
  <span className={`font-roboto text-white ${className}`}>
    {children}
    {unitPrefix}
    <AmountUnitSpace />
    <UnitText>
      {unit === "eth" ? "ETH" : unit === "usd" ? "USD" : unit}
    </UnitText>
  </span>
);
