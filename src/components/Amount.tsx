import React, { FC } from "react";
import CountUp from "react-countup";
import { Unit } from "../denomination";
import * as Format from "../format";
import { AmountUnitSpace } from "./Spacing";
import { TextRoboto, UnitText } from "./Texts";

type AmountProps = {
  className?: string;
  unitPostfix: string;
  unitPrefix?: string;
};

export const Amount: FC<AmountProps> = ({
  className,
  children,
  unitPrefix,
  unitPostfix,
}) => (
  <TextRoboto className={`text-base md:text-lg ${className ?? ""}`}>
    {children}
    {unitPrefix}
    <AmountUnitSpace />
    <UnitText>{unitPostfix}</UnitText>
  </TextRoboto>
);

type MoneyAmountProps = {
  className?: string;
  unit: Unit;
  unitPrefix?: string;
};

export const MoneyAmount: FC<MoneyAmountProps> = ({
  className,
  children,
  unitPrefix,
  unit = "eth",
}) => (
  <Amount
    className={className}
    unitPostfix={unit === "eth" ? "ETH" : unit === "usd" ? "USD" : unit}
    unitPrefix={unitPrefix}
  >
    {children}
  </Amount>
);

type MoneyAmountAnimatedProps = { unit: Unit; children: number };

export const MoneyAmountAnimated: FC<MoneyAmountAnimatedProps> = ({
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
