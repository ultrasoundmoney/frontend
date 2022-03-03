import JSBI from "jsbi";
import { FC, InputHTMLAttributes, useEffect, useState } from "react";
import { useAverageEthPrice } from "../api/eth-price";
import { useGroupedStats1 } from "../api/grouped-stats-1";
import { usePeRatios } from "../api/pe-ratios";
import { useScarcity } from "../api/scarcity";
import * as Format from "../format";
import { pipe } from "../fp";
import * as StaticEtherData from "../static-ether-data";
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
      cursor-pointer
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
  peRatio: number;
  ratio: number;
  symbol?: string;
}> = ({ alt, icon, peRatio, ratio, symbol }) => (
  <div
    className="absolute w-full flex flex-col pointer-events-none"
    style={{
      transform: `translateX(${ratio * 100}%)`,
    }}
  >
    <div className="[min-height:3px] w-3 bg-blue-shipcove mb-3 -translate-x-1/2"></div>
    <a
      title={peRatio.toFixed(1)}
      className="absolute pointer-events-auto top-4 -translate-x-1/2"
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

const MarkerText: FC<{ ratio: number }> = ({ ratio, children }) => (
  <div
    className="absolute w-full flex flex-col pointer-events-none"
    // For unclear reasons the left 89% position for TSLA is closer to notch 91 on the actual slider. We manually adjust.
    style={{ transform: `translateX(${ratio * 100}%)` }}
  >
    <div className="[min-height:3px] w-3 bg-blue-shipcove mb-3 -translate-x-1/2"></div>
    <TextRoboto className="absolute top-4 text-blue-spindle -translate-x-1/2">
      {children}
    </TextRoboto>
  </div>
);

const monetaryPremiumMin = 1;
const monetaryPremiumMax = 20;
const monetaryPremiumRange = monetaryPremiumMax - monetaryPremiumMin;
const monetaryPremiumStepSize = 0.01;

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
    Math.log(num),
    (linearPosition) => linearPosition - growthProfileLogMin,
    (peInRange) => peInRange / logRange,
    // Clamp
    (ratio) => Math.min(1, ratio),
    (ratio) => Math.max(0, ratio),
  );

const calcEarningsPerShare = (
  annualizedEarnings: number | undefined,
  ethSupply: JSBI | undefined,
) => {
  if (annualizedEarnings === undefined || ethSupply === undefined) {
    return undefined;
  }

  return annualizedEarnings / Format.ethFromWeiBIUnsafe(ethSupply);
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

  const earningsPerShare = calcEarningsPerShare(annualizedEarnings, ethSupply);
  if (earningsPerShare === undefined) {
    return undefined;
  }

  return earningsPerShare * peRatio * monetaryPremium;
};

