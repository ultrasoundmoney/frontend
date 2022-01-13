import * as DateFns from "date-fns";
import JSBI from "jsbi";
import React, { FC, useState } from "react";
import { useScarcity } from "../../api";
import Colors from "../../colors";
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
          className="absolute w-full h-2 bg-orange-fire rounded-full color-animation"
          style={{
            backgroundColor: hoveringBurned
              ? Colors.fireHighlight
              : Colors.fireOrange,
          }}
          onMouseEnter={() => onHoverBurned(true)}
          onMouseLeave={() => onHoverBurned(false)}
        ></div>
        <div
          className="absolute h-2 bg-blue-dusk rounded-full"
          style={{ width: `${totalSupplyPercent}%` }}
        ></div>
      </div>
      <div
        className="absolute h-28 flex flex-row top-0 left-0 items-center"
        style={{
          width: `${(supply / totalIssued) * 100}%`,
        }}
      >
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
            className="h-2 bg-blue-spindle rounded-l-full w-full color-animation"
            style={{
              backgroundColor: hoveringStaked ? Colors.white : Colors.spindle,
            }}
          ></div>
          <p
            className="font-roboto text-white color-animation"
            style={{
              marginTop: "9px",
              color: hoveringStaked ? Colors.white : Colors.spindle,
            }}
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
            className="h-2 bg-blue-spindle rounded-r-full w-full color-animation"
            style={{
              backgroundColor: hoveringLocked ? Colors.white : Colors.spindle,
            }}
          ></div>
          <p
            className="font-roboto color-animation"
            style={{
              marginTop: "9px",
              color: hoveringLocked ? Colors.white : Colors.spindle,
            }}
          >
            {Format.formatNoDigit(lockedPercent)}%
          </p>
        </div>
      </div>
      <div
        className="absolute top-5 -right-1"
        style={
          {
            // Use this when the burn is big enough
            // width: `${fractionBurnedPercent}%`
          }
        }
        onMouseEnter={() => onHoverBurned(true)}
        onMouseLeave={() => onHoverBurned(false)}
      >
        <img
          className="relative"
          src="/flame-base.svg"
          alt="flame emoji, signifying ETH burned"
        />
        <img
          className="absolute top-0 link-animation"
          style={{
            opacity: hoveringBurned ? 1 : 0,
            // visibility: hoveringBurned ? "visible" : "hidden",
          }}
          src="/flame-highlight.svg"
          alt="flame emoji, signifying ETH burned"
        />
      </div>
    </div>
  );
};

const mEthFromWei = (num: JSBI) =>
  pipe(
    num,
    (num) => JSBI.toNumber(num),
    Format.ethFromWei,
    (num) => num / 10 ** 6
  );

const floorOneDigit = (num: number) =>
  pipe(
    num,
    (num) => num * 10,
    Math.floor,
    (num) => num / 10
  );

const mEthFromWeiFormatted = (num: JSBI): string =>
  pipe(num, mEthFromWei, floorOneDigit, Format.formatOneDigit);

const mEthFromEthFormatted = (num: number): string =>
  pipe(num, (num) => num / 10 ** 6, floorOneDigit, Format.formatOneDigit);

type EngineRowProps = {
  amountFormatted: string;
  hovering: boolean;
  link: string;
  name: string;
  setHovering: (hovering: boolean) => void;
  startedOn: Date;
};

const EngineRow: FC<EngineRowProps> = ({
  amountFormatted,
  hovering,
  link,
  name,
  setHovering,
  startedOn,
}) => (
  <a
    className="grid grid-cols-3 link-animation"
    onMouseEnter={() => setHovering(true)}
    onMouseLeave={() => setHovering(false)}
    style={{ opacity: hovering ? 0.6 : 1 }}
    href={link}
    target="_blank"
    rel="noreferrer"
  >
    <span className="font-inter text-white">{name}</span>
    <Amount className="text-right" unitPrefix="M" unit="eth">
      {amountFormatted}
    </Amount>
    <Amount className="text-right" unit="months">
      {
        DateFns.formatDistanceStrict(startedOn, new Date(), {
          unit: "month",
        }).split(" ")[0]
      }
    </Amount>
  </a>
);

const Scarcity: FC = () => {
  const scarcity = useScarcity();
  const [hoveringStaked, setHoveringStaked] = useState(false);
  const [hoveringLocked, setHoveringLocked] = useState(false);
  const [hoveringBurned, setHoveringBurned] = useState(false);

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
            <EngineRow
              amountFormatted={mEthFromWeiFormatted(
                scarcity.engines.staked.amount
              )}
              hovering={hoveringStaked}
              link="https://beaconcha.in/charts/staked_ether"
              name="staking"
              setHovering={setHoveringStaked}
              startedOn={scarcity.engines.staked.startedOn}
            />
            <EngineRow
              amountFormatted={mEthFromEthFormatted(
                scarcity.engines.locked.amount
              )}
              hovering={hoveringLocked}
              link="https://defipulse.com/"
              name="defi"
              setHovering={setHoveringLocked}
              startedOn={scarcity.engines.locked.startedOn}
            />
            <EngineRow
              amountFormatted={mEthFromWeiFormatted(
                scarcity.engines.burned.amount
              )}
              hovering={hoveringBurned}
              link="https://dune.xyz/cembar/ETH-Burned"
              name="burn"
              setHovering={setHoveringBurned}
              startedOn={scarcity.engines.burned.startedOn}
            />
          </>
        )}
      </div>
    </WidgetBackground>
  );
};

export default Scarcity;
