import { useMediaQuery } from "@react-hook/media-query";
import { useEffect, useState } from "react";

type ActiveBreakpoint = {
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  xl2: boolean;
};

// Try not to use this, it forces JS to react to breakpoints instead of the usual CSS. This may cause SSR issues.
export const useActiveBreakpoint = (): ActiveBreakpoint => {
  const [activeBreakpoints, setActiveBreakpoints] = useState<ActiveBreakpoint>({
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xl2: false,
  });

  const sm = useMediaQuery("(min-width: 640px)");
  const md = useMediaQuery("(min-width: 768px)");
  const lg = useMediaQuery("(min-width: 1024px)");
  const xl = useMediaQuery("(min-width: 1280px)");
  const xl2 = useMediaQuery("(min-width: 1536px)");

  useEffect(() => {
    setActiveBreakpoints({ sm, md, lg, xl, xl2 });
  }, [sm, md, lg, xl, xl2]);

  return activeBreakpoints;
};
