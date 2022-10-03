import type { FC } from "react";
import { useContext, useState } from "react";
import type { Flag } from "../feature-flags";
import { displayFlagMap, FeatureFlagsContext, flags } from "../feature-flags";
import { useAdminToken } from "../hooks/use-admin-token";
import { BaseText } from "./Texts";
import ToggleSwitch from "./ToggleSwitch";
import { WidgetTitle } from "./WidgetSubcomponents";

const AdminTools: FC<{
  setFlag: ({ flag, enabled }: { flag: Flag; enabled: boolean }) => void;
}> = ({ setFlag }) => {
  const adminToken = useAdminToken();
  const [minimizeFlags, setMinimizeFlags] = useState(false);
  const featureFlags = useContext(FeatureFlagsContext);

  if (adminToken === undefined) {
    return null;
  }

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
          <BaseText
            font="font-roboto"
            className={`px-2 text-xl ${minimizeFlags ? "hidden" : ""}`}
          >
            ↓
          </BaseText>
          <BaseText
            font="font-roboto"
            className={`px-2 text-xl ${minimizeFlags ? "" : "hidden"}`}
          >
            ↑
          </BaseText>
        </div>
      </div>
      {flags.map((flag) => (
        <div
          key={flag}
          className="flex items-center justify-between gap-x-4 mt-4"
        >
          <span className="text-white mr-4">{displayFlagMap[flag]}</span>
          <ToggleSwitch
            checked={featureFlags[flag]}
            onToggle={(enabled) => setFlag({ flag, enabled })}
          ></ToggleSwitch>
        </div>
      ))}
    </div>
  );
};

export default AdminTools;
