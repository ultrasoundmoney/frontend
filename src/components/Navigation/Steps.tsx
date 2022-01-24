import * as React from "react";
import Link from "next/link";
import EthLogo from "../../assets/ethereum-logo-2014-5.svg";
import { TranslationsContext } from "../../translations-context";

type BallProps = {
  active: boolean;
};

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
  controlPoints: ControlPoint[];
};

const Steps = React.forwardRef<HTMLDivElement | null, StepsProps>(
  ({ controlPoints }, ref) => {
    const [activeBalls, setActiveBalls] = React.useState<
      ControlPointMutated[] | undefined
    >();

    const getActiveBalls = React.useCallback(() => {
      return controlPoints.map((item) => {
        return {
          ...item,
          active: window.pageYOffset > item.offsetY - window.innerHeight / 2,
        };
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

    const Ball: React.FC<BallProps> = ({ active }) => {
      return (
        <div
          style={{
            width: "16px",
            height: "16px",
            margin: "0 10px",
            borderRadius: "50%",
            border: `1px solid ${active ? "#00FFA3" : "#8991AD"}`,
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: active ? "#00FFA3" : "#8991AD",
              borderRadius: "50%",
              margin: "4px",
            }}
          ></div>
        </div>
      );
    };

    const Track = () => (
      <div
        className="w-full"
        style={{
          height: "1px",
          margin: "0 10px",
          backgroundImage:
            "linear-gradient(to right, grey 40%, transparent 40%)",
          backgroundSize: "10px 1px",
          backgroundRepeat: "repeat-x",
        }}
      ></div>
    );

    const containerRef = React.useRef<HTMLDivElement | null>(null);
    console.log("render");
    return (
      <div
        ref={containerRef}
        className="w-full md:w-9/12 relative flex justify-around lg:justify-around"
      >
        <div
          ref={ref}
          style={{
            // left: `${iconOffset}%`,
            minWidth: "32px",
            transition: "0.3s ease-in-out",
          }}
          className={`absolute -bottom-2`}
        >
          <Link href="/">
            <img style={{ height: "32px" }} src={EthLogo} alt={t.title} />
          </Link>
        </div>
        <div className="flex w-full justify-around">
          {activeBalls &&
            activeBalls.map((item, index) => {
              if (index === controlPoints.length - 1) {
                return (
                  <div className="flex items-center" key={`${index}`}>
                    <Ball active={item.active} />
                  </div>
                );
              }
              return (
                <div className="flex w-full items-center" key={`${index}`}>
                  <Ball active={item.active} />
                  <Track />
                </div>
              );
            })}
        </div>
      </div>
    );
  }
);

Steps.displayName = "Steps";

export default Steps;
