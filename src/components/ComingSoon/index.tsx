import * as React from "react";
import { FC } from "react";
import { useState, useContext } from "react";
import TwitterCommunity from "../TwitterCommunity";
import FollowingYou from "../FollowingYou";
import SupplyView from "../SupplyView";
import { TranslationsContext } from "../../translations-context";
import BurnLeaderboard from "../BurnLeaderboard";
import CumulativeFeeBurn from "../CumulativeFeeBurn";
import LatestBlocks from "../LatestBlocks";
import FaqBlock from "../Landing/faq";
import Link from "next/link";
import EthLogo from "../../assets/ethereum-logo-2014-5.svg";
import { weiToGwei } from "../../utils/metric-utils";
import SpanMoji from "../SpanMoji";
import IssuanceGauge from "../Gauges/IssuanceGauge";
import SupplyGrowthGauge from "../Gauges/SupplyGrowthGauge";
import BurnGauge from "../Gauges/BurnGauge";
import { useCallback } from "react";
import { EthPrice, useBaseFeePerGas, useEthPrices } from "../../api";
import { formatPercentOneDigitSigned, formatZeroDigit } from "../../format";
import CountUp from "react-countup";
import FeePeriodControl from "../FeePeriodControl";

let startGasPrice = 0;
let startGasPriceCached = 0;
let startEthPrice = 0;
let startEthPriceCached = 0;

type PriceGasWidgetProps = {
  baseFeePerGas: number;
  ethPrices: EthPrice;
};

const PriceGasWidget: FC<PriceGasWidgetProps> = ({
  baseFeePerGas,
  ethPrices,
}) => {
  if (baseFeePerGas && baseFeePerGas !== startGasPrice) {
    startGasPriceCached = startGasPrice;
    startGasPrice = baseFeePerGas;
  }

  if (ethPrices?.usd && ethPrices?.usd !== startEthPrice) {
    startEthPriceCached = startEthPrice;
    startEthPrice = ethPrices?.usd;
  }

  const ethUsd24hChange =
    ethPrices?.usd24hChange &&
    formatPercentOneDigitSigned(ethPrices?.usd24hChange / 100);
  const color =
    typeof ethPrices?.usd24hChange === "number" && ethPrices?.usd24hChange < 0
      ? "text-red-400"
      : "text-green-400";

  return (
    <div className="flex text-white self-center rounded bg-blue-tangaroa px-3 py-2 text-xs lg:text-sm font-roboto md:ml-4">
      $
      <CountUp
        decimals={0}
        duration={0.8}
        separator=","
        start={startEthPriceCached === 0 ? ethPrices?.usd : startEthPriceCached}
        end={ethPrices?.usd}
      />
      <span className={`px-1 ${color}`}>({ethUsd24hChange})</span>
      <span className="px-1">•</span>
      <SpanMoji className="px-0.5" emoji="⛽️"></SpanMoji>
      <span className="">
        <CountUp
          decimals={0}
          duration={0.8}
          separator=","
          start={
            startGasPriceCached === 0
              ? weiToGwei(baseFeePerGas)
              : weiToGwei(startGasPriceCached)
          }
          end={weiToGwei(baseFeePerGas)}
        />{" "}
        <span className="font-extralight text-blue-spindle">Gwei</span>
      </span>
    </div>
  );
};

type UnitControlProps = {
  selectedUnit: "eth" | "usd";
  onSetUnit: (unit: "usd" | "eth") => void;
};

const UnitControl: FC<UnitControlProps> = ({ selectedUnit, onSetUnit }) => {
  const activePeriodClasses =
    "text-white border-blue-highlightborder rounded-sm bg-blue-highlightbg";

  return (
    <div className="flex flex-row items-center">
      <button
        className={`font-inter text-sm px-3 py-1 border border-transparent uppercase ${
          selectedUnit === "eth" ? activePeriodClasses : "text-blue-manatee"
        }`}
        onClick={() => onSetUnit("eth")}
      >
        eth
      </button>
      <button
        className={`font-inter text-sm px-3 py-1 border border-transparent uppercase ${
          selectedUnit === "usd" ? activePeriodClasses : "text-blue-manatee"
        }`}
        onClick={() => onSetUnit("usd")}
      >
        usd
      </button>
    </div>
  );
};

export type Unit = "eth" | "usd";

