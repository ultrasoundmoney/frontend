import type { FC, MutableRefObject, ReactNode } from "react";
import { createContext, useState } from "react";

export type StepperPoint = {
  offsetY: number;
  name: string;
  height: number;
};

const StepperContext = createContext<{
  stepperElements: {
    [key: string]: StepperPoint;
  };
  addStepperELement: (
    newElementRef: MutableRefObject<HTMLDivElement | null>,
    elementName: string,
  ) => void;
} | null>(null);

const SteppersProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [stepperElements, setStepperElements] = useState<{
    [key: string]: StepperPoint;
  }>({});

  const addStepperELement = (
    newElementRef: MutableRefObject<HTMLDivElement | null>,
    elementName: string,
  ) => {
    if (newElementRef && newElementRef.current) {
      const rect = newElementRef.current?.getBoundingClientRect();
      setStepperElements((prevState: { [key: string]: StepperPoint }): any => ({
        ...prevState,
        [elementName]: {
          offsetY: Math.round(window.scrollY + rect.top),
          name: elementName,
          height: newElementRef?.current?.clientHeight,
        },
      }));
    }
  };
  // console.log(stepperElements);
  return (
    <StepperContext.Provider value={{ stepperElements, addStepperELement }}>
      {children}
    </StepperContext.Provider>
  );
};

export { StepperContext, SteppersProvider };
