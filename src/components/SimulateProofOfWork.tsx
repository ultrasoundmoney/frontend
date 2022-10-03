import type { FC } from "react";
import { BaseText } from "./Texts";
import ToggleSwitch from "./ToggleSwitch";

type Props = {
  onToggle: () => void;
  checked: boolean;
};

const SimulateProofOfWork: FC<Props> = ({ checked, onToggle }) => (
  <div className="flex items-center gap-x-2">
    <BaseText
      font="font-inter"
      color="text-slateus-200"
      className="text-xs tracking-widest"
    >
      SIMULATE PoW
    </BaseText>
    <ToggleSwitch checked={checked} onToggle={onToggle} />
  </div>
);

export default SimulateProofOfWork;
