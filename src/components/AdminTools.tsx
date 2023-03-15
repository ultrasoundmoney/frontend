import type { FC } from "react";
import { useCallback } from "react";
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
  const [minimized, setMinimized] = useState(false);
  const featureFlags = useContext(FeatureFlagsContext);

  const handleMinimize = useCallback(() => {
    setMinimized((minimized) => !minimized);
  }, []);

  if (adminToken === undefined) {
    return null;
  }

  return (
    <div
      className={`
        fixed bottom-4 left-4
        z-20 rounded-lg
        border-2 border-slate-600
        bg-slateus-700 p-4
        transition-transform
        ${minimized ? "translate-y-[88%]" : ""}
      `}
    >
      <div className="flex justify-between items-center">
        <WidgetTitle>feature flags</WidgetTitle>
        <div onClick={handleMinimize}>
          <BaseText
            font="font-roboto"
            className={`px-2 text-xl ${minimized ? "hidden" : ""}`}
          >
            ↓
          </BaseText>
          <BaseText
            font="font-roboto"
            className={`px-2 text-xl ${minimized ? "" : "hidden"}`}
          >
            ↑
          </BaseText>
        </div>
      </div>
      {flags.map((flag) => (
        <div
          key={flag}
          className="flex gap-x-4 justify-between items-center mt-4"
        >
          <span className="mr-4 text-white">{displayFlagMap[flag]}</span>
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
