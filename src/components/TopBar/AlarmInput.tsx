import replace from "lodash/replace";
import type { StaticImageData } from "next/legacy/image";
import Image from "next/legacy/image";
import type { ChangeEvent, FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBaseFeePerGas } from "../../api/base-fee-per-gas";
import { useEthPriceStats } from "../../api/eth-price-stats";
import { WEI_PER_GWEI } from "../../eth-units";
import { formatZeroDecimals } from "../../format";
import { useLocalStorage } from "../../hooks/use-local-storage";
import useNotification from "../../hooks/use-notification";
import { AmountUnitSpace } from "../Spacing";
import { BaseText } from "../Texts";
import ToggleSwitch from "../ToggleSwitch";
import styles from "./AlarmInput.module.scss";
import ethSvg from "./eth-slateus.svg";
import gasSvg from "./gas-slateus.svg";

const thresholdToNumber = (
  threshold: string | undefined,
): number | undefined => {
  if (threshold === undefined) {
    return undefined;
  }

  const num = Number(replace(threshold, ",", ""));
  return Number.isNaN(num) ? undefined : num;
};

const safeFormatZeroDigit = (num: number | undefined) =>
  num === undefined ? undefined : formatZeroDecimals(num);

const toThresholdDisplay = (str: string | undefined): string | undefined =>
  safeFormatZeroDigit(thresholdToNumber(str));

type CrossThresholdFn = (current: number, threshold: number) => boolean;

const compareMap: Record<ThresholdType, CrossThresholdFn> = {
  GreaterThanOrEqualTo: (current: number, limit: number) => current >= limit,
  SmallerThan: (current: number, limit: number) => current < limit,
};

const typeToDisplay = (type: AlarmType) => (type === "eth" ? "ETH" : type);

type AlarmType = "gas" | "eth";

type ThresholdType = "GreaterThanOrEqualTo" | "SmallerThan";

const imageMap: Record<AlarmType, JSX.Element> = {
  gas: (
    <Image
      src={gasSvg as StaticImageData}
      width="14"
      height="14"
      alt="gas pump icon"
    />
  ),

  eth: (
    <Image
      src={ethSvg as StaticImageData}
      alt="Ethereum Ether icon"
      width="16"
      height="16"
    />
  ),
};

type AlarmInputProps = {
  isAlarmActive: boolean;
  onToggleIsAlarmActive: (isAlarmActive: boolean) => void;
  unit: string;
  type: AlarmType;
};

