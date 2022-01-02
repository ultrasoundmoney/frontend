import * as DateFns from "date-fns";
import JSBI from "jsbi";
import React, { FC, useState } from "react";
import { useScarcity } from "../../api";
import * as Format from "../../format";
import { pipe } from "../../fp";
import { Amount } from "../Amount";
import { LabelText } from "../Texts";
import { WidgetBackground, WidgetTitle } from "../WidgetBits";

type ScarcityBarProps = {
  staked: number;
  locked: number;
  supply: number;
  burned: number;
  onHoverStaked: (hovering: boolean) => void;
  onHoverLocked: (hovering: boolean) => void;
  onHoverBurned: (hovering: boolean) => void;
  hoveringStaked: boolean;
  hoveringLocked: boolean;
  hoveringBurned: boolean;
};

const ScarcityBar: FC<ScarcityBarProps> = ({
  staked,
  locked,
  supply,
  burned,
  onHoverBurned,
  onHoverLocked,
  onHoverStaked,
  hoveringBurned,
  hoveringLocked,
  hoveringStaked,
}) => {
  // We don't have ETH issued, we use burned + current supply to get it instead.
  const totalIssued = burned + supply;

  // Total supply issued is our full bar, and thus 100%.
  const fractionBurnedPercent = (burned / totalIssued) * 100;

  // Subtract what has been burned and you have total supply percent.
  const totalSupplyPercent = 100 - fractionBurnedPercent;

  const stakedPercent = (staked / supply) * 100;
  const lockedPercent = (locked / supply) * 100;
  const stakedPlusLocked = ((staked + locked) / supply) * 100;

  return (
    <div className="relative">
      <div className="h-28 flex items-center">
        <div
          className="absolute w-full h-2 bg-orange-fire rounded-full"
          style={{
            opacity: hoveringBurned ? 0.6 : 1,
          }}
        ></div>
        <div
          className="absolute h-2 bg-blue-dusk rounded-full"
          style={{ width: `${totalSupplyPercent}%` }}
        ></div>
      </div>
      <div className="absolute h-28 flex flex-row w-full top-0 left-0 items-center">
        <div
          className="flex flex-col items-center"
          style={{
            width: `${stakedPercent}%`,
          }}
          onMouseEnter={() => onHoverStaked(true)}
          onMouseLeave={() => onHoverStaked(false)}
        >
          <img
            className="relative"
            src="/staked-coloroff.svg"
            alt="monocolor ice crystal, signifying staked ETH"
            style={{
              height: "21px",
              marginBottom: "12px",
              visibility: hoveringStaked ? "hidden" : "visible",
            }}
          />
          <img
            className="absolute"
            src="/staked-coloron.svg"
            alt="colored ice crystal, signifying staked ETH"
            style={{
              height: "21px",
              marginBottom: "12px",
              visibility: hoveringStaked ? "visible" : "hidden",
            }}
          />
          <div
            className="h-2 bg-blue-spindle rounded-l-full w-full"
            style={{
              opacity: hoveringStaked ? 0.6 : 1,
            }}
          ></div>
          <p
            className="font-roboto text-white"
            style={{ marginTop: "9px", opacity: hoveringStaked ? 0.6 : 1 }}
          >
            {Format.formatNoDigit(stakedPercent)}%
          </p>
        </div>
        <div
          className="absolute h-2 bg-blue-dusk z-10"
          style={{ left: `calc(${stakedPlusLocked / 2}% - 2px`, width: "2px" }}
        ></div>
        <div
          className="flex flex-col items-center"
          style={{
            width: `${lockedPercent}%`,
          }}
          onMouseEnter={() => onHoverLocked(true)}
          onMouseLeave={() => onHoverLocked(false)}
        >
          <img
            className="relative"
            src="/locked-coloroff.svg"
            alt="monocolor padlock, signifying ETH locked in DeFi"
            style={{
              height: "21px",
              marginBottom: "12px",
              visibility: hoveringLocked ? "hidden" : "visible",
            }}
          />
          <img
            className="absolute"
            src="/locked-coloron.svg"
            alt="colored padlock, signifying ETH locked in DeFi"
            style={{
              height: "21px",
              marginBottom: "12px",
              visibility: hoveringLocked ? "visible" : "hidden",
            }}
          />
          <div
            className="h-2 bg-blue-spindle rounded-r-full w-full"
            style={{ opacity: hoveringLocked ? 0.6 : 1 }}
          ></div>
          <p
            className="font-roboto text-white"
            style={{ marginTop: "9px", opacity: hoveringLocked ? 0.6 : 1 }}
          >
            {Format.formatNoDigit(lockedPercent)}%
          </p>
        </div>
      </div>
      <div
        className="absolute top-5 right-0"
        style={{
          opacity: hoveringBurned ? 0.6 : 1,
          // Use this when the burn is big enough
          // width: `${fractionBurnedPercent}%`
        }}
        onMouseEnter={() => onHoverBurned(true)}
        onMouseLeave={() => onHoverBurned(false)}
      >
        <img src="/flame.svg" alt="flame emoji, signifying ETH burned" />
      </div>
    </div>
  );
};

