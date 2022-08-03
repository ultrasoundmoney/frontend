import * as React from "react";
import styles from "./Slider.module.scss";

interface Props {
  min: number;
  max: number;
  value?: number;
  step?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
  thumbVisible?: boolean;
}

const THUMB_WIDTH = 14;

/**
 * The browser's native slider is difficult to style and leads
 * to very small tap targets on mobile, so instead we render a
 * transparent slider and use a custom UI in front of it.
 */
const Slider: React.FC<Props> = ({
  min,
  max,
  onChange,
  onPointerDown,
  onPointerUp,
  step,
  thumbVisible = true,
  value,
}) => {
  const percent =
    value !== undefined ? ((value - min) / (max - min)) * 100 : undefined;
  const offset =
    percent !== undefined
      ? Math.floor((percent * THUMB_WIDTH) / 100)
      : undefined;
  return (
    <div className={`${styles.slider} slider`}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={onChange}
        className={`
         ${styles.sliderInput}
         ${thumbVisible ? "" : styles.thumbInvisible}
        `}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      />
      <div className={styles.sliderTrack}></div>
      <div
        className={styles.sliderThumb}
        style={{ left: `calc(${percent}% - ${offset}px)` }}
      ></div>
    </div>
  );
};

export default Slider;
