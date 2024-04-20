import type { FC } from "react";
import { useCallback } from "react";
import { useState } from "react";
import Section from "../../../components/Section";
import LabelText from "../../../components/TextsNext/LabelText";
import TimeFrameControl from "../../../components/TimeFrameControl";
import { A, flow, N, OrdM, pipe } from "../../../fp";
import type { BuilderCensorshipPerTimeFrame } from "../../api/censorship/builders";
import type { LidoOperatorCensorshipPerTimeFrame } from "../../api/censorship/lido_operators";
import type { RelayCensorshipPerTimeFrame } from "../../api/censorship/relays";
import type { SanctionsDelayPerTimeFrame } from "../../api/censorship/sanctions_delay";
import type { TransactionCensorshipPerTimeFrame } from "../../api/censorship/transaction_censorship";
import BuilderCensorshipWidget from "./BuilderCensorshipWidget";
import BuilderListWidget from "./BuilderListWidget";
import LidoOperatorCensorshipWidget from "./LidoOperatorCensorshipWidget";
import LidoOperatorListWidget from "./LidoOperatorListWidget";
import RelayCensorshipWidget from "./RelayCensorshipWidget";
import RelayListWidget from "./RelayListWidget";
import SanctionsDelayWidget from "./SanctionsDelayWidget";
import TopSanctionsDelaysWidget from "./TopSanctionsDelaysWidget";
import TransactionCensorshipListWidget from "./TransactionCensorshipListWidget";
import type { CensoredTransaction } from "./TransactionCensorshipWidget";
import TransactionCensorshipWidget from "./TransactionCensorshipWidget";

const byTookSecondsDesc = pipe(
  N.Ord,
  OrdM.reverse,
  OrdM.contramap((transaction: CensoredTransaction) => transaction.delayBlocks),
);

const topDelaysFromTransactions = flow(
  A.sort(byTookSecondsDesc),
  A.takeLeft(10),
);

type Props = {
  builderCensorshipPerTimeFrame: BuilderCensorshipPerTimeFrame;
  lidoOperatorCensorshipPerTimeFrame: LidoOperatorCensorshipPerTimeFrame;
  relayCensorshipPerTimeFrame: RelayCensorshipPerTimeFrame;
  sanctionsDelayPerTimeFrame: SanctionsDelayPerTimeFrame;
  transactionCensorshipPerTimeFrame: TransactionCensorshipPerTimeFrame;
};

const CensorshipSection: FC<Props> = ({
  builderCensorshipPerTimeFrame,
  lidoOperatorCensorshipPerTimeFrame,
  relayCensorshipPerTimeFrame,
  sanctionsDelayPerTimeFrame,
  transactionCensorshipPerTimeFrame,
}) => {
  const [timeFrame, setTimeFrame] = useState<"d7" | "d30">("d7");
  const builderCensorship = builderCensorshipPerTimeFrame[timeFrame];
  const relayCensorship = relayCensorshipPerTimeFrame[timeFrame];
  const lidoOperatorCensorship = lidoOperatorCensorshipPerTimeFrame[timeFrame];
  const transactionCensorship = transactionCensorshipPerTimeFrame[timeFrame];
  const sanctionsDelay = sanctionsDelayPerTimeFrame[timeFrame];
  const topDelays = topDelaysFromTransactions(
    transactionCensorship.transactions,
  );
  const sanctionedTransactionCount = sanctionsDelay.censored_count;

  const handleClickTimeFrame = useCallback(() => {
    setTimeFrame((timeFrame) => (timeFrame === "d7" ? "d30" : "d7"));
  }, []);

  return (
    <Section
      title="sanctions censorship"
      subtitle="not ultra sound"
      link="sanctions-censorship"
    >
      <div className="flex w-full justify-center rounded-lg bg-slateus-700 p-8">
        <div className="flex items-center gap-4">
          <LabelText>time frame</LabelText>
          <TimeFrameControl
            selectedTimeFrame={timeFrame}
            onSetTimeFrame={(timeFrame) =>
              // Tricky to type, but in version "censorship" only "d7" and "d30" are set.
              setTimeFrame(timeFrame as "d7" | "d30")
            }
            version="censorship"
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          {/* <RelayCensorshipWidget
            onClickTimeFrame={handleClickTimeFrame}
            relayCensorship={relayCensorship}
            timeFrame={timeFrame}
          /> */}
          <RelayListWidget
            relays={relayCensorship.relays}
            timeFrame={timeFrame}
          />
          <BuilderCensorshipWidget
            builderCensorship={builderCensorship}
            onClickTimeFrame={handleClickTimeFrame}
            timeFrame={timeFrame}
          />
          <BuilderListWidget builderGroups={builderCensorship.builderGroups} />
          <SanctionsDelayWidget
            onClickTimeFrame={handleClickTimeFrame}
            sanctionsDelay={sanctionsDelay}
            timeFrame={timeFrame}
          />
        </div>
        <div className="flex flex-col gap-4">
          <LidoOperatorCensorshipWidget
            lidoOperatorCensorship={lidoOperatorCensorship}
            onClickTimeFrame={handleClickTimeFrame}
            timeFrame={timeFrame}
          />
          <LidoOperatorListWidget
            lidoOperatorCensorship={lidoOperatorCensorship}
          />
          <TransactionCensorshipWidget
            onClickTimeFrame={handleClickTimeFrame}
            transactionCensorship={transactionCensorship}
            transactionCount={sanctionedTransactionCount}
            timeFrame={timeFrame}
          />
          <TransactionCensorshipListWidget
            onClickTimeFrame={handleClickTimeFrame}
            transactions={transactionCensorship.transactions}
            timeFrame={timeFrame}
          />
          <TopSanctionsDelaysWidget
            onClickTimeFrame={handleClickTimeFrame}
            topDelays={topDelays}
            timeFrame={timeFrame}
          />
        </div>
      </div>
    </Section>
  );
};

export default CensorshipSection;