export const ethFromWei = (wei: number) => wei / 10 ** 18;

const Scarcity: FC = () => {
  const scarcity = useScarcity();
  const [hoveringStaked, setHoveringStaked] = useState(false);
  const [hoveringLocked, setHoveringLocked] = useState(false);
  const [hoveringBurned, setHoveringBurned] = useState(false);

  const mEthFromWei = (num: JSBI): number =>
    pipe(
      num,
      (num) => JSBI.toNumber(num),
      ethFromWei,
      (num) => num / 10 ** 6
    );

  const mEthFromWeiFormatted = (num: JSBI): string =>
    pipe(num, mEthFromWei, Format.formatOneDigit);

  return (
    <WidgetBackground>
      <WidgetTitle title="scarcity" />
      {scarcity === undefined ? (
        <div className="relative py-16">
          <div className="absolute w-full h-2 bg-blue-dusk rounded-full"></div>
        </div>
      ) : (
        <ScarcityBar
          staked={mEthFromWei(scarcity.engines.staked.amount)}
          locked={scarcity.engines.locked.amount / 10 ** 6}
          supply={mEthFromWei(scarcity.ethSupply)}
          burned={mEthFromWei(scarcity.engines.burned.amount)}
          onHoverStaked={setHoveringStaked}
          onHoverLocked={setHoveringLocked}
          onHoverBurned={setHoveringBurned}
          hoveringStaked={hoveringStaked}
          hoveringLocked={hoveringLocked}
          hoveringBurned={hoveringBurned}
        />
      )}
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-3">
          <LabelText>engine</LabelText>
          <LabelText className="text-right">amount</LabelText>
          <LabelText className="text-right">time span</LabelText>
        </div>
        {scarcity && (
          <>
            <a
              className="grid grid-cols-3"
              onMouseEnter={() => setHoveringStaked(true)}
              onMouseLeave={() => setHoveringStaked(false)}
              style={{ opacity: hoveringStaked ? 0.6 : 1 }}
              href="https://beaconcha.in/charts/staked_ether"
              target="_blank"
            >
              <span className="font-inter text-white">staking</span>
              <Amount className="text-right" unitPrefix="M" unit="eth">
                {mEthFromWeiFormatted(scarcity.engines.staked.amount)}
              </Amount>
              <Amount className="text-right" unit="months">
                {
                  DateFns.formatDistanceStrict(
                    scarcity.engines.staked.startedOn,
                    new Date(),
                    { unit: "month" }
                  ).split(" ")[0]
                }
              </Amount>
            </a>
            <a
              className="grid grid-cols-3"
              onMouseEnter={() => setHoveringLocked(true)}
              onMouseLeave={() => setHoveringLocked(false)}
              style={{ opacity: hoveringLocked ? 0.6 : 1 }}
              href="https://defipulse.com/"
              target="_blank"
            >
              <span className="font-inter text-white">defi</span>
              <Amount className="text-right" unitPrefix="M" unit="eth">
                {Format.formatOneDigit(
                  scarcity.engines.locked.amount / 1_000_000
                )}
              </Amount>
              <Amount className="text-right" unit="months">
                {
                  DateFns.formatDistanceStrict(
                    scarcity.engines.locked.startedOn,
                    new Date(),
                    { unit: "month" }
                  ).split(" ")[0]
                }
              </Amount>
            </a>
            <a
              className="grid grid-cols-3"
              onMouseEnter={() => setHoveringBurned(true)}
              onMouseLeave={() => setHoveringBurned(false)}
              style={{ opacity: hoveringBurned ? 0.6 : 1 }}
              href="https://dune.xyz/cembar/ETH-Burned"
              target="_blank"
            >
              <span className="font-inter text-white">burn</span>
              <Amount className="text-right" unitPrefix="M" unit="eth">
                {mEthFromWeiFormatted(scarcity.engines.burned.amount)}
              </Amount>
              <Amount className="text-right" unit="months">
                {
                  DateFns.formatDistanceStrict(
                    scarcity.engines.burned.startedOn,
                    new Date(),
                    { unit: "month" }
                  ).split(" ")[0]
                }
              </Amount>
            </a>
          </>
        )}
      </div>
    </WidgetBackground>
  );
};

export default Scarcity;
