import React, { FC, useEffect } from "react";
import { useState, useContext } from "react";
import TwitterCommunity from "../TwitterCommunity";
import FollowingYou from "../FollowingYou";
import SupplyView from "../SupplyView";
import { TranslationsContext } from "../../translations-context";
import BurnLeaderboard from "../BurnLeaderboard";
import FeeBurn from "../FeeBurn";
import LatestBlocks from "../LatestBlocks";
import FaqBlock from "../Landing/faq";
import { weiToGwei } from "../../utils/metric-utils";
import IssuanceGauge from "../Gauges/IssuanceGauge";
import SupplyGrowthGauge from "../Gauges/SupplyGrowthGauge";
import BurnGauge from "../Gauges/BurnGauge";
import { useCallback } from "react";
import { EthPrice, useBaseFeePerGas, useEthPrice } from "../../api";
import { formatPercentOneDigitSigned, formatZeroDigit } from "../../format";
import CountUp from "react-countup";
import TimeFrameControl, { TimeFrame, timeFrames } from "../TimeFrameControl";
import { WidgetBackground, WidgetTitle } from "../WidgetBits";
import { AmountUnitSpace } from "../Spacing";
import ToggleSwitch from "../ToggleSwitch";
import { useLocalStorage } from "../../use-local-storage";
import { pipe } from "fp-ts/lib/function";
import { debounce } from "lodash";

let startGasPrice = 0;
let startGasPriceCached = 0;
let startEthPrice = 0;
let startEthPriceCached = 0;

