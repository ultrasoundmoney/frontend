import { FC } from "react";

export type Unit = "eth" | "usd";

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
    className={`font-roboto font-extralight text-sm md:text-base px-3 py-1 border border-transparent uppercase select-none ${
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

export default CurrencyControl;
