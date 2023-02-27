import * as React from "react";

interface CbArg {
  width: number;
  height: number;
}

export function useOnResize(cb: (arg?: CbArg) => void) {
  const cbRef = React.useRef(cb);
  cbRef.current = cb;
  React.useEffect(() => {
    function handleResize() {
      cbRef.current({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
}
