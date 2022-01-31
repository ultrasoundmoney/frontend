import { createContext, FC, MutableRefObject, useState } from "react";

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
    elementName: string
  ) => void;
} | null>(null);

const SteppersProvider: FC = ({ children }) => {
  const [stepperElements, setStepperElements] = useState<{
    [key: string]: StepperPoint;
  }>({});

  const addStepperELement = (
    newElementRef: MutableRefObject<HTMLDivElement | null>,
    elementName: string
  ) => {
    if (newElementRef && newElementRef.current) {
      setStepperElements((prevState: { [key: string]: StepperPoint }): any => ({
        ...prevState,
        [elementName]: {
          offsetY: newElementRef?.current?.offsetTop,
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
