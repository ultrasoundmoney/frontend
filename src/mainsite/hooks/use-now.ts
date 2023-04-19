import { useEffect, useState } from "react";
import { O } from "../../fp";

export const useNow = () => {
  const [now, setNow] = useState<O.Option<Date>>(O.none);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(O.some(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return now;
};