const ComingSoon: FC = () => {
  const t = useContext(TranslationsContext);
  const [simulateMerge, setSimulateMerge] = useState(false);
  const ethPrices = useEthPrices();
  const baseFeePerGas = useBaseFeePerGas();
  const [timeframe, setFeePeriod] = useState<string>("all");
  const [unit, setUnit] = useState<Unit>("eth");

  const onSetFeePeriod = useCallback(setFeePeriod, [setFeePeriod]);

  const onSetUnit = useCallback(setUnit, [setUnit]);

  const LONDON_TIMESTAMP = Date.parse("Aug 5 2021 12:33:42 UTC");
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceLondonFork = formatZeroDigit(
    Math.floor((Date.now() - LONDON_TIMESTAMP) / msPerDay)
  );

  const toggleSimulateMerge = useCallback(() => {
    setSimulateMerge(!simulateMerge);
  }, [simulateMerge]);

  if (typeof window !== "undefined" && baseFeePerGas !== undefined) {
    document.title =
      weiToGwei(baseFeePerGas).toFixed(0) + " Gwei | ultrasound.money";
  }

  return (
    <div className="wrapper bg-blue-midnightexpress blurred-bg-image">
      <div className="container m-auto">
        <div className="flex justify-between">
          <div className="w-full flex justify-between md:justify-start p-4">
            <Link href="/">
              <img className="relative" src={EthLogo} alt={t.title} />
            </Link>
            {ethPrices !== undefined && baseFeePerGas !== undefined && (
              <PriceGasWidget
                baseFeePerGas={baseFeePerGas}
                ethPrices={ethPrices}
              />
            )}
          </div>
          <a
            className="hidden md:block flex self-center whitespace-nowrap px-4 py-1 mr-4 font-medium text-white hover:text-blue-shipcove border-white border-solid border-2 rounded-3xl hover:border-blue-shipcove"
            href="#join-the-fam"
          >
            join the fam
          </a>
        </div>
        <div
          className={`ultra-sound-text w-full pt-16 text-6xl md:text-7xl md:w-1/2 lg:w-5/6 lg:pt-16 m-auto mb-8`}
        >
          ultra sound awakening
        </div>
        <p className="font-inter text-blue-spindle text-xl md:text-2xl lg:text-3xl text-white text-center mb-16">
          track ETH become ultra sound
        </p>
        <video
          className="w-full md:w-3/6 lg:w-2/6 mx-auto -mt-32 -mb-4 pr-6 mix-blend-lighten"
          playsInline
          autoPlay
          muted
          loop
          poster="/bat-no-wings.png"
        >
          <source src="/bat-no-wings.webm" type="video/webm; codecs='vp9'" />
          <source src="/bat-no-wings.mp4" type="video/mp4" />
        </video>
        {/* <video */}
        {/*   className="absolute left-0 -ml-24 top-8 md:top-128 lg:top-96 opacity-40 mix-blend-lighten" */}
        {/*   playsInline */}
        {/*   autoPlay */}
        {/*   muted */}
        {/*   loop */}
        {/*   poster="/moving-orbs.jpg" */}
        {/* > */}
        {/*   <source src="/moving-orbs.mp4" type="video/mp4" /> */}
        {/*   <source src="/moving-orbs.webm" type="video/webm; codecs='vp9'" /> */}
        {/* </video> */}
        <div className="w-full flex flex-col md:flex-row md:gap-0 lg:gap-4 px-4 md:px-16 isolate">
          <div className="hidden md:block w-1/3">
            <BurnGauge />
          </div>
          <div className="md:w-1/3">
            <SupplyGrowthGauge
              simulateMerge={simulateMerge}
              toggleSimulateMerge={toggleSimulateMerge}
            />
          </div>
          <div className="hidden md:block w-1/3">
            <IssuanceGauge simulateMerge={simulateMerge} />
          </div>
        </div>
        <div className="w-4 h-4" />
        <div className="px-4 md:px-16">
          <div className="bg-blue-tangaroa flex flex-col md:flex-row justify-between p-4">
            <div>
              <p className="text-lg font-inter text-blue-spindle flex flex-row items-center">
                timeframe
                {timeframe === "all" ? (
                  <span className="text-blue-manatee font-normal text-sm fadein-animation pl-2">
                    ({daysSinceLondonFork}d)
                  </span>
                ) : null}
              </p>
              <FeePeriodControl
                timeframes={["5m", "1h", "24h", "7d", "30d", "all"]}
                selectedTimeframe={timeframe}
                onSetFeePeriod={onSetFeePeriod}
              />
            </div>
            <div>
              <p className="text-lg font-inter text-blue-spindle flex flex-row items-center">
                currency
              </p>
              <UnitControl selectedUnit={unit} onSetUnit={onSetUnit} />
            </div>
          </div>
        </div>
        <div className="w-4 h-4" />
        <div className="flex flex-col px-4 lg:w-full lg:flex-row md:px-16 isolate">
          <div className="lg:w-1/2 lg:pr-2">
            <CumulativeFeeBurn unit={unit} />
            <span className="block h-4" />
            <LatestBlocks />
          </div>
          <span className="block h-4" />
          <div className="lg:w-1/2 lg:pl-2">
            <BurnLeaderboard unit={unit} />
          </div>
        </div>
        <div className="flex flex-col px-4 md:px-16 pt-40 mb-16">
          <h1 className="text-white font-light text-center text-2xl md:text-3xl xl:text-41xl mb-8">
            {t.teaser_supply_title}
          </h1>
          <p className="text-blue-shipcove text-center font-light text-base lg:text-lg mb-8">
            {t.teaser_supply_subtitle}
          </p>
          <div className="w-full md:m-auto relative bg-blue-tangaroa px-2 md:px-4 xl:px-12 py-4 md:py-8 xl:py-12 rounded-xl">
            <SupplyView />
          </div>
          <div
            id="join-the-fam"
            className="relative flex px-4 md:px-0 pt-8 pt-40 mb-16"
          >
            <div className="w-full relative flex flex-col items-center">
              {/* <video */}
              {/*   className="absolute w-1/2 right-0 -mt-16 opacity-40 mix-blend-lighten" */}
              {/*   playsInline */}
              {/*   autoPlay */}
              {/*   muted */}
              {/*   loop */}
              {/*   poster="/bat-no-wings.png" */}
              {/* > */}
              {/*   <source */}
              {/*     src="/moving-orbs.webm" */}
              {/*     type="video/webm; codecs='vp9'" */}
              {/*   /> */}
              {/*   <source src="/moving-orbs.mp4" type="video/mp4" /> */}
              {/* </video> */}
              <TwitterCommunity />
            </div>
          </div>
          <div className="flex px-4 md:px-0 pt-20 pb-20">
            <div className="w-full lg:w-2/3 md:m-auto relative">
              <FollowingYou />
            </div>
          </div>
          <div className="flex px-4 md:px-0 pt-8 pb-60">
            <div className="w-full lg:w-2/3 md:m-auto relative">
              <FaqBlock />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
