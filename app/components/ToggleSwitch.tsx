import type { FC } from "react";

type Props = {
  checked: boolean;
  className?: string;
  onToggle: (enabled: boolean) => void;
};

const ToggleSwitch: FC<Props> = ({ checked, className, onToggle }) => (
  <input
    checked={checked}
    onChange={(e) => onToggle(e.target.checked)}
    className={`${className ?? ""} "toggle-switch"`}
    type="checkbox"
  />
);

export default ToggleSwitch;
