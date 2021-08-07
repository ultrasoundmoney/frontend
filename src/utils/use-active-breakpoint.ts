import { useMediaQuery } from "@react-hook/media-query";

type Breakpoint = { md: boolean; lg: boolean; xl: boolean };

export const useActiveBreakpoint = (): Breakpoint => {
  const isXl = useMediaQuery("(min-width: 1536px)");
  const isLg = useMediaQuery("(min-width: 1280px)");
  const isMd = useMediaQuery("(min-width: 1024px)");

  return { md: isMd, lg: isLg, xl: isXl };
};
