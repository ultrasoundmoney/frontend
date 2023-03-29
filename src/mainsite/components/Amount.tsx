import type { FC, ReactNode } from "react";
import React, { useContext } from "react";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import type { Unit } from "../../denomination";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import { AmountUnitSpace } from "./Spacing";
import { BaseText, UnitText } from "./../../components/Texts";
import QuantifyText from "../../components/TextsNext/QuantifyText";

type AmountProps = {
  amountPostfix?: string;
  children: ReactNode;
  className?: string;
  textSizeClass?: string;
  unitPostfix?: string;
};

export const Amount: FC<AmountProps> = ({
  amountPostfix = "",
  children,
  className,
  textSizeClass,
  unitPostfix,
}) => (
  <BaseText
    font="font-roboto"
    className={`${className ?? ""} ${textSizeClass ?? "text-base md:text-lg"}`}
  >
    {children}
    {amountPostfix}
    {unitPostfix && (
      <>
        <AmountUnitSpace />
        <UnitText className={textSizeClass}>{unitPostfix}</UnitText>
      </>
    )}
  </BaseText>
);

type PercentAmountProps = {
  amountPostfix?: string;
  children: ReactNode;
  className?: string;
  skeletonWidth?: string;
  textSizeClass?: string;
};

export const PercentAmount: FC<PercentAmountProps> = ({
  amountPostfix = "",
  children,
  className,
  skeletonWidth = "3rem",
  textSizeClass,
}) => {
  const { previewSkeletons } = useContext(FeatureFlagsContext);
  return (
    <Amount
      amountPostfix={amountPostfix}
      className={className}
      textSizeClass={textSizeClass}
    >
      {children === undefined || previewSkeletons ? (
        <Skeleton inline={true} width={skeletonWidth} />
      ) : (
        children
      )}
    </Amount>
  );
};

type MoneyAmountProps = {
  amountPostfix?: string;
  children: ReactNode;
  className?: string;
  skeletonWidth?: string;
  textSizeClass?: string;
  unitText?: string;
};

export const MoneyAmount: FC<MoneyAmountProps> = ({
  amountPostfix,
  children,
  className,
  skeletonWidth = "3rem",
  textSizeClass,
  unitText = "ETH",
}) => {
  const { previewSkeletons } = useContext(FeatureFlagsContext);
  return (
    <Amount
      amountPostfix={amountPostfix}
      className={className}
      unitPostfix={unitText}
      textSizeClass={textSizeClass}
    >
      {children === undefined || previewSkeletons ? (
        <Skeleton inline={true} width={skeletonWidth} />
      ) : (
        children
      )}
    </Amount>
  );
};

export const defaultMoneyAnimationDuration = 0.8;
type MoneyAmountAnimatedProps = {
  children: number | undefined;
  decimals?: number;
  size?: string;
  skeletonWidth?: string;
  textClassName?: string;
  unit: Unit;
  unitText: string;
};

export const QuantifyTextAnimated: FC<MoneyAmountAnimatedProps> = ({
  children,
  decimals = 2,
  size,
  skeletonWidth,
  textClassName,
  unit,
  unitText,
}) => (
  <AmountAnimatedShell
    size={size}
    skeletonWidth={skeletonWidth}
    textClassName={textClassName}
    unitText={unitText}
  >
    {children && (
      <CountUp
        decimals={decimals}
        duration={defaultMoneyAnimationDuration}
        end={unit === "eth" ? Format.ethFromWei(children) : children}
        preserveValue={true}
        separator=","
      />
    )}
  </AmountAnimatedShell>
);

type AmountAnimatedShellProps = {
  children: ReactNode;
  className?: string;
  color?: string;
  size?: string;
  skeletonWidth?: string;
  textClassName?: string;
  tooltip?: string;
  unitText?: string;
};
export const AmountAnimatedShell: FC<AmountAnimatedShellProps> = ({
  children,
  className = "",
  color,
  size,
  skeletonWidth = "3rem",
  textClassName = "",
  tooltip,
  unitText,
}) => {
  const { previewSkeletons } = useContext(FeatureFlagsContext);
  return (
    <QuantifyText
      color={color}
      size={size ?? "text-base md:text-lg"}
      className={`whitespace-nowrap ${textClassName} ${className}`}
      tooltip={tooltip}
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
    </QuantifyText>
  );
};

type AmountBillionsUsdAnimatedProps = {
  children: number | undefined;
  className?: string;
  size?: string;
  skeletonWidth?: string;
  textClassName?: string;
  tooltip?: string;
};

export const AmountBillionsUsdAnimated: FC<AmountBillionsUsdAnimatedProps> = ({
  children,
  size,
  skeletonWidth = "3rem",
  textClassName,
  tooltip,
}) => (
  <AmountAnimatedShell
    size={size}
    skeletonWidth={skeletonWidth}
    textClassName={textClassName}
    tooltip={tooltip}
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
  size?: string;
};

export const AmountTrillionsUsdAnimated: FC<
  AmountTrillionsUsdAnimatedProps
> = ({ children, skeletonWidth = "3rem", textClassName = "", size }) => (
  <AmountAnimatedShell
    skeletonWidth={skeletonWidth}
    textClassName={textClassName}
    size={size}
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
  size: string;
  skeletonWidth?: string;
  textClassName?: string;
  unit?: Unit | string;
};

export const AmountCompactAnimated: FC<AmountCompactAnimatedProps> = ({
  children,
  size,
  skeletonWidth = "3rem",
  textClassName = "",
  unit = "eth",
}) => (
  <AmountAnimatedShell
    size={size}
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