const PriceModel: FC = () => {
  const peRatios = usePeRatios();
  const d30BurnTotal = useGroupedStats1()?.feesBurned.feesBurned30d;
  const ethSupply = useScarcity()?.ethSupply;
  const [peRatio, setPeRatio] = useState(24.5);
  const [peRatioPosition, setPeRatioPosition] = useState(0.33);
  const [monetaryPremium, setMonetaryPremium] = useState(1);
  const [initialPeSet, setInitialPeSet] = useState(false);
  const d30AverageEthPrice = useAverageEthPrice()?.d30;

  const annualizedRevenue =
    d30BurnTotal === undefined || d30AverageEthPrice === undefined
      ? undefined
      : Format.ethFromWei(d30BurnTotal * 12.175) * d30AverageEthPrice;
  const annualizedCosts =
    d30AverageEthPrice === undefined
      ? undefined
      : StaticEtherData.posIssuanceYear * d30AverageEthPrice;
  const annualizedEarnings =
    annualizedRevenue === undefined || annualizedCosts === undefined
      ? undefined
      : annualizedRevenue - annualizedCosts;

  useEffect(() => {
    if (
      initialPeSet ||
      annualizedEarnings === undefined ||
      d30AverageEthPrice === undefined
    ) {
      return;
    }

    setInitialPeSet(true);

    const earningsPerShare = calcEarningsPerShare(
      annualizedEarnings,
      ethSupply,
    );
    if (earningsPerShare === undefined) {
      return;
    }

    const currentPeRatio = d30AverageEthPrice / earningsPerShare;

    setPeRatioPosition(linearFromLog(currentPeRatio));
  }, [
    annualizedEarnings,
    d30AverageEthPrice,
    ethSupply,
    initialPeSet,
    setPeRatioPosition,
  ]);

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
      <WidgetTitle>price model (post-merge)</WidgetTitle>
      <div className="flex flex-col gap-4 mt-4 overflow-hidden">
        <div className="flex justify-between">
          <TextInter>annualized profits</TextInter>
          <MoneyAmount amountPostfix="B" unit="usd">
            {annualizedEarnings === undefined
              ? undefined
              : Format.formatOneDigit(annualizedEarnings / 1e9)}
          </MoneyAmount>
        </div>
        <div>
          <div className="flex justify-between">
            <TextInter>growth profile</TextInter>
            <MoneyAmount unit="P/E">
              {Format.formatOneDigit(peRatio)}
            </MoneyAmount>
          </div>
          <div className="relative mb-8">
            <Slider
              className="relative w-full z-10"
              step={0.001}
              min={0}
              max={1}
              onChange={setPeRatioPosition}
            >
              {peRatioPosition}
            </Slider>
            <div className="absolute top-2 w-full [margin-top:10px] select-none">
              {peRatios !== undefined && (
                // Because the actual slider does not span the entire visual slider, overlaying an element and setting the left is not perfect. We manually adjust values to match the slider more precisely. To improve this look into off-the-shelf components that allow for styled markers.
                <>
                  <Marker
                    alt="intel logo"
                    icon="intel"
                    peRatio={peRatios.INTC}
                    ratio={linearFromLog(peRatios.INTC)}
                    symbol="INTC"
                  />
                  <Marker
                    alt="google logo"
                    icon="google"
                    peRatio={peRatios.GOOGL}
                    ratio={linearFromLog(peRatios.GOOGL)}
                    symbol="GOOGL"
                  />
                  <Marker
                    alt="netflix logo"
                    icon="netflix"
                    peRatio={peRatios.NFLX}
                    ratio={linearFromLog(peRatios.NFLX)}
                    symbol="NFLX"
                  />
                  <Marker
                    alt="amazon logo"
                    icon="amazon"
                    peRatio={peRatios.AMZN}
                    ratio={linearFromLog(peRatios.AMZN)}
                    symbol="AMZN"
                  />
                  <Marker
                    alt="disney logo"
                    icon="disney"
                    peRatio={peRatios.DIS}
                    ratio={linearFromLog(peRatios.DIS)}
                    symbol="DIS"
                  />
                  <Marker
                    alt="tesla logo"
                    icon="tesla"
                    peRatio={peRatios.TSLA}
                    ratio={linearFromLog(peRatios.TSLA)}
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
              className="relative z-10"
              step={monetaryPremiumStepSize}
              min={monetaryPremiumMin}
              max={monetaryPremiumMax}
              onChange={setMonetaryPremium}
            >
              {monetaryPremium}
            </Slider>
            {/* Because a slider range is not exactly the visual width of the element positioning using absolute children with a left is not exactly right. we add small amounts to try fudge them into the right place. */}
            <div className="absolute top-2 bottom-0 w-full flex [margin-top:10px] pointer-events-none">
              <MarkerText
                ratio={(2 + 0.3 - monetaryPremiumMin) / monetaryPremiumRange}
              >
                2x
              </MarkerText>
              <MarkerText
                ratio={(4 + 0.2 - monetaryPremiumMin) / monetaryPremiumRange}
              >
                4x
              </MarkerText>
              <MarkerText
                ratio={(8 + 0.1 - monetaryPremiumMin) / monetaryPremiumRange}
              >
                8x
              </MarkerText>
              <MarkerText
                ratio={(16 - 0.3 - monetaryPremiumMin) / monetaryPremiumRange}
              >
                16x
              </MarkerText>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 text-center">
          <WidgetTitle>implied eth price</WidgetTitle>
          <MoneyAmount
            amountPostfix="K"
            skeletonWidth="3rem"
            textSizeClass="text-2xl md:text-3xl"
            unit="usd"
          >
            {projectedPrice === undefined
              ? undefined
              : Format.formatOneDigit(projectedPrice / 1000)}
          </MoneyAmount>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default PriceModel;
