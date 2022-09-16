import type { FC } from "react";
import LabelText from "./TextsNext/LabelText";
import ToggleSwitch from "./ToggleSwitch";

type Props = {
  onToggle: () => void;
  checked: boolean;
};

const SimulatePreMerge: FC<Props> = ({ checked, onToggle }) => (
  <div className="flex items-center gap-x-4">
    <LabelText>simulate pre-merge</LabelText>
    <ToggleSwitch checked={checked} onToggle={onToggle} />
  </div>
);

export default SimulatePreMerge;
