import { FC, InputHTMLAttributes, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useGroupedData1 } from "../api/grouped_stats_1";
import { useScarcity } from "../api/scarcity";
import * as Format from "../format";
import { MoneyAmount, MoneyAmountAnimated } from "./Amount";
import styles from "./FairPrice.module.scss";
import { AmountUnitSpace } from "./Spacing";
import { TextInter, TextRoboto } from "./Texts";
import { WidgetBackground, WidgetTitle } from "./widget-subcomponents";

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

const FairPrice: FC = () => {
  const d30BurnTotal = useGroupedData1()?.feesBurned.feesBurned30dUsd;
  const ethSupply = useScarcity()?.ethSupply;
  const [priceEarningsRatio, setPriceEarningsRatio] = useState(24.5);
  const [monetaryPremium, setMonetaryPremium] = useState(1);

  const annualizedEarnings =
    d30BurnTotal === undefined ? undefined : d30BurnTotal * 12;
  const earningsPerShare =
    annualizedEarnings === undefined || ethSupply === undefined
      ? undefined
      : annualizedEarnings / Format.ethFromWeiBIUnsafe(ethSupply);
  const fairPrice =
    earningsPerShare === undefined
      ? undefined
      : earningsPerShare * priceEarningsRatio * monetaryPremium;

  return (
    <WidgetBackground>
      <WidgetTitle>fair price</WidgetTitle>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex justify-between">
          <TextInter>anualized earnings</TextInter>
          <MoneyAmount unitPrefix="B" unit="usd">
            {annualizedEarnings === undefined
              ? undefined
              : Format.formatOneDigit(annualizedEarnings / 1e9)}
          </MoneyAmount>
        </div>
        <div>
          <div className="flex justify-between">
            <TextInter>benchmark p/e</TextInter>
            <TextRoboto>{Format.formatOneDigit(priceEarningsRatio)}</TextRoboto>
          </div>
          <div className="relative mb-8">
            <Slider
              className="w-full"
              step={0.5}
              min={5}
              max={30}
              onChange={setPriceEarningsRatio}
            >
              {priceEarningsRatio}
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
            <Slider step={0.1} min={1} max={7} onChange={setMonetaryPremium}>
              {monetaryPremium}
            </Slider>
            <div className="absolute top-0 bottom-0 w-full flex [margin-top:10px] pointer-events-none">
              <Marker icon="gold" ratio={0.8} />
            </div>
          </div>
        </div>
        <div className="bg-blue-highlightbg p-3 rounded-lg m-auto">
          <TextRoboto className="text-xl">
            {fairPrice === undefined ? (
              <Skeleton width="6rem" />
            ) : (
              <MoneyAmountAnimated unit="usd">{fairPrice}</MoneyAmountAnimated>
            )}
            <AmountUnitSpace />
            <TextRoboto className="text-blue-spindle">USD</TextRoboto>
          </TextRoboto>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default FairPrice;
