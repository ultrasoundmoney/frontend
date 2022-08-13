import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useGroupedAnalysis1 } from "../api/grouped-analysis-1";
import * as Format from "../format";
import { O, pipe, S } from "../fp";
import { useLocalStorage } from "../use-local-storage";
import useNotification from "../use-notification";
import styles from "./AlarmInput.module.scss";
import { AmountUnitSpace } from "./Spacing";
import { TextRoboto } from "./Texts";
import ToggleSwitch from "./ToggleSwitch";

const thresholdToNumber = (threshold: string | undefined): number | undefined =>
  pipe(
    threshold,
    O.fromNullable,
    O.map(S.replace(",", "")),
    O.map(Number),
    O.chain((num) => (Number.isNaN(num) ? O.none : O.some(num))),
    O.toUndefined,
  );

const safeFormatZeroDigit = (num: number | undefined) =>
  pipe(num, O.fromNullable, O.map(Format.formatZeroDecimals), O.toUndefined);

const toThresholdDisplay = (str: string | undefined): string | undefined =>
  pipe(str, thresholdToNumber, safeFormatZeroDigit);

const safeRound = (num: number | undefined) =>
  pipe(num, O.fromNullable, O.map(Math.round), O.toUndefined);

type CrossThresholdFn = (current: number, threshold: number) => boolean;

const compareMap: Record<ThresholdType, CrossThresholdFn> = {
  GreaterThanOrEqualTo: (current: number, limit: number) => current >= limit,
  SmallerThan: (current: number, limit: number) => current < limit,
};

const typeToDisplay = (type: AlarmType) => (type === "eth" ? "ETH" : type);

type AlarmType = "gas" | "eth";

type ThresholdType = "GreaterThanOrEqualTo" | "SmallerThan";

const imageMap: Record<AlarmType, JSX.Element> = {
  gas: <img src="/gas-icon.svg" width="13" height="14" alt="gas pump icon" />,

  eth: (
    <img src="/eth-icon.svg" alt="Ethereum Ether icon" width="15" height="16" />
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
  unit,
  type,
}) => {
  const notification = useNotification();
  const baseFeePerGas = useGroupedAnalysis1()?.baseFeePerGas;
  const ethPrice = useGroupedAnalysis1()?.ethPrice;
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

  const roundedGasPriceGwei = pipe(
    baseFeePerGas,
    O.fromNullable,
    O.map(Format.gweiFromWei),
    O.map(Math.round),
    O.toUndefined,
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
      const currentValueFormatted = Format.formatZeroDecimals(currentValue);
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
    <div className="flex justify-between items-center pt-4">
      <div
        className={`flex justify-between items-center px-2 py-1 pr-4 border border-gray-500 rounded-full select-none ${styles.alarmInput}`}
        onClick={handleSurroundingInputClick}
      >
        <div className="flex justify-center ml-1 w-5">{imageMap[type]}</div>
        <div className="flex items-center">
          <input
            ref={inputRef}
            className={`
              font-roboto font-light
              w-14
              bg-transparent
              text-sm text-white text-right
              focus:outline-none
            `}
            inputMode="numeric"
            pattern="[0-9]"
            value={toThresholdDisplay(threshold)}
            onChange={handleSetThreshold}
            onBlur={handleDoneEditing}
          />
          <AmountUnitSpace />
          <TextRoboto className="text-blue-spindle text-sm font-extralight whitespace-pre">
            {unit}
          </TextRoboto>
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
