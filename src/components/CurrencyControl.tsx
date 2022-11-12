import type { FC } from "react";
import type { Unit } from "../denomination";

const activePeriodClasses =
  "text-white border-slateus-400 rounded-sm bg-slateus-600";

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
    className={`
      select-none border
      px-3 py-2
      font-roboto text-xs
      font-normal uppercase
      tracking-widest
      ${
        selectedUnit === unit
          ? activePeriodClasses
          : "border-transparent text-slateus-200"
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

export default CurrencyControl;
