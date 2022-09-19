import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { BaseFeePerGas } from "../../api/base-fee-per-gas";
import type { EthPriceStats } from "../../api/eth-price-stats";
import { useLocalStorage } from "../../hooks/use-local-storage";
import useNotification from "../../hooks/use-notification";
import { WidgetTitle } from "../WidgetSubcomponents";
import AlarmInput from "./AlarmInput";
import bellSvg from "./bell-slateus.svg";
import PriceGasWidget from "./PriceGasWidget";

type Props = {
  baseFeePerGas: BaseFeePerGas;
  ethPriceStats: EthPriceStats;
  initialBaseFeePerGas: number;
  initialEthPrice: number;
};

const TopBar: FC<Props> = ({
  baseFeePerGas,
  ethPriceStats,
  initialBaseFeePerGas,
  initialEthPrice,
}) => {
  const [gasAlarmActive, setGasAlarmActive] = useLocalStorage(
    "gas-alarm-enabled",
    false,
  );
  const [ethAlarmActive, setEthAlarmActive] = useLocalStorage(
    "eth-alarm-enabled",
    false,
  );
  const [showAlarmDialog, setShowAlarmDialog] = useState(false);
  const notification = useNotification();
  const dialogRef = useRef<HTMLDivElement>(null);
  const alarmButtonRef = useRef<HTMLButtonElement>(null);

  const isAlarmActive = gasAlarmActive || ethAlarmActive;

  const checkIfClickedOutside = useCallback(
    (e: MouseEvent) => {
      if (
        !showAlarmDialog ||
        e.target === null ||
        (dialogRef.current !== null &&
          dialogRef.current.contains(e.target as Node)) ||
        (alarmButtonRef.current !== null &&
          alarmButtonRef.current.contains(e.target as Node))
      ) {
        return;
      }

      setShowAlarmDialog(false);
    },
    [showAlarmDialog],
  );

  const handleClickAlarm = useCallback(() => {
    setShowAlarmDialog(!showAlarmDialog);
  }, [showAlarmDialog]);

  const showAlarmDialogCss = showAlarmDialog ? "visible" : "invisible";

  useEffect(() => {
    document.addEventListener("click", checkIfClickedOutside);

    return () => {
      document.removeEventListener("click", checkIfClickedOutside);
    };
  });

  return (
    <div className="flex justify-between pt-4 md:pt-8">
      <div className="relative flex">
        <PriceGasWidget
          initialEthPrice={initialEthPrice}
          initialBaseFeePerGas={initialBaseFeePerGas}
        />
        <button
          ref={alarmButtonRef}
          className={`
            flex items-center
            px-3 py-2 ml-4
            bg-blue-tangaroa rounded
            select-none
            border border-transparent
            ${notification.type === "Supported" ? "visible" : "invisible"}
            ${
              isAlarmActive
                ? "text-white border-blue-highlightborder rounded-sm bg-blue-highlightbg"
                : ""
            }
          `}
          onClick={handleClickAlarm}
        >
          <Image
            src={bellSvg as StaticImageData}
            alt="bell icon"
            width="14"
            height="14"
          />
        </button>

        <div
          ref={dialogRef}
          className={`absolute w-full bg-blue-tangaroa rounded p-8 top-12 md:top-12 ${showAlarmDialogCss}`}
        >
          <WidgetTitle>price alerts</WidgetTitle>
          <AlarmInput
            baseFeePerGas={baseFeePerGas}
            ethPriceStats={ethPriceStats}
            isAlarmActive={gasAlarmActive}
            onToggleIsAlarmActive={setGasAlarmActive}
            unit="Gwei"
            type="gas"
          />
          <AlarmInput
            baseFeePerGas={baseFeePerGas}
            ethPriceStats={ethPriceStats}
            isAlarmActive={ethAlarmActive}
            onToggleIsAlarmActive={setEthAlarmActive}
            unit="USD "
            type="eth"
          />
          {notification.type === "Supported" &&
            notification.permission === "denied" && (
              <p className="text-sm text-red-400 mt-4">
                notifications disabled, please grant notification permission.
              </p>
            )}
        </div>
      </div>
      <a
        className="hidden md:block px-4 py-1 font-medium text-white hover:text-blue-shipcove border-white border-solid border-2 rounded-3xl hover:border-blue-shipcove select-none"
        href="#fam"
      >
        join the fam
      </a>
    </div>
  );
};

export default TopBar;
