import flow from "lodash/flow";
import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import { useAverageEthPrice } from "../api/average-eth-price";
import { useBurnRates } from "../api/burn-rates";
import { useEthPriceStats } from "../api/eth-price-stats";
import { useImpreciseEthSupply } from "../api/eth-supply";
import type { PeRatios } from "../api/pe-ratios";
import { usePeRatios } from "../api/pe-ratios";
import { usePosIssuanceYear } from "../eth-units";
import * as Format from "../format";
import { MoneyAmount } from "./Amount";
import Slider2 from "./Slider2";
import { BaseText } from "./Texts";
import BodyText from "./TextsNext/BodyText";
import { WidgetBackground, WidgetTitle } from "./WidgetSubcomponents";

type MarkerProps = {
  alt?: string;
  icon: string;
  peRatio: number;
  ratio: number;
  symbol?: string;
};

// Markers are positioned absolutely, manipulating their 'left' relatively to the full width bar which should be positioned relatively as their parent. Marker width
const Marker: FC<MarkerProps> = ({ alt, icon, peRatio, ratio, symbol }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="pointer-events-none absolute flex w-full flex-col"
      style={{
        transform: `translateX(${ratio * 100}%)`,
      }}
    >
      <div className="mb-3 w-3 -translate-x-1/2 bg-slateus-400 [min-height:3px]"></div>
      <a
        title={`${peRatio?.toFixed(1) ?? "-"} P/E`}
        className="pointer-events-auto absolute top-4 -translate-x-1/2"
        href={
          symbol === undefined
            ? undefined
            : symbol === "DIS"
            ? "https://www.google.com/finance/quote/DIS:NYSE"
            : `https://www.google.com/finance/quote/${symbol}:NASDAQ`
        }
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <>
          <img
            src={`/${icon}-coloroff.svg`}
            alt={alt}
            className={`relative ${isHovering ? "invisible" : "visible"}`}
          />
          <img
            className={`absolute top-0 ${isHovering ? "visible" : "invisible"}`}
            src={`/${icon}-coloron.svg`}
            alt={alt}
          />
        </>
      </a>
    </div>
  );
};

const MarkerText: FC<{ children: ReactNode; ratio: number }> = ({
  ratio,
  children,
}) => (
  <div
    className="pointer-events-none absolute flex w-full flex-col"
    // For unclear reasons the left 89% position for TSLA is closer to notch 91 on the actual slider. We manually adjust.
    style={{ transform: `translateX(${ratio * 100}%)` }}
  >
    <div className="w-3 -translate-x-1/2 bg-slateus-400 [min-height:3px]"></div>
    <BaseText
      font="font-roboto"
      color="text-slateus-200"
      className="absolute top-3 -translate-x-1/2"
    >
      {children}
    </BaseText>
  </div>
);

