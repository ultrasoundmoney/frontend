import type { FC, ReactNode } from "react";
import { createContext, useState } from "react";

interface INavigationContext {
  hidingNavigationPosition: number;
  changeHidingNavigationPosition: (value: number) => void;
  faqPosition: number;
  changeFaqPosition: (value: number) => void;
}

const defaultContext: INavigationContext = {
  hidingNavigationPosition: 0,
  changeHidingNavigationPosition: (value: number) => value,
  faqPosition: 0,
  changeFaqPosition: (value: number) => value,
};

const NavigationContext = createContext<INavigationContext>(defaultContext);

const NavigationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [hidingNavigationPosition, setHidingNavigationPosition] =
    useState<number>(0);
  const [faqPosition, setFaqPosition] = useState<number>(0);

  const changeHidingNavigationPosition = (value: number) => {
    setHidingNavigationPosition(value);
  };

  const changeFaqPosition = (value: number) => {
    setFaqPosition(value);
  };

  return (
    <NavigationContext.Provider
      value={{
        hidingNavigationPosition,
        changeHidingNavigationPosition,
        faqPosition,
        changeFaqPosition,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export { NavigationContext, NavigationProvider };
