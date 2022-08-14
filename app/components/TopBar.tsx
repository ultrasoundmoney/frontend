import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GroupedAnalysis1 } from "../api/grouped-analysis-1";
import { useLocalStorage } from "../use-local-storage";
import useNotification from "../use-notification";
import AlarmInput from "./AlarmInput";
import PriceGasWidget from "./PriceGasWidget";
import { WidgetTitle } from "./WidgetSubcomponents";

const TopBar: FC<{ groupedAnalysis1: GroupedAnalysis1 }> = ({
  groupedAnalysis1,
}) => {
  const baseFeePerGas = groupedAnalysis1.baseFeePerGas;
  const ethPrice = groupedAnalysis1.ethPrice;
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

  const isAlarmValuesAvailable =
    typeof baseFeePerGas === "number" && typeof ethPrice?.usd === "number";

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
          ref={alarmButtonRef}
          className={`
            flex items-center
            px-3 py-2 ml-4
            bg-blue-tangaroa rounded
            select-none
            border border-transparent
            ${
              notification.type === "Supported" && isAlarmValuesAvailable
                ? "visible"
                : "invisible"
            }
            ${
              isAlarmActive
                ? "text-white border-blue-highlightborder rounded-sm bg-blue-highlightbg"
                : ""
            }
          `}
          onClick={handleClickAlarm}
        >
          <img src="/alarm-icon.svg" alt="bell icon" width="12" height="14" />
        </button>

        <div
          ref={dialogRef}
          className={`absolute w-full bg-blue-tangaroa rounded p-8 top-12 md:top-12 ${showAlarmDialogCss}`}
        >
          <WidgetTitle>price alerts</WidgetTitle>
          <AlarmInput
            groupedAnalysis1={groupedAnalysis1}
            isAlarmActive={gasAlarmActive}
            onToggleIsAlarmActive={setGasAlarmActive}
            type="gas"
            unit="Gwei"
          />
          <AlarmInput
            groupedAnalysis1={groupedAnalysis1}
            isAlarmActive={ethAlarmActive}
            onToggleIsAlarmActive={setEthAlarmActive}
            type="eth"
            unit="USD "
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
        href="#join-the-fam"
      >
        join the fam
      </a>
    </div>
  );
};

export default TopBar;
