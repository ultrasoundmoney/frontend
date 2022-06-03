import { FC } from "react";
import styles from "./ToggleSwitch.module.scss";

type ToggleSwitchProps = {
  checked: boolean;
  className?: string;
  onToggle: () => void;
};

const ToggleSwitch: FC<ToggleSwitchProps> = ({
  checked,
  className,
  onToggle,
}) => (
  <input
    checked={checked}
    onChange={onToggle}
    className={`${className !== undefined ? className : ""} ${
      styles["toggle-switch"]
    }`}
    type="checkbox"
  />
);

export default ToggleSwitch;
