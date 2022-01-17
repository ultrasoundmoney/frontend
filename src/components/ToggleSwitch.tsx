import { FC } from "react";
import styles from "./ToggleSwitch.module.scss";

type ToggleSwitchProps = {
  checked: boolean;
  className?: string;
  onToggle: (enabled: boolean) => void;
};

const ToggleSwitch: FC<ToggleSwitchProps> = ({
  checked,
  className,
  onToggle,
}) => (
  <input
    checked={checked}
    onChange={(e) => onToggle(e.target.checked)}
    className={`${className ?? ""} ${styles["toggle-switch"]}`}
    type="checkbox"
  />
);

export default ToggleSwitch;
