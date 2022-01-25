import { createContext, FC, MutableRefObject, useRef } from "react";

type StepperPoint = {
  offsetY: number;
  name: string;
  height: number;
};

const StepperContext = createContext<{
  stepperElements: MutableRefObject<
    | {}
    | {
        current: {
          [key: string]: StepperPoint;
        };
      }
  >;
  addStepperELement: (
    newElementRef: MutableRefObject<HTMLDivElement | null>,
    elementName: string
  ) => void;
} | null>(null);

const SteppersProvider: FC = ({ children }) => {
  const stepperElements = useRef<
    | {
        current: { [key: string]: StepperPoint };
      }
    | {}
  >({});

  const addStepperELement = (
    newElementRef: React.MutableRefObject<HTMLDivElement | null>,
    elementName: string
  ) => {
    if (newElementRef && newElementRef.current) {
      stepperElements.current = {
        ...stepperElements.current,
        [elementName]: {
          offsetY: newElementRef?.current?.offsetTop,
          name: elementName,
          height: newElementRef?.current?.clientHeight,
        },
      };
    }
  };

  return (
    <StepperContext.Provider value={{ stepperElements, addStepperELement }}>
      {children}
    </StepperContext.Provider>
  );
};

export { StepperContext, SteppersProvider };
