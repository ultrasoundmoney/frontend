import * as React from "react";
import styles from "./Slider.module.scss";

interface Props {
  min: number;
  max: number;
  value: number;
  step?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<Props> = ({ min, max, value, step, onChange }) => {
  return (
    <div className="slider">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={onChange}
        className={styles.slider}
      />
    </div>
  );
};

export default React.memo(Slider);
