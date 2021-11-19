import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { EthPrice, useBaseFeePerGas, useEthPrice } from "../../api";
import * as Format from "../../format";
import { useLocalStorage } from "../../use-local-storage";
import useNotification from "../../use-notification";
import { weiToGwei } from "../../utils/metric-utils";
import AlarmInput from "../Alarm";
import { AmountUnitSpace } from "../Spacing";
import { WidgetTitle } from "../WidgetBits";

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
      ? Format.formatPercentOneDigitSigned(ethPrice.usd24hChange / 1000)
      : undefined;

  const color =
    typeof ethPrice?.usd24hChange === "number" && ethPrice?.usd24hChange < 0
      ? "text-red-400"
      : "text-green-400";

  return (
    <div className="flex items-center font-roboto text-white rounded bg-blue-tangaroa px-3 py-2 text-xs lg:text-sm">
      <img
        className="pr-1 select-none"
        src="/gas-icon.svg"
        alt="gas pump icon"
      />
      <p>
        {baseFeePerGas === undefined ? (
          "___"
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
      </p>
      <div className="mr-4"></div>
      <img
        className="pr-1 select-none"
        src="/eth-icon.svg"
        alt="Ethereum Ether icon"
      />
      <p>
        {ethPrice === undefined ? (
          "_,___"
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
        <AmountUnitSpace />
        {ethUsd24hChange === undefined ? (
          <span>{"(__._%)"}</span>
        ) : (
          <span className={`${color}`}>({ethUsd24hChange})</span>
        )}
      </p>
    </div>
  );
};

const TopBar: FC = () => {
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
  const [showAlarmDialog, setShowAlarmDialog] = useState(false);
  const notification = useNotification();
  const dialogRef = useRef<HTMLDivElement>(null);

  const isAlarmActive = gasAlarmActive || ethAlarmActive;

  const activeButtonCss =
    "text-white border-blue-highlightborder rounded-sm bg-blue-highlightbg";
  const alarmActiveClasses = isAlarmActive ? activeButtonCss : "";

  const checkIfClickedOutside = useCallback(
    (e: MouseEvent) => {
      if (
        showAlarmDialog &&
        dialogRef.current &&
        !dialogRef.current.contains(e.target as Node | null)
      ) {
        setShowAlarmDialog(false);
      }
    },
    [showAlarmDialog]
  );

  const handleClickAlarm = useCallback(() => {
    if (showAlarmDialog === false) {
      setShowAlarmDialog(true);
    }

    // Any click outside the dialog closes the dialog. There is no need to close in response to the button click event.
  }, [showAlarmDialog]);

  const showAlarmDialogCss = showAlarmDialog ? "visible" : "invisible";

  const isAlarmValuesAvailable =
    typeof baseFeePerGas === "number" && typeof ethPrice?.usd === "number";

  const showButtonClasses =
    notification.type === "Supported" && isAlarmValuesAvailable
      ? "visible"
      : "invisible";

  useEffect(() => {
    document.addEventListener("click", checkIfClickedOutside);

    return () => {
      document.removeEventListener("click", checkIfClickedOutside);
    };
  });

  return (
    <div className="flex justify-between pt-4 md:pt-8">
      <div className="relative flex">
        <PriceGasWidget baseFeePerGas={baseFeePerGas} ethPrice={ethPrice} />

        <button
          className={`flex items-center px-3 py-2 bg-blue-tangaroa rounded ml-4 select-none border border-transparent ${showButtonClasses} ${alarmActiveClasses}`}
          onClick={handleClickAlarm}
        >
          <img src="/alarm-icon.svg" alt="bell icon" />
        </button>

        <div
          ref={dialogRef}
          className={`absolute w-full bg-blue-tangaroa rounded p-8 top-12 md:top-12 ${showAlarmDialogCss}`}
        >
          <WidgetTitle title="price alerts" />
          <AlarmInput
            isAlarmActive={gasAlarmActive}
            onToggleIsAlarmActive={setGasAlarmActive}
            icon="/gas-icon.svg"
            unit="Gwei"
            type="gas"
          />
          <AlarmInput
            isAlarmActive={ethAlarmActive}
            onToggleIsAlarmActive={setEthAlarmActive}
            icon="/eth-icon.svg"
            unit="USD "
            type="eth"
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

export default TopBar;
