import type { FC } from "react";
import { BaseText } from "./../../components/Texts";
import HoverTooltip from "./HoverTooltip";
import ToggleSwitch from "../../components/ToggleSwitch";

type Props = {
  onToggle: () => void;
  checked: boolean;
  tooltipPosition?: "top" | "bottom";
  tooltipText?: string;
};

const SimulateProofOfWork: FC<Props> = ({
  checked,
  onToggle,
  tooltipPosition = "bottom",
  tooltipText,
}) => (
  <HoverTooltip position={tooltipPosition} text={tooltipText}>
    <div className="flex gap-x-2 items-center">
      <BaseText
        font="font-inter"
        color="text-slateus-200"
        className="text-xs tracking-widest"
      >
        SIMULATE PoW
      </BaseText>
      <ToggleSwitch checked={checked} onToggle={onToggle} />
    </div>
  </HoverTooltip>
);

export default SimulateProofOfWork;
