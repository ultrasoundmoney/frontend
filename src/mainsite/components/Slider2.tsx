import type { ChangeEvent, FC } from "react";
import styles from "./Slider2.module.scss";

type SliderProps = {
  max: number;
  min: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  step: number;
  thumbVisible?: boolean;
  value: number;
};

const Slider: FC<SliderProps> = ({
  max,
  min,
  onChange,
  step,
  thumbVisible = true,
  value,
}) => (
  <input
    className={`
      absolute
      z-10
      my-1 h-2 w-full
      cursor-pointer
      appearance-none
      rounded-full
      bg-slateus-600
      ${thumbVisible ? "" : styles.thumbInvisible}
      ${styles.customSlider}
    `}
    type="range"
    min={min}
    max={max}
    value={value}
    onChange={onChange}
    step={step}
  />
);

export default Slider;
