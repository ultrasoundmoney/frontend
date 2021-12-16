import * as DateFns from "date-fns";
import JSBI from "jsbi";
import React, { FC } from "react";
import { useScarcity } from "../../api";
import * as Format from "../../format";
import { pipe } from "../../fp";
import { Amount } from "../Amount";
import { LabelText } from "../Texts";
import { WidgetBackground, WidgetTitle } from "../WidgetBits";

const ScarcityBar: FC<{
  staked: number;
  locked: number;
  supply: number;
  burned: number;
}> = ({ staked, locked, supply, burned }) => {
  // We don't have ETH issued, we use burned + current supply to get it instead.
  const totalIssued = burned + supply;

  // Total supply issued is our full bar, and thus 100%.
  const fractionBurnedPercent = (burned / totalIssued) * 100;

  // Subtract what has been burned and you have total supply percent.
  const totalSupplyPercent = 100 - fractionBurnedPercent;

  const stakedPercent = (staked / supply) * 100;
  const lockedPercent = (locked / supply) * 100;
  const stakedPlusLocked = ((staked + locked) / supply) * 100;

  // We scale up because the bar is too short otherwise.
  // const scalingFactor = 4;
  // const stakedPlusLockedWidth = stakedPlusLocked * scalingFactor;

  return (
    <div className="relative py-16">
      <div className="absolute w-full h-2 bg-orange-fire rounded-full"></div>
      <div
        className="absolute h-2 bg-blue-dusk rounded-full pr-1"
        style={{ width: `${totalSupplyPercent}%` }}
      ></div>
      <div
        className="absolute h-2 bg-blue-spindle rounded-full pr-1"
        style={{ width: `${stakedPlusLocked}%` }}
      ></div>
      <div
        className="absolute h-2 bg-blue-dusk"
        style={{ left: `${stakedPlusLocked / 2}%`, width: "2px" }}
      ></div>
      <div className="absolute top-8" style={{ width: `${stakedPlusLocked}%` }}>
        <div className="flex justify-around">
          <img
            src="/icecube.svg"
            alt="monocolor icecube, signifying staked ETH"
          />
          <img
            src="/lock.svg"
            alt="monocolor padlock, signifying ETH locked in DeFi"
          />
        </div>
      </div>
      <div
        className="absolute top-8 right-0"
        // Use this when the burn is big enough
        // style={{ width: `${fractionBurnedPercent}%` }}
      >
        <img src="/flame.svg" alt="flame emoji, signifying ETH burned" />
      </div>
      <div
        className="absolute bottom-6"
        style={{ width: `${stakedPlusLocked}%` }}
      >
        <div className="flex justify-around">
          <p className="font-roboto text-white">
            {Format.formatNoDigit(stakedPercent)}%
          </p>
          <p className="font-roboto text-white">
            {Format.formatNoDigit(lockedPercent)}%
          </p>
        </div>
      </div>
    </div>
  );
};

const Scarcity: FC = () => {
  const scarcity = useScarcity();

  const mEthFromWei = (num: JSBI): number =>
    pipe(
      num,
      (num) => JSBI.divide(num, JSBI.BigInt(10 ** (18 + 6))),
      (num) => JSBI.toNumber(num)
    );

  const mEthFromWeiFormatted = (num: JSBI): string =>
    pipe(num, mEthFromWei, Format.formatOneDigit);

  return (
    <WidgetBackground>
      <WidgetTitle title="scarcity" />
      {scarcity === undefined ? (
        <div className="h-2 py-10 bg-blue-dusk"></div>
      ) : (
        <ScarcityBar
          staked={mEthFromWei(scarcity.engines.staked.amount)}
          locked={scarcity.engines.locked.amount / 10 ** 6}
          supply={mEthFromWei(scarcity.ethSupply)}
          burned={mEthFromWei(scarcity.engines.burned.amount)}
        />
      )}
      <div className="grid grid-cols-3 gap-y-4">
        <LabelText>engine</LabelText>
        <LabelText>amount</LabelText>
        <LabelText className="text-right">time span</LabelText>
        {scarcity && (
          <>
            <>
              <span className="font-inter text-white">staking</span>
              <Amount className="text-right" unitPrefix="M" unit="eth">
                {mEthFromWeiFormatted(scarcity.engines.staked.amount)}
              </Amount>
              <Amount className="text-right" unit="months">
                {DateFns.differenceInMonths(
                  new Date(),
                  scarcity.engines.staked.startedOn
                )}
              </Amount>
            </>
            <>
              <span className="font-inter text-white">defi</span>
              <Amount className="text-right" unitPrefix="M" unit="eth">
                {Format.formatOneDigit(
                  scarcity.engines.locked.amount / 1_000_000
                )}
              </Amount>
              <Amount className="text-right" unit="months">
                {DateFns.differenceInMonths(
                  new Date(),
                  scarcity.engines.locked.startedOn
                )}
              </Amount>
            </>
            <>
              <span className="font-inter text-white">burn</span>
              <Amount className="text-right" unitPrefix="M" unit="eth">
                {mEthFromWeiFormatted(scarcity.engines.burned.amount)}
              </Amount>
              <Amount className="text-right" unit="months">
                {DateFns.differenceInMonths(
                  new Date(),
                  scarcity.engines.burned.startedOn
                )}
              </Amount>
            </>
          </>
        )}
      </div>
    </WidgetBackground>
  );
};

export default Scarcity;
