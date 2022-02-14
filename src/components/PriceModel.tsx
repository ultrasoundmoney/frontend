import { FC, InputHTMLAttributes, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useGroupedData1 } from "../api/grouped-stats-1";
import { useScarcity } from "../api/scarcity";
import * as Format from "../format";
import { MoneyAmount, MoneyAmountAnimated } from "./Amount";
import styles from "./PriceModel.module.scss";
import { AmountUnitSpace } from "./Spacing";
import { TextInter, TextRoboto } from "./Texts";
import { WidgetBackground, WidgetTitle } from "./widget-subcomponents";
import * as NumberUtil from "../number-util";

type SliderProps = {
  className?: InputHTMLAttributes<HTMLInputElement>["className"];
  max: InputHTMLAttributes<HTMLInputElement>["max"];
  min: InputHTMLAttributes<HTMLInputElement>["min"];
  onChange: (num: number) => void;
  step: InputHTMLAttributes<HTMLInputElement>["step"];
  children: number;
};

const Slider: FC<SliderProps> = ({
  className,
  min,
  max,
  step,
  children,
  onChange,
}) => (
  <input
    className={`
      appearance-none
      w-full h-2
      bg-blue-dusk
      rounded-full
      ${styles.customSlider}
      ${className ?? ""}
    `}
    type="range"
    min={min}
    max={max}
    value={children}
    onChange={(event) => onChange(Number(event.target.value))}
    step={step}
  />
);

const Marker: FC<{ alt?: string; icon: string; ratio: number }> = ({
  alt,
  icon,
  ratio,
}) => (
  <div
    className="absolute flex flex-col items-center"
    style={{ left: `${ratio * 100}%` }}
  >
    <div className="[min-height:8px] w-0.5 bg-blue-spindle mb-3"></div>
    <img src={`/${icon}-icon.svg`} alt={alt ?? ""} />
  </div>
);

const monetaryPremiumMax = 6;
const monetaryPremiumStepSize = 0.1;
const goldMonetaryPremiumMultiple = 5;
const goldMonetaryPremiumPosition = NumberUtil.round(
  goldMonetaryPremiumMultiple / monetaryPremiumMax,
  1,
);

// Converts from a linear scale between 0 and 100 to a log scale between 1 and 400.
const logFromPosition = (position: number) => {
  const max = 300;
  const minLog = Math.log(1);
  const maxLog = Math.log(max);

  // calculate adjustment factor
  const scale = (maxLog - minLog) / 100;
  const logPosition = Math.exp(minLog + scale * position);
  const clampedLogPosition = Math.min(logPosition, max);
  return clampedLogPosition;
};

const PriceModel: FC = () => {
  const d30BurnTotal = useGroupedData1()?.feesBurned.feesBurned30dUsd;
  const ethSupply = useScarcity()?.ethSupply;
  const [peRatio, setPeRatio] = useState(24.5);
  const [peRatioPosition, setPeRatioPosition] = useState(33);
  const [monetaryPremium, setMonetaryPremium] = useState(1);

  const annualizedEarnings =
    d30BurnTotal === undefined ? undefined : d30BurnTotal * 12;
  const earningsPerShare =
    annualizedEarnings === undefined || ethSupply === undefined
      ? undefined
      : annualizedEarnings / Format.ethFromWeiBIUnsafe(ethSupply);
  const projectedPrice =
    earningsPerShare === undefined
      ? undefined
      : earningsPerShare * peRatio * monetaryPremium;

  useEffect(() => {
    setPeRatio(logFromPosition(peRatioPosition));
  }, [peRatioPosition]);

  return (
    <WidgetBackground>
      <WidgetTitle>price model</WidgetTitle>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex justify-between">
          <TextInter>anual profits</TextInter>
          <MoneyAmount unitPrefix="B" unit="usd">
            {annualizedEarnings === undefined
              ? undefined
              : Format.formatOneDigit(annualizedEarnings / 1e9)}
          </MoneyAmount>
        </div>
        <div>
          <div className="flex justify-between">
            <TextInter>growth profile</TextInter>
            <TextRoboto>{Format.formatOneDigit(peRatio)}</TextRoboto>
          </div>
          <div className="relative mb-8">
            <Slider
              className="w-full"
              step={1}
              min={0}
              max={100}
              onChange={setPeRatioPosition}
            >
              {peRatioPosition}
            </Slider>
            <div className="absolute top-0 bottom-0 w-full flex [margin-top:10px] pointer-events-none">
              <Marker icon="apple" ratio={0.2} />
              <Marker icon="google" ratio={0.4} />
              <Marker icon="netflix" ratio={0.55} />
              <Marker icon="tesla" ratio={0.8} />
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <TextInter>monetary premium</TextInter>
            <TextRoboto>{`${Format.formatOneDigit(
              monetaryPremium,
            )}x`}</TextRoboto>
          </div>
          <div className="relative mb-8">
            <Slider
              step={monetaryPremiumStepSize}
              min={1}
              max={monetaryPremiumMax}
              onChange={setMonetaryPremium}
            >
              {monetaryPremium}
            </Slider>
            <div className="absolute top-0 bottom-0 w-full flex [margin-top:10px] pointer-events-none">
              <Marker icon="gold" ratio={goldMonetaryPremiumPosition} />
            </div>
          </div>
        </div>
        <div className="bg-blue-highlightbg p-3 rounded-lg m-auto">
          <TextRoboto className="text-xl">
            {projectedPrice === undefined ? (
              <Skeleton width="6rem" />
            ) : (
              <MoneyAmountAnimated unit="usd">
                {projectedPrice}
              </MoneyAmountAnimated>
            )}
            <AmountUnitSpace />
            <TextRoboto className="text-blue-spindle">USD</TextRoboto>
          </TextRoboto>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default PriceModel;
