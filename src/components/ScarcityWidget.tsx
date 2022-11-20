import * as DateFns from "date-fns";
import JSBI from "jsbi";
import flow from "lodash/flow";
import type { FC } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useScarcity } from "../api/scarcity";
import Colors from "../colors";
import * as Format from "../format";
import { Amount, MoneyAmount } from "./Amount";
import { BaseText } from "./Texts";
import BodyText from "./TextsNext/BodyText";
import LabelText from "./TextsNext/LabelText";
import { WidgetBackground, WidgetTitle } from "./WidgetSubcomponents";

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

  return (
    <div className="relative select-none">
      <div className="flex h-28 items-center">
        <div
          className="color-animation absolute h-2 w-full rounded-full bg-fire"
          style={{
            backgroundColor: hoveringBurned
              ? Colors.fireHighlight
              : Colors.orange400,
          }}
          onMouseEnter={() => onHoverBurned(true)}
          onMouseLeave={() => onHoverBurned(false)}
        ></div>
        <div
          className="absolute h-2 rounded-full bg-slateus-500"
          style={{ width: `${totalSupplyPercent}%` }}
        ></div>
      </div>
      <div
        className="absolute top-0 left-0 flex h-28 flex-row items-center"
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
            className="color-animation h-2 w-full rounded-l-full bg-slateus-200"
            style={{
              backgroundColor: hoveringStaked
                ? Colors.white
                : Colors.slateus200,
            }}
          ></div>
          <BaseText
            font="font-roboto"
            className="color-animation mt-[12px] text-sm md:mt-[9px] md:text-base"
            style={{
              color: hoveringStaked ? Colors.white : Colors.slateus200,
            }}
          >
            {Format.formatZeroDecimals(stakedPercent)}%
          </BaseText>
        </div>
        <div
          className="absolute z-10 h-2 w-0.5 bg-slateus-500"
          style={{
            left: `${stakedPercent}%`,
          }}
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
            className="color-animation h-2 w-full rounded-r-full bg-slateus-200"
            style={{
              backgroundColor: hoveringLocked
                ? Colors.white
                : Colors.slateus200,
            }}
          ></div>
          <BaseText
            font="font-roboto"
            size="text-sm md:text-base"
            className="color-animation mt-[12px] md:mt-[9px]"
            style={{
              color: hoveringLocked ? Colors.white : Colors.slateus200,
            }}
          >
            {Format.formatZeroDecimals(lockedPercent)}%
          </BaseText>
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
          className="absolute top-0"
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

const mEthFromWei = flow(
  (num: JSBI) => JSBI.toNumber(num),
  Format.ethFromWei,
  (num) => num / 10 ** 6,
);

const floorOneDigit = flow(
  (num: number) => num * 10,
  Math.floor,
  (num) => num / 10,
);

const mEthFromWeiFormatted = flow(
  (num: JSBI) => num,
  mEthFromWei,
  floorOneDigit,
  Format.formatOneDecimal,
);

const mEthFromEthFormatted = flow(
  (num: number) => num,
  (num) => num / 10 ** 6,
  floorOneDigit,
  Format.formatOneDecimal,
);

type EngineRowProps = {
  amountFormatted: string;
  hovering: boolean;
  link: string;
  name: string;
  setHovering: (hovering: boolean) => void;
  startedOn: Date;
  now: Date;
};

const EngineRow: FC<EngineRowProps> = ({
  amountFormatted,
  hovering,
  link,
  name,
  setHovering,
  startedOn,
  now,
}) => (
  <a
    className="link-animation grid grid-cols-3"
    onMouseEnter={() => setHovering(true)}
    onMouseLeave={() => setHovering(false)}
    style={{ opacity: hovering ? 0.6 : 1 }}
    href={link}
    target="_blank"
    rel="noreferrer"
  >
    <BodyText>{name}</BodyText>
    <MoneyAmount className="text-right font-light" amountPostfix="M">
      {amountFormatted}
    </MoneyAmount>
    <Amount className="text-right" unitPostfix="years">
      {Format.formatOneDecimal(
        DateFns.differenceInDays(now, startedOn) / 365.25,
      )}
    </Amount>
  </a>
);

const ScarcityWidget: FC = () => {
  const scarcity = useScarcity();
  const [now, setNow] = useState<Date>();
  const [hoveringStaked, setHoveringStaked] = useState(false);
  const [hoveringLocked, setHoveringLocked] = useState(false);
  const [hoveringBurned, setHoveringBurned] = useState(false);

  useEffect(() => {
    setNow(new Date());
  }, []);

  return (
    <WidgetBackground>
      <WidgetTitle>scarcity</WidgetTitle>
      {scarcity === undefined ? (
        <div className="relative py-16">
          <div className="absolute h-2 w-full rounded-full bg-slateus-500"></div>
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
      <div className="flex flex-col gap-y-3">
        <div className="grid grid-cols-3">
          <LabelText>engine</LabelText>
          <LabelText className="text-right">amount</LabelText>
          <LabelText className="text-right">time span</LabelText>
        </div>
        {scarcity && now && (
          <>
            <EngineRow
              amountFormatted={mEthFromWeiFormatted(
                scarcity.engines.staked.amount,
              )}
              hovering={hoveringStaked}
              link="https://beaconcha.in/charts/staked_ether"
              name="staking"
              setHovering={setHoveringStaked}
              startedOn={scarcity.engines.staked.startedOn}
              now={now}
            />
            <EngineRow
              amountFormatted={mEthFromEthFormatted(
                scarcity.engines.locked.amount,
              )}
              hovering={hoveringLocked}
              link="https://defipulse.com/"
              name="defi (stale)"
              setHovering={setHoveringLocked}
              startedOn={scarcity.engines.locked.startedOn}
              now={now}
            />
            <EngineRow
              amountFormatted={mEthFromWeiFormatted(
                scarcity.engines.burned.amount,
              )}
              hovering={hoveringBurned}
              link="https://dune.xyz/cembar/ETH-Burned"
              name="burn"
              setHovering={setHoveringBurned}
              startedOn={scarcity.engines.burned.startedOn}
              now={now}
            />
          </>
        )}
      </div>
    </WidgetBackground>
  );
};

export default ScarcityWidget;
