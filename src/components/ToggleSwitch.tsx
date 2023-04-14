import type { FC } from "react";
import styles from "./ToggleSwitch.module.scss";

type Props = {
  checked: boolean;
  className?: string;
  disabled?: boolean;
  onToggle: (enabled: boolean) => void;
};

const ToggleSwitch: FC<Props> = ({
  checked,
  className,
  disabled = false,
  onToggle,
}) => (
  <input
    checked={checked}
    disabled={disabled}
    onChange={(e) => onToggle(e.target.checked)}
    className={`${className ?? ""} ${styles["toggle-switch"]}`}
    type="checkbox"
  />
);

export default ToggleSwitch;