type PriceGasWidgetProps = {
  baseFeePerGas: number | undefined;
  ethPrice: EthPrice | undefined;
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
    ethPrice?.usd24hChange !== undefined
      ? formatPercentOneDigitSigned(ethPrice.usd24hChange / 1000)
      : formatPercentOneDigitSigned(0);

  const color =
    typeof ethPrice?.usd24hChange === "number" && ethPrice?.usd24hChange < 0
      ? "text-red-400"
      : "text-green-400";

  return (
    <div className="flex items-center font-roboto text-white rounded bg-blue-tangaroa px-3 py-2 text-xs lg:text-sm">
      <img className="pr-1" src="/gas-icon.svg" alt="gas pump icon" />
      {baseFeePerGas === undefined ? (
        "---"
      ) : (
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
        />
      )}
      <AmountUnitSpace />
      <span className="font-extralight text-blue-spindle">Gwei</span>
      <div className="mr-4"></div>
      <img className="pr-1" src="/eth-icon.svg" alt="Ethereum Ether icon" />
      {ethPrice === undefined ? (
        "-,---"
      ) : (
        <CountUp
          decimals={0}
          duration={0.8}
          separator=","
          start={
            startEthPriceCached === 0 ? ethPrice?.usd : startEthPriceCached
          }
          end={ethPrice?.usd}
        />
      )}
      <AmountUnitSpace />
      <span className="text-blue-spindle font-extralight">USD</span>
      <span className={`pl-1 ${color}`}>({ethUsd24hChange})</span>
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

type UseNotification =
  | {
      type: "Unsupported";
    }
  | {
      type: "Supported";
      notificationPermission: "default" | "granted" | "denied";
      requestPermission: () => void;
      showNotification: (text: string) => void;
    };

const useNotification = (): UseNotification => {
  const [notificationPermission, setNotificationPermission] = useState(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "denied"
  );

  const isNotificationSupported =
    typeof window !== "undefined" && "Notification" in window;

  if (!isNotificationSupported) {
    return {
      type: "Unsupported",
    };
  }

  const requestPermission = () => {
    Notification.requestPermission().then((permission) => {
      setNotificationPermission(permission);
    });
  };

  const showNotification = (text: string) => {
    if (notificationPermission === "granted") {
      new Notification(text, {});
    }
  };

  return {
    type: "Supported",
    notificationPermission,
    requestPermission,
    showNotification,
  };
};

const thresholdToNumber = (threshold: string) =>
  pipe(threshold, (str) => str.replaceAll(",", ""), Number);

type AlarmInputProps = {
  alarmThreshold: string;
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  onSetAlarmThreshold: (threshold: string) => void;
  icon: string;
  unit: string;
};

const AlarmInput: FC<AlarmInputProps> = ({
  alarmThreshold,
  enabled,
  icon,
  onSetAlarmThreshold,
  onToggleEnabled,
  unit,
}) => {
  return (
    <div className="flex justify-between items-center pt-4">
      <div
        className={`flex justify-between items-center px-2 py-1 pr-4 border border-gray-500 rounded-full ${styles.alarmInput}`}
      >
        <img className="pl-2" src={icon} alt="icon of gaspump or eth" />
        <div className="">
          <input
            className="font-roboto w-14 bg-transparent text-sm text-white text-right"
            inputMode="numeric"
            pattern="^[\d]+$"
            value={formatZeroDigit(thresholdToNumber(alarmThreshold))}
            onChange={(event) => onSetAlarmThreshold(event.target.value)}
          />
          <AmountUnitSpace />
          <span className="font-roboto text-blue-spindle font-extralight whitespace-pre">
            {unit}
          </span>
        </div>
      </div>
      <ToggleSwitch checked={enabled} onToggle={onToggleEnabled} />
    </div>
  );
};

const TopBar: FC<{}> = () => {
  const baseFeePerGas = useBaseFeePerGas();
  const ethPrice = useEthPrice();
  const [gasAlarmActive, setGasAlarmActive] = useLocalStorage(
    "gas-alarm-enabled",
    false
  );
  const [ethAlarmActive, setEthAlarmActive] = useLocalStorage(
    "eth-alarm-enabled",
    false
  );
  const [gasThreshold, setGasThreshold] = useLocalStorage(
    "gas-threshold",
    "1000"
  );
  const [ethThreshold, setEthThreshold] = useLocalStorage(
    "eth-threshold",
    "10000"
  );
  const [showAlarmDialog, setShowAlarmDialog] = useState(false);
  const notification = useNotification();

  const isAlarmActive = gasAlarmActive || ethAlarmActive;

  const activeButtonCss =
    "text-white border-blue-highlightborder rounded-sm bg-blue-highlightbg";
  const alarmActiveClasses = isAlarmActive ? activeButtonCss : "";

  const handleClickAlarm = useCallback(() => {
    setShowAlarmDialog(!showAlarmDialog);
  }, [showAlarmDialog]);

  const showAlarmDialogCss = showAlarmDialog ? "visible" : "invisible";

  const handleSetGasThreshold = useCallback(
    (threshold: string) => {
      // We try to parse this on display, if someone manages to set NaN, their input gets stuck.
      if (Number.isNaN(Number(threshold.replaceAll(",", "")))) {
        setGasThreshold("0");
        return;
      }

      setGasThreshold(threshold);
    },
    [setGasThreshold]
  );

  const handleSetEthThreshold = useCallback(
    (threshold: string) => {
      // We try to parse this on display, if someone manages to set NaN, their input gets stuck.
      if (Number.isNaN(Number(threshold.replaceAll(",", "")))) {
        setEthThreshold("0");
      }

      setEthThreshold(threshold);
    },
    [setEthThreshold]
  );

  const handleSetGasAlarm = useCallback(
    (enabled: boolean) => {
      if (notification.type !== "Supported") {
        return;
      }

      if (notification.notificationPermission === "denied") {
        return;
      }

      if (notification.notificationPermission === "default") {
        notification.requestPermission();
        return;
      }

      if (notification.notificationPermission === "granted") {
        setGasAlarmActive(enabled);
      }
    },
    [notification, setGasAlarmActive]
  );

  useEffect(() => {
    if (
      typeof baseFeePerGas === "number" &&
      notification.type === "Supported" &&
      notification.notificationPermission === "granted" &&
      gasAlarmActive &&
      weiToGwei(baseFeePerGas) >= thresholdToNumber(gasThreshold)
    ) {
      const timerId = setTimeout(() => {
        notification.showNotification(
          `gas price hit ${weiToGwei(baseFeePerGas)} Gwei!`
        );
        setGasAlarmActive(false);
      }, 1000);

      return () => clearTimeout(timerId);
    }
  }, [
    baseFeePerGas,
    gasAlarmActive,
    gasThreshold,
    notification,
    setGasAlarmActive,
  ]);

  useEffect(() => {
    if (
      ethPrice !== undefined &&
      notification.type === "Supported" &&
      notification.notificationPermission === "granted" &&
      ethAlarmActive &&
      ethPrice.usd >= thresholdToNumber(ethThreshold)
    ) {
      const timerId = setTimeout(() => {
        notification.showNotification(`ETH price hit ${ethPrice.usd} USD!`);
        setEthAlarmActive(false);
      }, 1000);

      return () => clearTimeout(timerId);
    }
  }, [ethPrice, ethAlarmActive, ethThreshold, notification, setEthAlarmActive]);

  return (
    <div className="flex justify-between pt-4 md:pt-8">
      <div className="relative flex">
        <PriceGasWidget baseFeePerGas={baseFeePerGas} ethPrice={ethPrice} />
        {notification.type === "Supported" ? (
          <button
            className={`flex items-center px-3 py-2 bg-blue-tangaroa rounded ml-4 border border-transparent ${alarmActiveClasses}`}
            onClick={handleClickAlarm}
          >
            <img src="/alarm-icon.svg" alt="bell icon" />
          </button>
        ) : null}
        <div
          className={`absolute w-full bg-blue-tangaroa rounded p-8 top-12 md:top-12 ${showAlarmDialogCss}`}
        >
          <WidgetTitle title="price alerts" />
          <AlarmInput
            enabled={gasAlarmActive}
            onToggleEnabled={handleSetGasAlarm}
            icon="/gas-icon.svg"
            alarmThreshold={gasThreshold}
            onSetAlarmThreshold={handleSetGasThreshold}
            unit="Gwei"
          />
          <AlarmInput
            enabled={ethAlarmActive}
            onToggleEnabled={setEthAlarmActive}
            icon="/eth-icon.svg"
            alarmThreshold={ethThreshold}
            onSetAlarmThreshold={handleSetEthThreshold}
            unit="USD "
          />
          {notification.type === "Supported" &&
            notification.notificationPermission === "denied" && (
              <p className="text-sm text-red-400 mt-4">
                notifications disabled, please grant notification permission.
              </p>
            )}
        </div>
      </div>
      <a
        className="hidden md:block flex px-4 py-1 font-medium text-white hover:text-blue-shipcove border-white border-solid border-2 rounded-3xl hover:border-blue-shipcove"
        href="#join-the-fam"
      >
        join the fam
      </a>
    </div>
  );
};

export type Unit = "eth" | "usd";

const Widgets: FC = () => {
  const [simulateMerge, setSimulateMerge] = useState(false);
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
    <>
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
            simulateMerge={simulateMerge}
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
    </>
  );
};

const ComingSoon: FC = () => {
  const t = useContext(TranslationsContext);

  return (
    <div className="wrapper bg-blue-midnightexpress blurred-bg-image">
      <div className="container m-auto">
        <div className="px-4 md:px-16">
          <TopBar />
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
        <Widgets />
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
