import { useMediaQuery } from "@react-hook/media-query";
import { useEffect, useState } from "react";

type Breakpoint = { sm: boolean; md: boolean; lg: boolean; xl: boolean };

export const useActiveBreakpoint = (): Breakpoint => {
  const [activeBreakpoints, setActiveBreakpoints] = useState({
    sm: false,
    md: false,
    lg: false,
    xl: false,
  });

  const sm = useMediaQuery("(min-width: 768px)");
  const md = useMediaQuery("(min-width: 1024px)");
  const lg = useMediaQuery("(min-width: 1280px)");
  const xl = useMediaQuery("(min-width: 1536px)");

  useEffect(() => {
    setActiveBreakpoints({ sm, md, lg, xl });
  }, [sm, md, lg, xl]);

  return activeBreakpoints;
};
