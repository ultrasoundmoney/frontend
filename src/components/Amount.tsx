import React, { FC } from "react";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import { Unit } from "../denomination";
import * as Format from "../format";
import { AmountUnitSpace } from "./Spacing";
import { TextRoboto, UnitText } from "./Texts";

type AmountProps = {
  amountPostfix?: string;
  className?: string;
  textSizeClass?: string;
  unitPostfix: string;
};

export const Amount: FC<AmountProps> = ({
  amountPostfix,
  children,
  className,
  textSizeClass,
  unitPostfix,
}) => (
  <TextRoboto
    className={`${className ?? ""} ${textSizeClass ?? "text-base md:text-lg"}`}
  >
    {children}
    {amountPostfix}
    <AmountUnitSpace />
    <UnitText className={textSizeClass}>{unitPostfix}</UnitText>
  </TextRoboto>
);

type MoneyAmountProps = {
  amountPostfix?: string;
  className?: string;
  skeletonWidth?: string;
  textSizeClass?: string;
  unit: Unit | string;
};

export const MoneyAmount: FC<MoneyAmountProps> = ({
  amountPostfix,
  children,
  className,
  skeletonWidth = "3rem",
  textSizeClass,
  unit = "eth",
}) => (
  <Amount
    amountPostfix={amountPostfix}
    className={className}
    unitPostfix={unit === "eth" ? "ETH" : unit === "usd" ? "USD" : unit}
    textSizeClass={textSizeClass}
  >
    {children === undefined ? (
      <Skeleton inline={true} width={skeletonWidth} />
    ) : (
      children
    )}
  </Amount>
);

type MoneyAmountAnimatedProps = { children: number; unit: Unit };

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
