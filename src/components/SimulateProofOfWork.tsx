import type { FC } from "react";
import { TextInter } from "./Texts";
import ToggleSwitch from "./ToggleSwitch";

type Props = {
  onToggle: () => void;
  checked: boolean;
};

const SimulateProofOfWork: FC<Props> = ({ checked, onToggle }) => (
  <div className="flex items-center gap-x-2">
  <TextInter
    className={`
      font-light
      text-slateus-200 text-xs
      tracking-widest
    `}
  >
    SIMULATE PoW
  </TextInter>
    <ToggleSwitch checked={checked} onToggle={onToggle} />
  </div>
);

export default SimulateProofOfWork;