const AlarmInput: FC<AlarmInputProps> = ({
  isAlarmActive,
  onToggleIsAlarmActive,
  type,
  unit,
}) => {
  const baseFeePerGas = useBaseFeePerGas();
  const ethPriceStats = useEthPriceStats();
  const notification = useNotification();
  const [isBusyEditing, setIsBusyEditing] = useState(false);
  const [threshold, setThreshold] = useLocalStorage<string>(
    `${type}-threshold`,
    "0",
  );
  const [thresholdType, setThresholdType] = useLocalStorage<ThresholdType>(
    `${type}-threshold-type`,
    "GreaterThanOrEqualTo",
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const roundedGasPriceGwei =
    baseFeePerGas === undefined
      ? undefined
      : Math.round(baseFeePerGas.wei / WEI_PER_GWEI);

  const roundedEthPrice =
    ethPriceStats === undefined ? undefined : Math.round(ethPriceStats.usd);

  const currentValueMap: Record<AlarmType, number | undefined> = {
    gas: roundedGasPriceGwei,
    eth: roundedEthPrice,
  };

  const currentValue = currentValueMap[type];

  const thresholdNum = thresholdToNumber(threshold);

  const handleSetThreshold = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      // Should never happen, the parent should disable the dialog altogether in this case.
      if (currentValue === undefined) {
        return;
      }

      const inputThresholdNum = thresholdToNumber(event.target.value);

      if (inputThresholdNum === undefined) {
        return undefined;
      }

      if (event.target.value.length > 6) {
        return undefined;
      }

      if (inputThresholdNum >= currentValue) {
        setThresholdType("GreaterThanOrEqualTo");
      } else {
        setThresholdType("SmallerThan");
      }

      setIsBusyEditing(true);
      setThreshold(event.target.value);
    },
    [currentValue, setThreshold, setThresholdType],
  );

  const handleDoneEditing = useCallback(() => {
    setIsBusyEditing(false);
  }, [setIsBusyEditing]);

  const handleToggleIsAlarmActive = useCallback(
    (nextIsAlarmActive: boolean) => {
      // Should never happen, the parent should disable the dialog altogether in this case.
      if (currentValue === undefined) {
        return undefined;
      }

      if (
        notification.type !== "Supported" ||
        notification.permission === "denied"
      ) {
        return undefined;
      }

      if (notification.permission === "default") {
        notification.requestPermission().catch((err) => {
          throw err;
        });
        return;
      }

      const inputThresholdNum = thresholdToNumber(threshold);
      if (inputThresholdNum === undefined) {
        return undefined;
      }

      if (inputThresholdNum >= currentValue) {
        setThresholdType("GreaterThanOrEqualTo");
      } else {
        setThresholdType("SmallerThan");
      }

      onToggleIsAlarmActive(nextIsAlarmActive);
    },
    [
      currentValue,
      notification,
      onToggleIsAlarmActive,
      setThresholdType,
      threshold,
    ],
  );

  useEffect(() => {
    // It's possible someone changed this in another tab and we haven't yet read this from local storage. To make sure we have the latest value we read local storage again. This key is currently hardcoded to match the one in the parent that ows this piece of state.
    const isAlarmActiveLocalStorage = localStorage.getItem(
      `${type}-alarm-enabled`,
    );
    const isAlarmActiveSynced =
      isAlarmActiveLocalStorage === null
        ? false
        : (JSON.parse(isAlarmActiveLocalStorage) as boolean);
    onToggleIsAlarmActive(isAlarmActiveSynced);

    if (
      notification.type === "Supported" &&
      notification.permission === "granted" &&
      isAlarmActiveSynced &&
      typeof currentValue === "number" &&
      typeof thresholdNum === "number" &&
      !isBusyEditing
    ) {
      const crossedThresholdFn = compareMap[thresholdType];
      const isThresholdCrossed = crossedThresholdFn(currentValue, thresholdNum);

      if (!isThresholdCrossed) {
        return undefined;
      }

      const typeFormatted = typeToDisplay(type);
      const currentValueFormatted = formatZeroDecimals(currentValue);
      const message = `${typeFormatted} price hit ${currentValueFormatted} ${unit.trimEnd()}`;
      notification.showNotification(message);

      onToggleIsAlarmActive(false);
    }
  }, [
    currentValue,
    isAlarmActive,
    isBusyEditing,
    notification,
    onToggleIsAlarmActive,
    roundedGasPriceGwei,
    thresholdNum,
    thresholdType,
    type,
    unit,
  ]);

  const handleSurroundingInputClick = useCallback(() => {
    if (inputRef.current === null) {
      return undefined;
    }

    inputRef.current.focus();
  }, [inputRef]);

  return (
    <div className="flex items-center justify-between pt-4">
      <div
        className={`flex select-none items-center justify-between rounded-full border border-gray-500 px-2 py-1 pr-4 ${styles.alarmInput}`}
        onClick={handleSurroundingInputClick}
      >
        <div className="ml-1 flex w-5 justify-center">{imageMap[type]}</div>
        <div className="flex items-center">
          <input
            ref={inputRef}
            className={`
              w-14 bg-transparent
              text-right
              font-roboto
              text-sm font-light text-white
              focus:outline-none
            `}
            inputMode="numeric"
            pattern="[0-9]"
            value={toThresholdDisplay(threshold)}
            onChange={handleSetThreshold}
            onBlur={handleDoneEditing}
          />
          <AmountUnitSpace />
          <BaseText
            font="font-roboto"
            weight="font-extralight"
            color="text-slateus-200"
            className="whitespace-pre text-sm"
          >
            {unit}
          </BaseText>
        </div>
      </div>
      <ToggleSwitch
        checked={isAlarmActive}
        onToggle={handleToggleIsAlarmActive}
      />
    </div>
  );
};

export default AlarmInput;
