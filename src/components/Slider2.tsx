import { ChangeEvent, FC } from "react";
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
      appearance-none
      w-full h-2 z-10
      my-1
      bg-blue-highlightbg
      rounded-full
      cursor-pointer
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
