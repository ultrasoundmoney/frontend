import { FC, ReactNode, useMemo } from "react";
import { useState } from "react";
import Nerd from "./Nerd";

export type NerdTooltipComponents = {
  Nerd: FC;
  TooltipWrapper: FC<{ children: ReactNode }>;
  BackgroundOverlay: FC;
  showTooltip: boolean;
  setShowTooltip: (show: boolean) => void;
};

export const useNerdTooltip = (): NerdTooltipComponents => {
  const [showTooltip, setShowTooltip] = useState(false);

  const TooltipWrapper: FC<{ children: ReactNode }> = useMemo(() => {
    const TooltipWrapper: FC<{ children: ReactNode }> = ({ children }) => (
      <div
        className={`
        tooltip
        w-[calc(100% + 96px)] fixed top-1/2
        left-1/2 z-30 -translate-x-1/2 -translate-y-1/2
        cursor-auto
        whitespace-nowrap
        ${showTooltip ? "block" : "hidden"}
      `}
      >
        {children}
      </div>
    );
    return TooltipWrapper;
  }, [showTooltip]);

  const BackgroundOverlay: FC = useMemo(() => {
    const BackgroundOverlay = () => (
      <div
        className={`
        fixed top-0 left-0 bottom-0 right-0
        z-20 flex items-center
        justify-center
        bg-slateus-700/60
        backdrop-blur-sm
        ${showTooltip ? "" : "hidden"}
      `}
        onClick={() => setShowTooltip(false)}
      ></div>
    );
    return BackgroundOverlay;
  }, [showTooltip]);

  const NerdWrapped = useMemo(() => {
    const NerdWrapped = () => <Nerd onClick={() => setShowTooltip(true)} />;
    return NerdWrapped;
  }, [setShowTooltip]);

  return {
    Nerd: NerdWrapped,
    TooltipWrapper,
    BackgroundOverlay,
    showTooltip,
    setShowTooltip,
  };
};
