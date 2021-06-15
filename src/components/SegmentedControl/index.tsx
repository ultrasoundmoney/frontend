import * as React from "react";

export interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  options: Option[];
  onChange(selected: Option): void;
}

const SegmentedControl: React.FC<Props> = ({ value, options, onChange }) => {
  return (
    <div className="flex">
      {options.map((o) => (
        <button
          key={o.value}
          className={`flex-none appearance-none text-sm px-2 cursor-pointer transition-all focus:border-blue-300 ${
            value === o.value
              ? "text-white"
              : "text-blue-shipcove hover:text-blue-spindle "
          }`}
          onClick={() => onChange(o)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
