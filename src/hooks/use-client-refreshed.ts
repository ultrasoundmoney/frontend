import { useEffect, useState } from "react";

export const useClientRefreshed = <A>(
  init: A,
  refreshHook: () => A | undefined,
): A => {
  const [state, setState] = useState(init);
  const refreshed = refreshHook();

  useEffect(() => {
    if (refreshed === undefined) {
      return;
    }

    setState(refreshed);
  }, [init, refreshed]);

  return state;
};
