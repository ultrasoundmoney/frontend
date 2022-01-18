import * as React from "react";
import Link from "next/link";
import EthLogo from "../../assets/ethereum-logo-2014-5.svg";
import { TranslationsContext } from "../../translations-context";

type BallProps = {
  pointOffset: number;
};

type ControlPoint = {
  offsetY: number;
  height: number;
};

type StepsProps = {
  iconOffset: number;
  controlPoints: ControlPoint[];
};

const Steps: React.FC<StepsProps> = ({ iconOffset, controlPoints }) => {
  const t = React.useContext(TranslationsContext);
  const Ball: React.FC<BallProps> = ({ pointOffset }) => {
    const [active, setActive] = React.useState<boolean>();

    React.useEffect(() => {
      setActive(window.pageYOffset > pointOffset);
    }, []);
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
      style={{
        height: "1px",
        width: "25%",
        margin: "0 10px",
        backgroundImage: "linear-gradient(to right, grey 40%, transparent 40%)",
        backgroundSize: "10px 1px",
        backgroundRepeat: "repeat-x",
      }}
    ></div>
  );

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  console.log(controlPoints);

  return (
    <div
      ref={containerRef}
      className="w-full md:w-9/12 relative flex justify-around lg:justify-around"
    >
      <div
        style={{
          left: `${iconOffset}%`,
          minWidth: "32px",
        }}
        className={`absolute -bottom-2`}
      >
        <Link href="/">
          <img
            className=""
            style={{ height: "32px" }}
            src={EthLogo}
            alt={t.title}
          />
        </Link>
      </div>
      <div className="flex w-full justify-around items-center">
        <Ball pointOffset={0} />
        {controlPoints.map((item) => (
          <>
            <Track />
            <Ball pointOffset={item.offsetY} />
          </>
        ))}
      </div>
    </div>
  );
};

export default Steps;
