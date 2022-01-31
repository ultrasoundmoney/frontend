import * as React from "react";
import Link from "next/link";
import EthLogo from "../../assets/ethereum-logo-2014-5.svg";
import { TranslationsContext } from "../../translations-context";
import StepperPoint from "./StepperPoint";
import StepperTrack from "./StepperTrack";

type ControlPoint = {
  offsetY: number;
  name: string;
};

type ControlPointMutated = {
  offsetY: number;
  name: string;
  active: boolean;
};

type StepsProps = {
  controlPoints: (ControlPoint | undefined)[];
};

const Steps = React.forwardRef<HTMLDivElement | null, StepsProps>(
  ({ controlPoints }, ref) => {
    const [activeBalls, setActiveBalls] = React.useState<
      (ControlPointMutated | undefined)[] | undefined
    >();

    const getActiveBalls = React.useCallback(() => {
      return controlPoints.map((item) => {
        if (item) {
          return {
            ...item,
            active: window.pageYOffset > item.offsetY - window.innerHeight / 2,
          };
        }
      });
    }, [controlPoints]);

    const t = React.useContext(TranslationsContext);
    React.useEffect(() => {
      const onScroll = () => {
        setActiveBalls(getActiveBalls());
      };
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }, [getActiveBalls]);

    return (
      <div className="w-full h-full md:w-9/12 relative flex justify-around lg:justify-around">
        <div
          ref={ref}
          style={{
            minWidth: "32px",
            transition: "0.3s ease-in-out",
          }}
          className={`absolute bottom-6`}
        >
          <Link href="/">
            <img style={{ height: "32px" }} src={EthLogo} alt={t.title} />
          </Link>
        </div>
        <div className="flex w-full justify-around items-start">
          {activeBalls &&
            activeBalls.map((item, index) => {
              if (item) {
                if (index === controlPoints.length - 1) {
                  return (
                    <div className="flex h-full items-center" key={`${index}`}>
                      <StepperPoint name={item.name} active={item.active} />
                    </div>
                  );
                }
                return (
                  <div
                    className="flex w-full h-full items-center"
                    key={`${index}`}
                  >
                    <StepperPoint name={item.name} active={item.active} />
                    <StepperTrack />
                  </div>
                );
              }
            })}
        </div>
      </div>
    );
  }
);

Steps.displayName = "Steps";

export default Steps;
