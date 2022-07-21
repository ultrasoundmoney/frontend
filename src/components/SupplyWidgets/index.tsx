import { useCallback, useState } from "react";
import { useGroupedAnalysis1 } from "../../api/grouped-analysis-1";
import { Unit } from "../../denomination";
import * as Format from "../../format";
import { TimeFrameNext, timeFramesNext } from "../../time-frames";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import { MoneyAmount } from "../Amount";
import CurrencyControl from "../CurrencyControl";
import BurnGauge from "../Gauges/BurnGauge";
import IssuanceGauge from "../Gauges/IssuanceGauge";
import SupplyGrowthGauge from "../Gauges/SupplyGrowthGauge";
import Slider from "../Slider/Slider";
import SupplyView from "../SupplyView";
import { TextInter, TextRoboto } from "../Texts";
import TimeFrameControl from "../TimeFrameControl";
import ToggleSwitch from "../ToggleSwitch";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";
import EquilibriumGraph from "./EquilibriumSvg";
import EthSupplyWidget from "./EthSupplyWidget";
import PeakSupplyWidget from "./PeakSupplyWidget";

const SupplyWidgets = () => {
  const [simulateMerge, setSimulateMerge] = useState(false);
  const baseFeePerGas = useGroupedAnalysis1()?.baseFeePerGas;
  const [timeFrame, setTimeFrame] = useState<TimeFrameNext>("d1");
  const [unit, setUnit] = useState<Unit>("eth");
  const [stakingAmount, setStakingAmount] = useState(30);
  const [liquidSupplyBurn, setLiquidSupplyBurn] = useState(0.029);
  const { md, lg } = useActiveBreakpoint();

  const handleSetTimeFrame = useCallback(setTimeFrame, [setTimeFrame]);

  const onSetUnit = useCallback(setUnit, [setUnit]);

  const toggleSimulateMerge = useCallback(() => {
    setSimulateMerge(!simulateMerge);
  }, [simulateMerge]);

  if (typeof window !== "undefined" && baseFeePerGas !== undefined) {
    document.title =
      Format.gweiFromWei(baseFeePerGas).toFixed(0) + " Gwei | ultrasound.money";
  }

  const handleClickTimeFrame = useCallback(() => {
    const currentTimeFrameIndex = timeFramesNext.indexOf(timeFrame);
    const nextIndex =
      currentTimeFrameIndex === timeFramesNext.length - 1
        ? 0
        : currentTimeFrameIndex + 1;

    setTimeFrame(timeFramesNext[nextIndex]);
  }, [timeFrame]);

  return (
    <div className="flex flex-col gap-4 px-4 md:px-16">
      <div>
        <div className="w-full flex flex-col md:flex-row isolate">
          <div className="hidden md:block w-1/3">
            <BurnGauge timeFrame={timeFrame} unit={unit} />
          </div>
          <div className="md:w-1/3 scale-80">
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
        <div className="">
          <div className={`bg-blue-tangaroa rounded-bl-lg rounded-br-lg p-8`}>
            <div className="grid grid-cols-2 md:flex md:justify-between flex-col gap-y-8 md:flex-row lg:gap-y-0 ">
              <div className="row-start-1 flex flex-col gap-4 lg:gap-x-4 lg:flex-row lg:items-center">
                <WidgetTitle>time frame</WidgetTitle>
                <TimeFrameControl
                  selectedTimeframe={timeFrame}
                  onSetTimeFrame={handleSetTimeFrame}
                />
              </div>
              <div className="row-start-2 md:row-start-1 flex flex-col gap-y-4 lg:gap-x-4 lg:flex-row lg:items-center">
                <WidgetTitle>currency</WidgetTitle>
                <CurrencyControl selectedUnit={unit} onSetUnit={onSetUnit} />
              </div>
              <div className="row-start-2 md:row-start-1 flex flex-col gap-4 lg:flex-row lg:items-center text-right">
                <WidgetTitle>simulate merge</WidgetTitle>
                {/* On tablet the vertical alignment looks off without aligning the toggle with the neighboring controls */}
                <div className="flex items-center h-[34px] self-end">
                  <ToggleSwitch
                    checked={simulateMerge}
                    onToggle={toggleSimulateMerge}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full">
          <EthSupplyWidget></EthSupplyWidget>
        </div>
        <div className="w-full">
          <PeakSupplyWidget></PeakSupplyWidget>
        </div>
      </div>
      <div className="w-full md:m-auto relative bg-blue-tangaroa px-2 md:px-4 xl:px-12 py-4 md:py-8 xl:py-12 rounded-xl">
        <SupplyView />
      </div>
      <WidgetBackground
        className={`relative flex flex-col md:flex-row-reverse gap-x-4 gap-y-8 overflow-hidden`}
      >
        <div
          className={`
            absolute top-0 right-0
            w-3/5 h-full
            opacity-[0.25]
            blur-[100px]
          `}
        >
          <div
            className={`
            absolute md:bottom-[3.0rem] md:-right-[1.0rem]
            w-4/5 h-3/5 rounded-[35%]
            bg-[#0037FA]
          `}
          ></div>
        </div>
        {/* Higher z-level to bypass the background blur of our sibling. */}
        <div className="md:w-1/2 flex justify-center items-center z-10">
          <EquilibriumGraph
            points={[[stakingAmount, liquidSupplyBurn]]}
            width={lg ? 370 : md ? 250 : 279}
            height={lg ? 220 : 160}
          />
        </div>
        <div className="md:w-1/2 flex flex-col gap-y-8 z-10">
          <div>
            <div className="flex justify-between">
              <WidgetTitle>supply equilibrium</WidgetTitle>
              <WidgetTitle className="text-right">
                cashflows equilibrium
              </WidgetTitle>
            </div>
            <div className="flex justify-between">
              <MoneyAmount
                amountPostfix="M"
                textSizeClass="text-xl lg:text-3xl"
              >
                70.5
              </MoneyAmount>
              <MoneyAmount
                amountPostfix="M"
                unitText="ETH/year"
                textSizeClass="text-xl lg:text-3xl"
              >
                1.0
              </MoneyAmount>
            </div>
          </div>
          <div>
            <div className="flex justify-between -mb-1">
              <WidgetTitle>staking apr</WidgetTitle>
              <TextRoboto>
                {Format.formatPercentOneDigit(stakingAmount / 100)}/year
              </TextRoboto>
            </div>
            <Slider
              min={1}
              max={100}
              value={stakingAmount}
              step={0.1}
              onChange={(e) => setStakingAmount(Number(e.target.value))}
              onPointerDown={console.log}
              onPointerUp={console.log}
            />
            <div className="flex justify-between -mt-2">
              <TextInter>staking amount</TextInter>
              <MoneyAmount amountPostfix="M" unitText="ETH">
                {Format.formatOneDigit(stakingAmount)}
              </MoneyAmount>
            </div>
          </div>
          <div>
            <div className="flex justify-between -mb-1">
              <WidgetTitle>liquid supply burn</WidgetTitle>
              <TextRoboto>
                {Format.formatPercentOneDigit(liquidSupplyBurn)}/year
              </TextRoboto>
            </div>
            <Slider
              min={0}
              max={0.05}
              value={liquidSupplyBurn}
              step={0.001}
              onChange={(e) => setLiquidSupplyBurn(Number(e.target.value))}
              onPointerDown={console.log}
              onPointerUp={console.log}
            />
            <div className="flex justify-between -mt-2">
              <TextInter className="truncate">
                liquid supply equilibrium
              </TextInter>
              <MoneyAmount amountPostfix="M" unitText="ETH">
                {Format.formatOneDigit(liquidSupplyBurn * 900)}
              </MoneyAmount>
            </div>
          </div>
        </div>
      </WidgetBackground>
    </div>
  );
};

export default SupplyWidgets;
