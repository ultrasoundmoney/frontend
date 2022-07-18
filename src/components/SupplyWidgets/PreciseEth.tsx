import JSBI from "jsbi";
import { FC } from "react";
import CountUp from "react-countup";
import { pipe } from "../../fp";
import { AmountAnimatedShell, defaultMoneyAnimationDuration } from "../Amount";

const ethNoDecimals = (ethSupplySum: JSBI) =>
  pipe(
    JSBI.divide(
      ethSupplySum,
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)),
    ),
    (ethSupplySumEth) => JSBI.toNumber(ethSupplySumEth),
  );

const ethOnlyDecimals = (ethSupplySum: JSBI) => {
  const ethNoDecimals = pipe(
    JSBI.divide(
      ethSupplySum,
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)),
    ),
    (num) =>
      JSBI.multiply(num, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))),
  );

  const ethOnlyDecimals = JSBI.subtract(ethSupplySum, ethNoDecimals);

  return JSBI.toNumber(ethOnlyDecimals);
};

const formatDecimals = (num: number): string => {
  const numsAsStrings = num.toString().padStart(18, "0").split("");
  const result = [];
  for (let i = 0; i < numsAsStrings.length; i++) {
    if (i !== 0 && i % 3 === 0) {
      result.push(",");
    }

    result.push(numsAsStrings[i]);
  }
  return result.join("");
};

const Digits: FC<{ children: JSBI }> = ({ children }) => (
  <div className="relative w-9">
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
      {ethOnlyDecimals(children) === 0 ? (
        <span>000,000,000,000,000,000</span>
      ) : (
        <CountUp
          separator=","
          end={ethOnlyDecimals(children)}
          formattingFn={formatDecimals}
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
      {ethOnlyDecimals(children) === 0 ? (
        <span>000,000,000,000,000,000</span>
      ) : (
        <CountUp
          separator=","
          end={ethOnlyDecimals(children)}
          formattingFn={formatDecimals}
        />
      )}
    </div>
  </div>
);

const PreciseEth: FC<{ children?: JSBI }> = ({ children }) => (
  <AmountAnimatedShell
    className="flex items-center tracking-tight"
    textClassName="text-[1.73rem]"
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
