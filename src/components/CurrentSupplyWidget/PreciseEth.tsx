import JSBI from "jsbi";
import dropRight from "lodash/dropRight";
import flow from "lodash/flow";
import takeRight from "lodash/takeRight";
import type { FC } from "react";
import { useCallback } from "react";
import CountUp from "react-countup";
import { AmountAnimatedShell, defaultMoneyAnimationDuration } from "../Amount";

// For a wei number 119,144,277,858,326,743,920,488,300 we want to display the
// full number, and animate it. For display we could use strings, but for
// animation we need numbers. Numbers are sufficiently large where we run
// against low level limits (IEEE 754), and can't work with the full number. We
// split the number into three parts, to enable both precision and animation.

const ethNoDecimals = flow(
  (ethSupplySum: JSBI) => ethSupplySum.toString().split(""),
  (chars) => dropRight(chars, 18),
  (str) => str.join(""),
  (str) => JSBI.BigInt(str),
  (num) => JSBI.toNumber(num),
);

// The last six digits in the number.
const ethLastSixteenDecimals = flow(
  (ethSupplySum: JSBI) => ethSupplySum.toString().split(""),
  (chars) => takeRight(chars, 16),
  (str) => str.join(""),
  (str) => JSBI.BigInt(str),
  (num) => JSBI.toNumber(num),
);

// Everything that is left from the fractional part when written in ETH instead of Wei. This is always twelve digits.
const ethFirstTwoDecimals = flow(
  (ethSupplySum: JSBI) => ethSupplySum.toString().split(""),
  (chars) => dropRight(chars, 16),
  (chars) => takeRight(chars, 2),
  (str) => str.join(""),
  (str) => JSBI.BigInt(str),
  (num) => JSBI.toNumber(num),
);

const formatDecimals = (num: number, padTo: number): string => {
  const numsAsStrings = num.toString().padStart(padTo, "0").split("").reverse();
  const result = [];
  for (let i = 0; i < numsAsStrings.length; i++) {
    if (i !== 0 && i % 3 === 0) {
      result.push(",");
    }

    result.push(numsAsStrings[i]);
  }
  return result.reverse().join("");
};

const Digits: FC<{ children: JSBI }> = ({ children }) => {
  const padTwoDecimals = useCallback(
    (num: number) => formatDecimals(num, 2),
    [],
  );

  const padSixteenDecimals = useCallback(
    (num: number) => formatDecimals(num, 16),
    [],
  );

  return (
    <div className="relative -mr-1 w-[26px] [@media(min-width:375px)]:w-9">
      <div
        // We need whitespace-normal to counteract the whitespace-nowrap from our parent.
        className={`
          absolute block
          h-2 w-3
          overflow-hidden
          whitespace-normal break-all
          text-[6px]
          leading-[0.4rem]
          text-white
          [@media(min-width:375px)]:text-[8px] [@media(min-width:375px)]:leading-[0.5rem]
        `}
      >
        {ethFirstTwoDecimals(children) === 0 ? (
          <span>00</span>
        ) : (
          <CountUp
            separator=","
            end={ethFirstTwoDecimals(children)}
            formattingFn={padTwoDecimals}
            preserveValue={true}
            useEasing={false}
            duration={0.5}
          />
        )}
      </div>
      <div
        // We need whitespace-normal to counteract the whitespace-nowrap from our parent.
        className={`
          left-0 block
          whitespace-normal break-all
          text-[6px]
          leading-[0.4rem] text-slateus-200
          [@media(min-width:375px)]:text-[8px]
          [@media(min-width:375px)]:leading-[0.5rem]
        `}
      >
        &nbsp;&nbsp;
        {ethLastSixteenDecimals(children) === 0 ? (
          <span>0,000,000,000,000,000</span>
        ) : (
          <CountUp
            separator=","
            end={ethLastSixteenDecimals(children)}
            formattingFn={padSixteenDecimals}
            preserveValue={true}
            useEasing={false}
          />
        )}
      </div>
    </div>
  );
};

const PreciseEth: FC<{ children?: JSBI; justify?: "justify-end" }> = ({
  children,
  justify,
}) => (
  <AmountAnimatedShell
    className={`
      flex items-center
      ${justify !== undefined ? justify : ""}
      tracking-tight
    `}
    size="text-[1.30rem] [@media(min-width:375px)]:text-[1.70rem]"
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
