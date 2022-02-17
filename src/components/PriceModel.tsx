import JSBI from "jsbi";
import { FC, InputHTMLAttributes, useEffect, useState } from "react";
import { useGroupedData1 } from "../api/grouped-stats-1";
import { usePeRatios } from "../api/pe-ratios";
import { useScarcity } from "../api/scarcity";
import * as Format from "../format";
import { pipe } from "../fp";
import * as NumberUtil from "../number-util";
import { MoneyAmount } from "./Amount";
import styles from "./PriceModel.module.scss";
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

// Markers are positioned absolutely, manipulating their 'left' relatively to the full width bar which should be positioned relatively as their parent. Marker width
const Marker: FC<{
  alt?: string;
  icon: string;
  ratio: number;
  symbol?: string;
}> = ({ alt, icon, ratio, symbol }) => (
  <div
    className="absolute flex flex-col pointer-events-none"
    // For unclear reasons the left 89% position for TSLA is closer to notch 91 on the actual slider. We manually adjust.
    style={{ left: `${symbol === "TSLA" ? ratio * 100 - 2 : ratio * 100}%` }}
  >
    <div className="[min-height:8px] w-0.5 bg-blue-spindle mb-3"></div>
    <a
      className="pointer-events-auto -translate-x-1/2"
      href={
        symbol === undefined
          ? undefined
          : `https://www.google.com/finance/quote/${symbol}:NASDAQ`
      }
      target="_blank"
      rel="noreferrer"
    >
      <img src={`/${icon}-icon.svg`} alt={alt} />
    </a>
  </div>
);

const monetaryPremiumMax = 6;
const monetaryPremiumStepSize = 0.1;
const goldMonetaryPremiumMultiple = 5;
const goldMonetaryPremiumPosition = NumberUtil.round(
  goldMonetaryPremiumMultiple / monetaryPremiumMax,
  1,
);

const growthProfileMin = 5;
const growthProfileMax = 300;
const growthProfileLogMin = Math.log(growthProfileMin);
const growthProfileLogMax = Math.log(growthProfileMax);
const logRange = growthProfileLogMax - growthProfileLogMin;

// Converts from a linear scale between 0 and 100 to a log scale between 1 and 300.
const logFromLinear = (position: number) =>
  pipe(
    position * logRange,
    (positionInRange) => positionInRange + growthProfileLogMin,
    (shiftedPosition) => Math.exp(shiftedPosition),
  );

// Converts from a log scale between 1 and 300 to a linear scale between 0 and 1
const linearFromLog = (num: number) =>
  pipe(
    Math.log(num) - growthProfileLogMin,
    (peShiftedRange) => peShiftedRange / logRange,
  );

const sliderPositions = new Array(101)
  .fill(undefined)
  .map((_, index) => logFromLinear(index / 100));

const roundToNearestPosition = (num: number) => {
  let bestCandidate = sliderPositions[0];

  for (let i = 1; i < sliderPositions.length; i++) {
    const nextCandidate = sliderPositions[i];
    if (Math.abs(num - bestCandidate) > Math.abs(num - nextCandidate)) {
      bestCandidate = nextCandidate;
    } else {
      break;
    }
  }

  return bestCandidate;
};

const calcProjectedPrice = (
  annualizedEarnings: number | undefined,
  ethSupply: JSBI | undefined,
  monetaryPremium: number | undefined,
  peRatio: number | undefined,
) => {
  if (
    annualizedEarnings === undefined ||
    ethSupply === undefined ||
    peRatio === undefined ||
    monetaryPremium === undefined
  ) {
    return undefined;
  }

  const earningsPerShare =
    annualizedEarnings / Format.ethFromWeiBIUnsafe(ethSupply);
  return earningsPerShare * peRatio * monetaryPremium;
};

const PriceModel: FC = () => {
  const peRatios = usePeRatios();
  const d30BurnTotal = useGroupedData1()?.feesBurned.feesBurned30dUsd;
  const ethSupply = useScarcity()?.ethSupply;
  const [peRatio, setPeRatio] = useState(24.5);
  const [peRatioPosition, setPeRatioPosition] = useState(0.33);
  const [monetaryPremium, setMonetaryPremium] = useState(1);

  const annualizedEarnings =
    d30BurnTotal === undefined ? undefined : d30BurnTotal * 12;

  const projectedPrice = calcProjectedPrice(
    annualizedEarnings,
    ethSupply,
    monetaryPremium,
    peRatio,
  );

  useEffect(() => {
    setPeRatio(logFromLinear(peRatioPosition));
  }, [peRatioPosition]);

  return (
    <WidgetBackground>
      <WidgetTitle>price model</WidgetTitle>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex justify-between">
          <TextInter>annual profits</TextInter>
          <MoneyAmount amountPostfix="B" unit="usd">
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
              step={0.01}
              min={0}
              max={1}
              onChange={setPeRatioPosition}
            >
              {peRatioPosition}
            </Slider>
            <div className="absolute top-0 w-full [margin-top:10px] select-none">
              {peRatios !== undefined && (
                <>
                  <Marker
                    alt="amazon logo"
                    icon="amazon"
                    ratio={linearFromLog(roundToNearestPosition(peRatios.AMZN))}
                    symbol="AMZN"
                  />
                  <Marker
                    alt="google logo"
                    icon="google"
                    ratio={linearFromLog(
                      roundToNearestPosition(peRatios.GOOGL),
                    )}
                    symbol="GOOGL"
                  />
                  <Marker
                    alt="intel logo"
                    icon="intel"
                    ratio={linearFromLog(roundToNearestPosition(peRatios.INTC))}
                    symbol="INTC"
                  />
                  <Marker
                    alt="netflix logo"
                    icon="netflix"
                    ratio={linearFromLog(roundToNearestPosition(peRatios.NFLX))}
                    symbol="NFLX"
                  />
                  <Marker
                    alt="tesla logo"
                    icon="tesla"
                    ratio={linearFromLog(roundToNearestPosition(peRatios.TSLA))}
                    symbol="TSLA"
                  />
                </>
              )}
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
          <MoneyAmount
            className="text-xl"
            unit="usd"
            skeletonWidth="6rem"
            amountPostfix="K"
          >
            {projectedPrice === undefined
              ? undefined
              : Format.formatTwoDigit(projectedPrice / 1000)}
          </MoneyAmount>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default PriceModel;
