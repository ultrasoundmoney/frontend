import * as React from "react";
import { FC } from "react";
import { useState, useContext } from "react";
import TwitterCommunity from "../TwitterCommunity";
import FollowingYou from "../FollowingYou";
import SupplyView from "../SupplyView";
import { TranslationsContext } from "../../translations-context";
import BurnLeaderboard from "../BurnLeaderboard";
import FeeBurn from "../FeeBurn";
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
import { EthPrice, useBaseFeePerGas, useEthPrice } from "../../api";
import { formatPercentOneDigitSigned } from "../../format";
import CountUp from "react-countup";
import TimeFrameControl, { TimeFrame, timeFrames } from "../TimeFrameControl";
import { WidgetBackground } from "../WidgetBits";
import { AmountUnitSpace } from "../Spacing";

let startGasPrice = 0;
let startGasPriceCached = 0;
let startEthPrice = 0;
let startEthPriceCached = 0;

type PriceGasWidgetProps = {
  baseFeePerGas: number;
  ethPrice: EthPrice;
};

const PriceGasWidget: FC<PriceGasWidgetProps> = ({
  baseFeePerGas,
  ethPrice: ethPrice,
}) => {
  if (baseFeePerGas && baseFeePerGas !== startGasPrice) {
    startGasPriceCached = startGasPrice;
    startGasPrice = baseFeePerGas;
  }

  if (ethPrice?.usd && ethPrice?.usd !== startEthPrice) {
    startEthPriceCached = startEthPrice;
    startEthPrice = ethPrice?.usd;
  }

  const ethUsd24hChange =
    ethPrice?.usd24hChange &&
    formatPercentOneDigitSigned(ethPrice?.usd24hChange / 1000);
  const color =
    typeof ethPrice?.usd24hChange === "number" && ethPrice?.usd24hChange < 0
      ? "text-red-400"
      : "text-green-400";

  return (
    <div className="flex text-white self-center rounded bg-blue-tangaroa px-3 py-2 text-xs lg:text-sm font-roboto md:ml-4">
      $
      <CountUp
        decimals={0}
        duration={0.8}
        separator=","
        start={startEthPriceCached === 0 ? ethPrice?.usd : startEthPriceCached}
        end={ethPrice?.usd}
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

const activePeriodClasses =
  "text-white border-blue-highlightborder rounded-sm bg-blue-highlightbg";

type CurrencyButtonProps = {
  onClick: (unit: Unit) => void;
  selectedUnit: Unit;
  unit: Unit;
};

const CurrencyButton: FC<CurrencyButtonProps> = ({
  onClick,
  selectedUnit,
  unit,
}) => (
  <button
    className={`font-roboto font-extralight text-sm md:text-base px-3 py-1 border border-transparent uppercase ${
      selectedUnit === unit ? activePeriodClasses : "text-blue-spindle"
    }`}
    onClick={() => onClick(unit)}
  >
    {unit}
  </button>
);

type UnitControlProps = {
  selectedUnit: "eth" | "usd";
  onSetUnit: (unit: "usd" | "eth") => void;
};

const CurrencyControl: FC<UnitControlProps> = ({ selectedUnit, onSetUnit }) => (
  <div className="flex flex-row items-center">
    <CurrencyButton
      onClick={onSetUnit}
      selectedUnit={selectedUnit}
      unit="eth"
    />
    <CurrencyButton
      onClick={onSetUnit}
      selectedUnit={selectedUnit}
      unit="usd"
    />
  </div>
);

export type Unit = "eth" | "usd";

const ComingSoon: FC = () => {
  const t = useContext(TranslationsContext);
  const [simulateMerge, setSimulateMerge] = useState(false);
  const ethPrice = useEthPrice();
  const baseFeePerGas = useBaseFeePerGas();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("24h");
  const [unit, setUnit] = useState<Unit>("eth");

  const onSetTimeFrame = useCallback(setTimeFrame, [setTimeFrame]);

  const onSetUnit = useCallback(setUnit, [setUnit]);

  const toggleSimulateMerge = useCallback(() => {
    setSimulateMerge(!simulateMerge);
  }, [simulateMerge]);

  if (typeof window !== "undefined" && baseFeePerGas !== undefined) {
    document.title =
      weiToGwei(baseFeePerGas).toFixed(0) + " Gwei | ultrasound.money";
  }

  const handleClickTimeFrame = useCallback(() => {
    const currentTimeFrameIndex = timeFrames.indexOf(timeFrame);
    const nextIndex =
      currentTimeFrameIndex === timeFrames.length - 1
        ? 0
        : currentTimeFrameIndex + 1;

    setTimeFrame(timeFrames[nextIndex]);
  }, [timeFrame]);

  return (
    <div className="wrapper bg-blue-midnightexpress blurred-bg-image">
      <div className="container m-auto">
        <div className="flex justify-between">
          <div className="w-full flex justify-between md:justify-start p-4">
            <Link href="/">
              <img className="relative" src={EthLogo} alt={t.title} />
            </Link>
            {ethPrice !== undefined && baseFeePerGas !== undefined && (
              <PriceGasWidget
                baseFeePerGas={baseFeePerGas}
                ethPrice={ethPrice}
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
            <BurnGauge timeFrame={timeFrame} unit={unit} />
          </div>
          <div className="md:w-1/3">
            <SupplyGrowthGauge
              onClickTimeFrame={handleClickTimeFrame}
              simulateMerge={simulateMerge}
              timeFrame={timeFrame}
              toggleSimulateMerge={toggleSimulateMerge}
            />
          </div>
          <div className="hidden md:block w-1/3">
            <IssuanceGauge
              simulateMerge={simulateMerge}
              timeFrame={timeFrame}
              unit={unit}
            />
          </div>
        </div>
        <div className="w-4 h-4" />
        <div className="px-4 md:px-16">
          <WidgetBackground>
            <div className="flex flex-col gap-y-8 md:flex-row lg:gap-y-0 justify-between">
              <div className="flex flex-col gap-y-4 lg:gap-x-4 lg:flex-row lg:items-center">
                <p className="font-inter font-light text-blue-spindle text-md uppercase">
                  time frame
                </p>
                <TimeFrameControl
                  selectedTimeframe={timeFrame}
                  onSetFeePeriod={onSetTimeFrame}
                />
              </div>
              <div className="flex flex-col gap-y-4 lg:gap-x-4 lg:flex-row lg:items-center">
                <p className="font-inter font-light text-blue-spindle text-md uppercase md:text-right lg:text-left">
                  currency
                </p>
                <CurrencyControl selectedUnit={unit} onSetUnit={onSetUnit} />
              </div>
            </div>
          </WidgetBackground>
        </div>
        <div className="w-4 h-4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 px-4 md:px-16 md:gap-x-4 lg:w-full lg:flex-row">
          <div>
            <FeeBurn
              onClickTimeFrame={handleClickTimeFrame}
              timeFrame={timeFrame}
              unit={unit}
            />
            <div className="h-4"></div>
            <LatestBlocks unit={unit} />
          </div>
          <BurnLeaderboard
            onClickTimeFrame={handleClickTimeFrame}
            timeFrame={timeFrame}
            unit={unit}
          />
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