const CompanyMarkers: FC<{ peRatios: PeRatios & { ETH: number } }> = ({
  peRatios,
}) => {
  const markerList: MarkerProps[] = [
    {
      alt: "ethereum logo",
      icon: "eth",
      peRatio: peRatios.ETH,
      ratio: peRatios.ETH,
      symbol: "ETH",
    },
    {
      alt: "apple logo",
      icon: "apple",
      peRatio: peRatios.AAPL,
      ratio: peRatios.AAPL,
      symbol: "AAPL",
    },
    {
      alt: "amazon logo",
      icon: "amazon",
      peRatio: peRatios.AMZN,
      ratio: peRatios.AMZN,
      symbol: "AMZN",
    },
    {
      alt: "tesla logo",
      icon: "tesla",
      peRatio: peRatios.TSLA,
      ratio: peRatios.TSLA,
      symbol: "TSLA",
    },
    {
      alt: "disney logo",
      icon: "disney",
      peRatio: peRatios.DIS,
      ratio: peRatios.DIS,
      symbol: "DIS",
    },
    {
      alt: "google logo",
      icon: "google",
      peRatio: peRatios.GOOGL,
      ratio: peRatios.GOOGL,
      symbol: "GOOGL",
    },
    {
      alt: "netflix logo",
      icon: "netflix",
      peRatio: peRatios.NFLX,
      ratio: peRatios.NFLX,
      symbol: "NFLX",
    },
    {
      alt: "intel logo",
      icon: "intel",
      peRatio: peRatios.INTC,
      ratio: peRatios.INTC,
      symbol: "INTC",
    },
  ];

  const shownList = markerList.reduce((list: Array<MarkerProps>, marker) => {
    if (marker?.peRatio === null) return list;

    const someConflict = list.some(
      (shownMarker) => Math.abs(shownMarker.peRatio - marker.peRatio) < 4,
    );

    if (someConflict) {
      return list;
    }

    return [...list, marker];
  }, []);

  return (
    <>
      {shownList.map((marker) => {
        return (
          <Marker
            key={marker.symbol}
            icon={marker.icon}
            peRatio={marker.peRatio}
            ratio={linearFromLog(marker.peRatio)}
            symbol={marker.symbol}
          />
        );
      })}
    </>
  );
};

const monetaryPremiumMin = 1;
const monetaryPremiumMax = 20;
const monetaryPremiumRange = monetaryPremiumMax - monetaryPremiumMin;
const monetaryPremiumStepSize = 0.01;

const growthProfileMin = 6;
const growthProfileMax = 250;
const growthProfileLogMin = Math.log(growthProfileMin);
const growthProfileLogMax = Math.log(growthProfileMax);
const logRange = growthProfileLogMax - growthProfileLogMin;

// Converts from a linear scale between 0 and 1 to a log scale between 6 and 250.
const logFromLinear = flow(
  (position: number) => position * logRange,
  (positionInRange) => positionInRange + growthProfileLogMin,
  (shiftedPosition) => Math.exp(shiftedPosition),
);

// Converts from a log scale between 6 and 250 to a linear scale between 0 and 1
const linearFromLog = flow(
  Math.log,
  (linearPosition) => linearPosition - growthProfileLogMin,
  (peInRange) => peInRange / logRange,
  // Clamp
  (ratio) => Math.min(1, ratio),
  (ratio) => Math.max(0, ratio),
);

const calcEarningsPerShare = (
  annualizedEarnings: number | undefined,
  ethSupply: number | undefined,
) => {
  if (annualizedEarnings === undefined || ethSupply === undefined) {
    return undefined;
  }

  return annualizedEarnings / ethSupply;
};

