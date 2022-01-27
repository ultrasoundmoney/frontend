import React, { FC } from "react";
import CountUp from "react-countup";
import { Unit } from "../denomination";
import * as Format from "../format";
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

export const AnimatedAmount: FC<{ unit: Unit; children: number }> = ({
  children,
  unit,
}) => (
  <CountUp
    decimals={unit === "eth" ? 2 : 1}
    duration={0.8}
    end={unit === "eth" ? Format.ethFromWei(children) : children / 1000}
    preserveValue={true}
    separator=","
    suffix={unit === "eth" ? "" : "K"}
  />
);
