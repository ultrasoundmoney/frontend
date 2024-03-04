import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import logoAmazonOwn from "../../assets/logos/amazon-own.svg";
import logoAmazonSlateus from "../../assets/logos/amazon-slateus.svg";
import logoAppleOwn from "../../assets/logos/apple-own.svg";
import logoAppleSlateus from "../../assets/logos/apple-slateus.svg";
import logoDisneyOwn from "../../assets/logos/disney-own.svg";
import logoDisneySlateus from "../../assets/logos/disney-slateus.svg";
import logoEthereumOwn from "../../assets/logos/ethereum-own.svg";
import logoEthereumSlateus from "../../assets/logos/ethereum-slateus.svg";
import logoGoogleOwn from "../../assets/logos/google-own.svg";
import logoGoogleSlateus from "../../assets/logos/google-slateus.svg";
import logoIntelOwn from "../../assets/logos/intel-own.svg";
import logoIntelSlateus from "../../assets/logos/intel-slateus.svg";
import logoNetflixOwn from "../../assets/logos/netflix-own.svg";
import logoNetflixSlateus from "../../assets/logos/netflix-slateus.svg";
import logoTeslaOwn from "../../assets/logos/tesla-own.svg";
import logoTeslaSlateus from "../../assets/logos/tesla-slateus.svg";
import { BaseText } from "../../components/Texts";
import BodyTextV3 from "../../components/TextsNext/BodyTextV3";
import QuantifyText from "../../components/TextsNext/QuantifyText";
import SkeletonText from "../../components/TextsNext/SkeletonText";
import * as Format from "../../format";
import { flow } from "../../fp";
import { useEthPriceStats } from "../api/eth-price-stats";
import { useGaugeRates } from "../api/gauge-rates";
import type { PeRatios } from "../api/pe-ratios";
import { usePeRatios } from "../api/pe-ratios";
import { useImpreciseEthSupply } from "../api/supply-parts";
import {
  WidgetBackground,
  WidgetTitle,
} from "./../../components/WidgetSubcomponents";
import { MoneyAmount } from "./Amount";
import { useNerdTooltip } from "./NerdTooltip";
import PriceModelTooltip from "./PriceModelTooltip";
import Slider2 from "./Slider2";

type MaybeMarker = {
  alt?: string;
  icon: {
    coloroff: StaticImageData;
    coloron: StaticImageData;
  };
  peRatio: number | null;
  symbol?: string;
};

type MarkerProps = {
  alt?: string;
  icon: {
    coloroff: StaticImageData;
    coloron: StaticImageData;
  };
  peRatio: number;
  symbol?: string;
};

