import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useBaseFeePerGas, useEthPrice } from "../api";
import { formatZeroDigit } from "../format";
import { O, pipe } from "../fp";
import { useLocalStorage } from "../use-local-storage";
import useNotification from "../use-notification";
import { weiToGwei } from "../utils/metric-utils";
import styles from "./AlarmInput.module.scss";
import { AmountUnitSpace } from "./Spacing";
import ToggleSwitch from "./ToggleSwitch";

const thresholdToNumber = (threshold: string | undefined): number | undefined =>
  pipe(
    threshold,
    O.fromNullable,
    O.map((str) => str.replaceAll(",", "")),
    O.map(Number),
    O.chain((num) => (Number.isNaN(num) ? O.none : O.some(num))),
    O.toUndefined
  );

const safeFormatZeroDigit = (num: number | undefined) =>
  pipe(num, O.fromNullable, O.map(formatZeroDigit), O.toUndefined);

const toThresholdDisplay = (str: string | undefined): string | undefined =>
  pipe(str, thresholdToNumber, safeFormatZeroDigit);

const safeRound = (num: number | undefined) =>
  pipe(num, O.fromNullable, O.map(Math.round), O.toUndefined);

type CrossThresholdFn = (current: number, threshold: number) => boolean;

const compareMap: Record<ThresholdType, CrossThresholdFn> = {
  GreaterThanOrEqualTo: (current: number, limit: number) => current >= limit,
  SmallerThan: (current: number, limit: number) => current < limit,
};

type AlarmType = "gas" | "eth";

type ThresholdType = "GreaterThanOrEqualTo" | "SmallerThan";

type AlarmInputProps = {
  isAlarmActive: boolean;
  icon: string;
  onToggleIsAlarmActive: (isAlarmActive: boolean) => void;
  unit: string;
  type: AlarmType;
};

const AlarmInput: FC<AlarmInputProps> = ({
  isAlarmActive,
  icon,
  onToggleIsAlarmActive,
  unit,
  type,
}) => {
  const notification = useNotification();
  const baseFeePerGas = useBaseFeePerGas();
  const ethPrice = useEthPrice();
  const [isBusyEditing, setIsBusyEditing] = useState(false);
  const [threshold, setThreshold] = useLocalStorage<string>(
    `${type}-threshold`,
    "0"
  );
  const [thresholdType, setThresholdType] = useLocalStorage<ThresholdType>(
    `${type}-threshold-type`,
    "GreaterThanOrEqualTo"
  );

  const roundedGasPriceGwei = pipe(
    baseFeePerGas,
    O.fromNullable,
    O.map(weiToGwei),
    O.map(Math.round),
    O.toUndefined
  );
  const roundedEthPrice = safeRound(ethPrice?.usd);
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
    [currentValue, setThreshold, setThresholdType]
  );

  const handleDoneEditing = useCallback(() => {
    setIsBusyEditing(false);
  }, [setIsBusyEditing]);

  const handleToggleIsAlarmActive = useCallback(
    (nextIsAlarmActive: boolean) => {
      // Should never happen, the parent should disable the dialog altogether in this case.
      if (currentValue === undefined) {
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
    [currentValue, onToggleIsAlarmActive, setThresholdType, threshold]
  );

  useEffect(() => {
    // It's possible someone changed this in another tab and we haven't yet read this from local storage. To make sure we have the latest value we read local storage again. This key is currently hardcoded to match the one in the parent that ows this piece of state.
    const isAlarmActiveLocalStorage = localStorage.getItem(
      `${type}-alarm-enabled`
    );
    const isAlarmActiveSynced =
      isAlarmActiveLocalStorage === null
        ? false
        : JSON.parse(isAlarmActiveLocalStorage);
    onToggleIsAlarmActive(isAlarmActiveSynced);

    if (
      notification.type === "Supported" &&
      notification.notificationPermission === "granted" &&
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

      notification.showNotification(
        `${type} price hit ${roundedGasPriceGwei} ${unit.trimEnd()}!`
      );

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
            pattern="[0-9]"
            value={toThresholdDisplay(threshold)}
            onChange={handleSetThreshold}
            onBlur={handleDoneEditing}
          />
          <AmountUnitSpace />
          <span className="font-roboto text-blue-spindle font-extralight whitespace-pre">
            {unit}
          </span>
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