const calcProjectedPrice = (
  annualizedEarnings: number | undefined,
  ethSupply: number | undefined,
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

// This component needs to be rewritten for the PEs to be an ordered list where
// anything that is too close to the last item in the list is skipped. An
// example can be found in the 200Y equilibrium widget.
const PriceModel: FC = () => {
  const peRatios = usePeRatios();
  const burnRates = useBurnRates();
  const burnRateAll = burnRates?.burnRateAllUsd;
  const ethPriceStats = useEthPriceStats();
  const ethPrice = ethPriceStats.usd;
  const ethSupply = useImpreciseEthSupply();
  const [peRatio, setPeRatio] = useState<number>();
  const [peRatioPosition, setPeRatioPosition] = useState<number>(0);
  const [monetaryPremium, setMonetaryPremium] = useState(1);
  const [initialPeSet, setInitialPeSet] = useState(false);
  const averageEthPrice = useAverageEthPrice()?.all;
  const [ethPeRatio, setEthPeRatio] = useState<number>();
  const posIssuanceYear = usePosIssuanceYear();

  const annualizedRevenue =
    burnRateAll === undefined || averageEthPrice === undefined
      ? undefined
      : burnRateAll * 60 * 24 * 365.25;
  const annualizedCosts =
    averageEthPrice === undefined
      ? undefined
      : posIssuanceYear * averageEthPrice;
  const annualizedEarnings =
    annualizedRevenue === undefined || annualizedCosts === undefined
      ? undefined
      : annualizedRevenue - annualizedCosts;

  useEffect(() => {
    if (
      initialPeSet ||
      annualizedEarnings === undefined ||
      ethPrice === undefined
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

    const ethPeRatio = ethPrice / earningsPerShare;

    setEthPeRatio(ethPeRatio);
    setPeRatioPosition(linearFromLog(ethPeRatio));
  }, [
    annualizedEarnings,
    ethPrice,
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
    if (peRatioPosition === undefined) {
      return undefined;
    }

    setPeRatio(logFromLinear(peRatioPosition));
  }, [peRatioPosition]);

  return (
    <WidgetBackground>
      <WidgetTitle>price model</WidgetTitle>
      <div className="mt-4 flex flex-col gap-y-4 overflow-hidden">
        <div className="flex justify-between">
          <BodyText>annualized profits</BodyText>
          <MoneyAmount amountPostfix="B" unitText="USD" skeletonWidth="2rem">
            {annualizedEarnings === undefined
              ? undefined
              : Format.formatOneDecimal(annualizedEarnings / 1e9)}
          </MoneyAmount>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex justify-between">
            <BodyText>growth profile</BodyText>
            <MoneyAmount unitText="P/E" skeletonWidth="3rem">
              {peRatio !== undefined && initialPeSet
                ? Format.formatOneDecimal(peRatio)
                : undefined}
            </MoneyAmount>
          </div>
          <div className="relative mb-12">
            <Slider2
              step={0.001}
              min={0}
              max={1}
              onChange={(event) =>
                setPeRatioPosition(Number(event.target.value))
              }
              thumbVisible={initialPeSet}
              value={peRatioPosition}
            />
            <div className="absolute top-3 w-full select-none">
              {peRatios !== undefined && ethPeRatio !== undefined && (
                // Because the actual slider does not span the entire visual slider, overlaying an element and setting the left is not perfect. We manually adjust values to match the slider more precisely. To improve this look into off-the-shelf components that allow for styled markers.
                <CompanyMarkers peRatios={{ ...peRatios, ETH: ethPeRatio }} />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex justify-between">
            <BodyText>monetary premium</BodyText>
            <BaseText font="font-roboto">{`${Format.formatOneDecimal(
              monetaryPremium,
            )}x`}</BaseText>
          </div>
          <div className="relative mb-10">
            <Slider2
              step={monetaryPremiumStepSize}
              min={monetaryPremiumMin}
              max={monetaryPremiumMax}
              onChange={(event) =>
                setMonetaryPremium(Number(event.target.value))
              }
              value={monetaryPremium}
            />
            {/* Because a slider range is not exactly the visual width of the element positioning using absolute children with a left is not exactly right. we add small amounts to try fudge them into the right place. */}
            <div className="pointer-events-none absolute top-3 flex w-full">
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
              <div
                className="pointer-events-none absolute flex w-full flex-col"
                style={{
                  transform: `translateX(47.5%)`,
                }}
              >
                <div className="mb-3 w-3 -translate-x-1/2 bg-slateus-400 [min-height:3px]"></div>
                <div className="pointer-events-auto absolute top-4 -translate-x-1/2">
                  <img
                    title="gold"
                    src={`/gold-icon.svg`}
                    alt={"icon of a gold bar"}
                    className={`relative`}
                  />
                </div>
              </div>
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
          <span
            title={`profits = revenue (burn) - expenses (issuance)
price = profits * P/E ratio * monetary premium`}
          >
            <MoneyAmount
              amountPostfix="K"
              skeletonWidth="3rem"
              textSizeClass="text-2xl md:text-3xl"
              unitText="USD"
            >
              {projectedPrice === undefined
                ? undefined
                : Format.formatOneDecimal(projectedPrice / 1000)}
            </MoneyAmount>
          </span>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default PriceModel;