// Markers are positioned absolutely, manipulating their 'left' relatively to the full width bar which should be positioned relatively as their parent. Marker width
const Marker: FC<MarkerProps> = ({ alt, icon, peRatio, symbol }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="flex absolute flex-col w-full pointer-events-none"
      style={{
        transform: `translateX(${linearFromLog(peRatio) * 100}%)`,
      }}
    >
      <div className="mb-3 w-3 -translate-x-1/2 bg-slateus-400 [min-height:3px]"></div>
      <a
        title={`${peRatio?.toFixed(1) ?? "-"} P/E`}
        className="absolute top-4 -translate-x-1/2 pointer-events-auto"
        href={
          symbol === undefined
            ? undefined
            : symbol === "DIS"
            ? "https://www.google.com/finance/quote/DIS:NYSE"
            : symbol === "ETH"
            ? `https://www.google.com/finance/quote/ETH-USD`
            : `https://www.google.com/finance/quote/${symbol}:NASDAQ`
        }
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <>
          <Image
            src={icon.coloroff}
            alt={alt ?? "missing company PE icon"}
            className={`relative ${isHovering ? "invisible" : "visible"}`}
          />
          <Image
            className={`absolute top-0 ${isHovering ? "visible" : "invisible"}`}
            src={icon.coloron}
            alt={alt ?? "missing company PE icon"}
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
    className="flex absolute flex-col w-full pointer-events-none"
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

const getIsValidMarker = (marker: unknown): marker is MarkerProps =>
  typeof (marker as { peRatio: number | null }).peRatio === "number";

const CompanyMarkers: FC<{ peRatios: PeRatios & { ETH: number } }> = ({
  peRatios,
}) => {
  const markers: MaybeMarker[] = [
    {
      alt: "ethereum logo",
      icon: {
        coloroff: logoEthereumSlateus as StaticImageData,
        coloron: logoEthereumOwn as StaticImageData,
      },
      peRatio: peRatios.ETH,
      symbol: "ETH",
    },
    {
      alt: "apple logo",
      icon: {
        coloroff: logoAppleSlateus as StaticImageData,
        coloron: logoAppleOwn as StaticImageData,
      },
      peRatio: peRatios.AAPL,
      symbol: "AAPL",
    },
    {
      alt: "amazon logo",
      icon: {
        coloroff: logoAmazonSlateus as StaticImageData,
        coloron: logoAmazonOwn as StaticImageData,
      },
      peRatio: peRatios.AMZN,
      symbol: "AMZN",
    },
    {
      alt: "tesla logo",
      icon: {
        coloroff: logoTeslaSlateus as StaticImageData,
        coloron: logoTeslaOwn as StaticImageData,
      },
      peRatio: peRatios.TSLA,
      symbol: "TSLA",
    },
    {
      alt: "disney logo",
      icon: {
        coloroff: logoDisneySlateus as StaticImageData,
        coloron: logoDisneyOwn as StaticImageData,
      },
      peRatio: peRatios.DIS,
      symbol: "DIS",
    },
    {
      alt: "google logo",
      icon: {
        coloroff: logoGoogleSlateus as StaticImageData,
        coloron: logoGoogleOwn as StaticImageData,
      },
      peRatio: peRatios.GOOGL,
      symbol: "GOOGL",
    },
    {
      alt: "netflix logo",
      icon: {
        coloroff: logoNetflixSlateus as StaticImageData,
        coloron: logoNetflixOwn as StaticImageData,
      },
      peRatio: peRatios.NFLX,
      symbol: "NFLX",
    },
    {
      alt: "intel logo",
      icon: {
        coloroff: logoIntelSlateus as StaticImageData,
        coloron: logoIntelOwn as StaticImageData,
      },
      peRatio: peRatios.INTC,
      symbol: "INTC",
    },
  ];

  const shownList = markers
    .filter(getIsValidMarker)
    .reduce((list: MarkerProps[], marker) => {
      const someConflict = list.some(
        (shownMarker) => Math.abs(shownMarker.peRatio - marker.peRatio) < 6.7,
      );

      if (someConflict) {
        return list;
      }

      return [...list, marker];
    }, []);

  return (
    <>
      {shownList.map((marker) => (
        <Marker
          key={marker.symbol}
          icon={marker.icon}
          peRatio={marker.peRatio}
          symbol={marker.symbol}
        />
      ))}
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
  const ethPriceStats = useEthPriceStats();
  const ethPrice = ethPriceStats.usd;
  const ethSupply = useImpreciseEthSupply();
  const [peRatioPosition, setPeRatioPosition] = useState<number>();
  const [monetaryPremium, setMonetaryPremium] = useState(1);
  const gaugeRates = useGaugeRates();
  const initialPeRatioSet = useRef<boolean>(false);

  const annualizedRevenue = gaugeRates.since_burn.burn_rate_yearly.usd;
  const annualizedCosts = gaugeRates.d7.issuance_rate_yearly.usd;
  const annualizedEarnings =
    annualizedRevenue === undefined || annualizedCosts === undefined
      ? undefined
      : annualizedRevenue - annualizedCosts;

  const earningsPerShare = calcEarningsPerShare(annualizedEarnings, ethSupply);

  const ethPeRatio =
    earningsPerShare === undefined ? undefined : ethPrice / earningsPerShare;

  const peRatio =
    peRatioPosition === undefined ? undefined : logFromLinear(peRatioPosition);

  const projectedPrice = calcProjectedPrice(
    annualizedEarnings,
    ethSupply,
    monetaryPremium,
    peRatio,
  );

  // We only run this once, the first time, peRatio becomes available.
  useEffect(() => {
    if (initialPeRatioSet.current || ethPeRatio === undefined) {
      return;
    }

    initialPeRatioSet.current = true;

    setPeRatioPosition(linearFromLog(ethPeRatio));
  }, [ethPeRatio]);

  const { Nerd, TooltipWrapper, BackgroundOverlay, setShowTooltip } =
    useNerdTooltip();

  return (
    <WidgetBackground>
      <div className="flex items-center">
        <WidgetTitle>price model</WidgetTitle>
        <Nerd />
      </div>
      <TooltipWrapper>
        <PriceModelTooltip onClickClose={() => setShowTooltip(false)} />
      </TooltipWrapper>
      <div className="flex overflow-hidden flex-col gap-y-4 mt-4">
        <div className="flex justify-between">
          <BodyTextV3 size="text-base md:text-lg">
            annualized profits
          </BodyTextV3>
          <QuantifyText
            amountPostfix="B"
            size="text-base md:text-lg"
            unitPostfix="USD"
            unitPostfixColor="text-slateus-200"
          >
            <SkeletonText width="2rem">
              {annualizedEarnings === undefined
                ? undefined
                : Format.formatOneDecimal(annualizedEarnings / 1e9)}
            </SkeletonText>
          </QuantifyText>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex justify-between">
            <BodyTextV3 size="text-base md:text-lg">growth profile</BodyTextV3>
            <MoneyAmount unitText="P/E" skeletonWidth="3rem">
              {peRatio !== undefined
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
              thumbVisible={initialPeRatioSet.current}
              value={peRatioPosition ?? 0}
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
            <BodyTextV3 size="text-base md:text-lg">
              monetary premium
            </BodyTextV3>
            <QuantifyText size="text-base md:text-lg">{`${Format.formatOneDecimal(
              monetaryPremium,
            )}x`}</QuantifyText>
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
            <div className="flex absolute top-3 w-full pointer-events-none">
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
                className="flex absolute flex-col w-full pointer-events-none"
                style={{
                  transform: `translateX(47.5%)`,
                }}
              >
                <div className="mb-3 w-3 -translate-x-1/2 bg-slateus-400 [min-height:3px]"></div>
                <div className="absolute top-4 -translate-x-1/2 pointer-events-auto">
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
          <span>
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
      <BackgroundOverlay />
    </WidgetBackground>
  );
};

export default PriceModel;
