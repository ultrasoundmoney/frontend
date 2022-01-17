import React, { FC } from "react";
import { Unit } from "../denomination";
import { AmountUnitSpace } from "./Spacing";
import { TextRoboto, UnitText } from "./Texts";

export const Amount: FC<{
  className?: string;
  unit: Unit | "months";
  unitPrefix?: string;
}> = ({ className, children, unitPrefix, unit }) => (
  <TextRoboto className={`text-base md:text-lg ${className ?? ""}`}>
    {children}
    {unitPrefix}
    <AmountUnitSpace />
    <UnitText>
      {unit === "eth" ? "ETH" : unit === "usd" ? "USD" : unit}
    </UnitText>
  </TextRoboto>
);
