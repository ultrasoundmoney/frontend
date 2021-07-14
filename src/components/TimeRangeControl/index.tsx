import * as React from "react";
import SegmentedControl, {
  Option as SegmentedControlOption,
} from "../SegmentedControl";
import { TranslationsContext } from "../../translations-context";

interface Props {
  value: string;
  onChange(selected: SegmentedControlOption): void;
}

const TimeRangeControl: React.FC<Props> = ({ value, onChange }) => {
  const t = React.useContext(TranslationsContext);
  const options = React.useMemo(
    () => [
      {
        value: "all",
        label: t.time_range_all,
      },
      {
        value: "1y",
        label: t.time_range_1y,
      },
      {
        value: "6mo",
        label: t.time_range_6mo,
      },
      {
        value: "30d",
        label: t.time_range_30d,
      },
      {
        value: "7d",
        label: t.time_range_7d,
      },
    ],
    [t]
  );

  return (
    <SegmentedControl options={options} value={value} onChange={onChange} />
  );
};

export default TimeRangeControl;
