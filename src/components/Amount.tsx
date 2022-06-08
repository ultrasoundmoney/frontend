import React, { FC, ReactNode, useContext } from "react";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import { Unit } from "../denomination";
import { FeatureFlagsContext } from "../feature-flags";
import * as Format from "../format";
import { AmountUnitSpace } from "./Spacing";
import { TextRoboto, UnitText } from "./Texts";

type AmountProps = {
  amountPostfix?: string;
  children: ReactNode;
  className?: string;
  textSizeClass?: string;
  unitPostfix?: string;
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
    {unitPostfix && (
      <>
        <AmountUnitSpace />
        <UnitText className={textSizeClass}>{unitPostfix}</UnitText>
      </>
    )}
  </TextRoboto>
);

type PercentAmountProps = {
  children: ReactNode;
  className?: string;
  skeletonWidth?: string;
  textSizeClass?: string;
};

export const PercentAmount: FC<PercentAmountProps> = ({
  children,
  className,
  skeletonWidth = "3rem",
  textSizeClass,
}) => {
  const { previewSkeletons } = useContext(FeatureFlagsContext);
  return (
    <Amount className={className} textSizeClass={textSizeClass}>
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
  unit: Unit | string;
};

export const MoneyAmount: FC<MoneyAmountProps> = ({
  amountPostfix,
  children,
  className,
  skeletonWidth = "3rem",
  textSizeClass,
  unit = "eth",
}) => {
  const { previewSkeletons } = useContext(FeatureFlagsContext);
  return (
    <Amount
      amountPostfix={amountPostfix}
      className={className}
      unitPostfix={unit === "eth" ? "ETH" : unit === "usd" ? "USD" : unit}
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

const defaultMoneyAnimationDuration = 0.8;
type MoneyAmountAnimatedProps = {
  children: number | undefined;
  skeletonWidth?: string;
  textClassName?: HTMLDivElement["className"];
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
        decimals={unit === "eth" ? 2 : 0}
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
  skeletonWidth?: string;
  textClassName?: string;
  tooltip?: string;
  unitText?: string;
};
export const AmountAnimatedShell: FC<AmountAnimatedShellProps> = ({
  children,
  className = "",
  skeletonWidth = "3rem",
  textClassName,
  tooltip,
  unitText,
}) => {
  const { previewSkeletons } = useContext(FeatureFlagsContext);
  return (
    <TextRoboto
      className={`
        font-light
        whitespace-nowrap
        ${textClassName ?? "text-base md:text-lg"}
        ${className}
      `}
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
    </TextRoboto>
  );
};

type AmountBillionsUsdAnimatedProps = {
  children: number | undefined;
  className?: string;
  skeletonWidth?: string;
  textClassName?: string;
  tooltip?: string;
};

export const AmountBillionsUsdAnimated: FC<AmountBillionsUsdAnimatedProps> = ({
  children,
  skeletonWidth = "3rem",
  textClassName,
  tooltip,
}) => (
  <AmountAnimatedShell
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
