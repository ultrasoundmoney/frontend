import JSBI from "jsbi";
import { A, pipe } from "../../fp";
import { FC, useCallback } from "react";
import CountUp from "react-countup";
import { AmountAnimatedShell, defaultMoneyAnimationDuration } from "../Amount";

// For a wei number 119,144,277,858,326,743,920,488,300 we want to display the
// full number, and animate it. For display we could use strings, but for
// animation we need numbers. Numbers are sufficiently large where we run
// against low level limits (IEEE 754), and can't work with the full number. We
// split the number into three parts, to enable both precision and animation.

const ethNoDecimals = (ethSupplySum: JSBI): number =>
  pipe(
    ethSupplySum.toString().split(""),
    A.dropRight(18),
    (str) => str.join(""),
    (str) => JSBI.BigInt(str),
    (num) => JSBI.toNumber(num),
  );

// The last six digits in the number.
const ethLastSixDecimals = (ethSupplySum: JSBI): number =>
  pipe(
    ethSupplySum.toString().split(""),
    A.takeRight(6),
    (str) => str.join(""),
    (str) => JSBI.BigInt(str),
    (num) => JSBI.toNumber(num),
  );

// Everything that is left from the fractional part when written in ETH instead of Wei. This is always twelve digits.
const ethFirstTwelveDecimals = (ethSupplySum: JSBI): number =>
  pipe(
    ethSupplySum.toString().split(""),
    A.dropRight(6),
    A.takeRight(12),
    (str) => str.join(""),
    (str) => JSBI.BigInt(str),
    (num) => JSBI.toNumber(num),
  );

const formatDecimals = (num: number, padTo: number): string => {
  const numsAsStrings = num.toString().padStart(padTo, "0").split("");
  const result = [];
  for (let i = 0; i < numsAsStrings.length; i++) {
    if (i !== 0 && i % 3 === 0) {
      result.push(",");
    }

    result.push(numsAsStrings[i]);
  }
  return result.join("");
};

const Digits: FC<{ children: JSBI }> = ({ children }) => {
  const formattingFn12 = useCallback((num: number) => {
    return formatDecimals(num, 12);
  }, []);

  const formattingFn6 = useCallback((num: number) => {
    return formatDecimals(num, 6);
  }, []);

  return (
    <div className="relative w-9 -mr-1">
      <div
        // We need whitespace-normal to counteract the whitespace-nowrap from our parent.
        className={`
          text-[8px] leading-[0.5rem] text-white
          block break-all
          whitespace-normal
          absolute
          overflow-hidden
          w-3 h-2
        `}
      >
        {ethFirstTwelveDecimals(children) == 0 ? (
          <span>000,000,000,000,</span>
        ) : (
          <CountUp
            separator=","
            end={ethFirstTwelveDecimals(children)}
            formattingFn={formattingFn12}
            preserveValue={true}
            useEasing={false}
          />
        )}
      </div>
      <div
        // We need whitespace-normal to counteract the whitespace-nowrap from our parent.
        className={`
          text-[8px] leading-[0.5rem] text-blue-spindle
          block break-all
          whitespace-normal
          left-0
        `}
      >
        {ethFirstTwelveDecimals(children) == 0 ? (
          <span>000,000,000,000,</span>
        ) : (
          <CountUp
            separator=","
            end={ethFirstTwelveDecimals(children)}
            formattingFn={formattingFn12}
            preserveValue={true}
            useEasing={false}
          />
        )}
      </div>
      <div
        // We need whitespace-normal to counteract the whitespace-nowrap from our parent.
        className={`
          text-[8px] leading-[0.5rem] text-blue-spindle
          block break-all
          whitespace-normal
          left-0
        `}
      >
        {ethLastSixDecimals(children) == 0 ? (
          <span>000,000</span>
        ) : (
          <CountUp
            separator=","
            end={ethLastSixDecimals(children)}
            formattingFn={formattingFn6}
            preserveValue={true}
            useEasing={false}
          />
        )}
      </div>
    </div>
  );
};

const PreciseEth: FC<{ children?: JSBI }> = ({ children }) => (
  <AmountAnimatedShell
    className="flex items-center tracking-tight justify-end"
    textClassName="text-[1.70rem]"
    skeletonWidth={"3rem"}
    unitText={"ETH"}
  >
    {children && (
      <>
        <CountUp
          decimals={0}
          duration={defaultMoneyAnimationDuration}
          end={ethNoDecimals(children)}
          preserveValue={true}
          separator=","
        />
        .<Digits>{children}</Digits>
      </>
    )}
  </AmountAnimatedShell>
);

export default PreciseEth;
