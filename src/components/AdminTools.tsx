import type { FC } from "react";
import { useContext, useState } from "react";
import type { Flag } from "../feature-flags";
import { displayFlagMap, FeatureFlagsContext, flags } from "../feature-flags";
import { TextRoboto } from "./Texts";
import ToggleSwitch from "./ToggleSwitch";
import { WidgetTitle } from "./WidgetSubcomponents";

const AdminTools: FC<{
  setFlag: ({ flag, enabled }: { flag: Flag; enabled: boolean }) => void;
}> = ({ setFlag }) => {
  const [minimizeFlags, setMinimizeFlags] = useState(false);
  const featureFlags = useContext(FeatureFlagsContext);

  return (
    <div
      className={`
        fixed bottom-4 left-4
        bg-blue-tangaroa rounded-lg
        p-4 z-20
        border-2 border-slate-600
      transition-transform
        ${minimizeFlags ? "translate-y-[88%]" : ""}
      `}
    >
      <div className="flex justify-between items-center">
        <WidgetTitle>feature flags</WidgetTitle>
        <div className="" onClick={() => setMinimizeFlags(!minimizeFlags)}>
          <TextRoboto
            className={`text-xl px-2 ${minimizeFlags ? "hidden" : ""}`}
          >
            ↓
          </TextRoboto>
          <TextRoboto
            className={`text-xl px-2 ${minimizeFlags ? "" : "hidden"}`}
          >
            ↑
          </TextRoboto>
        </div>
      </div>
      {flags.map((flag) => (
        <div
          key={flag}
          className="flex items-center justify-between gap-x-4 mt-4"
        >
          <span className="text-white mr-4">{displayFlagMap[flag]}</span>
          <ToggleSwitch
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            checked={featureFlags[flag]}
            onToggle={(enabled) => setFlag({ flag, enabled })}
          ></ToggleSwitch>
        </div>
      ))}
    </div>
  );
};

export default AdminTools;
