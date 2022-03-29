import React, { FC, useContext } from "react";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import { Unit } from "../denomination";
import { FeatureFlagsContext } from "../feature-flags";
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

const defaultMoneyAnimationDuration = 0.8;
type MoneyAmountAnimatedProps = {
  children: number | undefined;
  skeletonWidth?: string;
  textClassName: HTMLDivElement["className"];
  unit: Unit;
  unitText: string;
};

export const MoneyAmountAnimated: FC<MoneyAmountAnimatedProps> = ({
  children,
  skeletonWidth,
  textClassName,
  unit,
  unitText,
}) => (
  <AmountAnimatedShell
    skeletonWidth={skeletonWidth}
    textClassName={textClassName}
    unitText={unitText}
  >
    {children && (
      <CountUp
        decimals={unit === "eth" ? 2 : 1}
        duration={defaultMoneyAnimationDuration}
        end={unit === "eth" ? Format.ethFromWei(children) : children / 1000}
        preserveValue={true}
        separator=","
        suffix={unit === "eth" ? "" : "K"}
      />
    )}
  </AmountAnimatedShell>
);

type AmountAnimatedShellProps = {
  className?: string;
  skeletonWidth?: string;
  textClassName?: string;
  unitText?: string;
};
export const AmountAnimatedShell: FC<AmountAnimatedShellProps> = ({
  children,
  className = "",
  skeletonWidth = "3rem",
  textClassName,
  unitText,
}) => {
  const { previewSkeletons } = useContext(FeatureFlagsContext);
  return (
    <TextRoboto
      className={`
        whitespace-nowrap
        ${textClassName ?? "text-base md:text-lg"}
        ${className}
      `}
    >
      {children === undefined || previewSkeletons ? (
        <Skeleton width={skeletonWidth} inline />
      ) : (
        children
      )}
      {unitText && (
        <>
          <AmountUnitSpace />
          <UnitText>{unitText}</UnitText>
        </>
      )}
    </TextRoboto>
  );
};

type AmountBillionsUsdAnimatedProps = {
  children: number | undefined;
  className?: string;
  skeletonWidth?: string;
  textClassName?: string;
};

export const AmountBillionsUsdAnimated: FC<AmountBillionsUsdAnimatedProps> = ({
  children,
  skeletonWidth = "3rem",
  textClassName,
}) => (
  <AmountAnimatedShell
    skeletonWidth={skeletonWidth}
    textClassName={textClassName}
    unitText="USD"
  >
    {children && (
      <CountUp
        decimals={2}
        duration={defaultMoneyAnimationDuration}
        end={children / 1e9}
        preserveValue={true}
        separator=","
        suffix="B"
      />
    )}
  </AmountAnimatedShell>
);

type AmountTrillionsUsdAnimatedProps = {
  children: number | undefined;
  className?: string;
  skeletonWidth?: string;
  textClassName?: string;
};

export const AmountTrillionsUsdAnimated: FC<
  AmountTrillionsUsdAnimatedProps
> = ({ children, skeletonWidth = "3rem", textClassName = "" }) => (
  <AmountAnimatedShell
    skeletonWidth={skeletonWidth}
    textClassName={textClassName}
    unitText="USD"
  >
    {children && (
      <CountUp
        decimals={2}
        duration={defaultMoneyAnimationDuration}
        end={children / 1e12}
        preserveValue={true}
        separator=","
        suffix="T"
      />
    )}
  </AmountAnimatedShell>
);

type AmountCompactAnimatedProps = {
  children: number | undefined;
  className?: string;
  skeletonWidth?: string;
  textClassName?: string;
  unit?: Unit | string;
};

export const AmountCompactAnimated: FC<AmountCompactAnimatedProps> = ({
  children,
  skeletonWidth = "3rem",
  textClassName = "",
  unit = "eth",
}) => (
  <AmountAnimatedShell
    skeletonWidth={skeletonWidth}
    textClassName={textClassName}
    unitText={unit === "eth" ? "ETH" : unit === "usd" ? "USD" : unit}
  >
    {children && (
      <CountUp
        duration={defaultMoneyAnimationDuration}
        end={children}
        preserveValue={true}
        separator=","
        formattingFn={Format.formatCompact}
      />
    )}
  </AmountAnimatedShell>
);
