import type { StaticImageData } from "next/legacy/image";
import Image from "next/legacy/image";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../../hooks/use-local-storage";
import useNotification from "../../hooks/use-notification";
import { WidgetTitle } from "../WidgetSubcomponents";
import AlarmInput from "./AlarmInput";
import bellSvg from "./bell-slateus.svg";
import PriceGasWidget from "./PriceGasWidget";

const TopBar: FC = () => {
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
        <PriceGasWidget />
        <button
          ref={alarmButtonRef}
          className={`
            ml-4 flex
            select-none items-center rounded
            bg-slateus-700
            px-3 py-2
            ${notification.type === "Supported" ? "visible" : "invisible"}
            ${isAlarmActive ? "bg-slateus-600" : ""}
          `}
          onClick={handleClickAlarm}
        >
          <Image
            src={bellSvg as StaticImageData}
            alt="bell icon"
            width="14"
            height="14"
            priority
          />
        </button>

        <div
          ref={dialogRef}
          className={`absolute top-12 w-full rounded bg-slateus-700 p-8 md:top-12 ${showAlarmDialogCss}`}
        >
          <WidgetTitle>price alerts</WidgetTitle>
          <AlarmInput
            isAlarmActive={gasAlarmActive}
            onToggleIsAlarmActive={setGasAlarmActive}
            unit="Gwei"
            type="gas"
          />
          <AlarmInput
            isAlarmActive={ethAlarmActive}
            onToggleIsAlarmActive={setEthAlarmActive}
            unit="USD "
            type="eth"
          />
          {notification.type === "Supported" &&
            notification.permission === "denied" && (
              <p className="mt-4 text-sm text-red-400">
                notifications disabled, please grant notification permission.
              </p>
            )}
        </div>
      </div>
      <a
        className="hidden select-none rounded-3xl border-2 border-solid border-white px-4 py-1 font-medium text-white hover:border-slateus-400 hover:text-blue-shipcove md:block"
        href="#fam"
      >
        join the fam
      </a>
    </div>
  );
};

export default TopBar;
