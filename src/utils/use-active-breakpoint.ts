import { useMediaQuery } from "@react-hook/media-query";
import { useEffect, useState } from "react";

type Breakpoint = { md: boolean; lg: boolean; xl: boolean };

export const useActiveBreakpoint = (): Breakpoint => {
  const [activeBreakpoints, setActiveBreakpoints] = useState({
    md: false,
    lg: false,
    xl: false,
  });

  const xl = useMediaQuery("(min-width: 1536px)");
  const lg = useMediaQuery("(min-width: 1280px)");
  const md = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setActiveBreakpoints({ md, lg, xl });
  }, [md, lg, xl]);

  return activeBreakpoints;
};
