import type { FC } from "react";
import { useCallback } from "react";
import { useState } from "react";
import Section from "../../../components/Section";
import LabelText from "../../../components/TextsNext/LabelText";
import TimeFrameControl from "../../../components/TimeFrameControl";
import type { BuilderCensorshipPerTimeFrame } from "../../censorship-data/builder_censorship";
import type { LidoOperatorCensorshipPerTimeFrame } from "../../censorship-data/lido_operator_censorship";
import type { RelayCensorshipPerTimeFrame } from "../../censorship-data/relay_censorship";
import type { SanctionsDelayPerTimeFrame } from "../../censorship-data/sanctions_delay";
import type { TransactionCensorshipPerTimeFrame } from "../../censorship-data/transaction_censorship";
import BuilderCensorshipWidget from "./BuilderCensorshipWidget";
import BuilderListWidget from "./BuilderListWidget";
import LidoOperatorCensorshipWidget from "./LidoOperatorCensorshipWidget";
import LidoOperatorListWidget from "./LidoOperatorListWidget";
import RelayCensorshipWidget from "./RelayCensorshipWidget";
import RelayListWidget from "./RelayListWidget";
import SanctionsDelayWidget from "./SanctionsDelayWidget";
import TransactionCensorshipListWidget from "./TransactionCensorshipListWidget";
import TransactionCensorshipWidget from "./TransactionCensorshipWidget";

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
  const transactionCencorship = transactionCensorshipPerTimeFrame[timeFrame];
  const sanctionsDelay = sanctionsDelayPerTimeFrame[timeFrame];

  const handleClickTimeFrame = useCallback(() => {
    setTimeFrame((timeFrame) => (timeFrame === "d7" ? "d30" : "d7"));
  }, []);

  return (
    <Section
      title="sanctions censorship"
      subtitle="not ultra sound"
      link="sanctions-censorship"
    >
      <div className="flex justify-center p-8 w-full rounded-lg bg-slateus-700">
        <div className="flex gap-4 items-center">
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
      <div className="grid grid-cols-1 gap-4 w-full lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <RelayCensorshipWidget
            onClickTimeFrame={handleClickTimeFrame}
            relayCensorship={relayCensorship}
            timeFrame={timeFrame}
          />
          <RelayListWidget
            relays={relayCensorship.relays}
            timeFrame={timeFrame}
          />
          <BuilderCensorshipWidget
            builderCensorship={builderCensorship}
            onClickTimeFrame={handleClickTimeFrame}
            timeFrame={timeFrame}
          />
          <BuilderListWidget builders={builderCensorship.builders} />
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
            transactionCensorship={transactionCencorship}
            timeFrame={timeFrame}
          />
          <TransactionCensorshipListWidget
            onClickTimeFrame={handleClickTimeFrame}
            transactions={transactionCencorship.transactions}
            timeFrame={timeFrame}
          />
        </div>
      </div>
    </Section>
  );
};

export default CensorshipSection;
