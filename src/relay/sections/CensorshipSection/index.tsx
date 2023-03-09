import type { FC } from "react";
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
import LidoOperatorCensorship from "./LidoOperatorCensorship";
import LidoOperatorList from "./LidoOperatorList";
import RelayCensorshipWidget from "./RelayCensorshipWidget";
import RelayListWidget from "./RelayListWidget";
import SanctionsDelayWidget from "./SanctionsDelayWidget";
import TransactionCensorshipList from "./TransactionCensorshipList";
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
            selectedTimeframe={timeFrame}
            onSetTimeFrame={() =>
              setTimeFrame((timeFrame) => (timeFrame === "d7" ? "d30" : "d7"))
            }
            version="censorship"
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <RelayCensorshipWidget
            relayCensorship={relayCensorship}
            timeFrame={timeFrame}
          />
          <RelayListWidget
            relays={relayCensorship.relays}
            timeFrame={timeFrame}
          />
        </div>
        <div className="flex flex-col gap-4">
          <LidoOperatorCensorship
            lidoOperatorCensorship={lidoOperatorCensorship}
            timeFrame={timeFrame}
          />
          <LidoOperatorList lidoOperatorCensorship={lidoOperatorCensorship} />
        </div>
        <div className="flex flex-col gap-4">
          <BuilderCensorshipWidget
            builderCensorship={builderCensorship}
            timeFrame="d7"
          />
          <BuilderListWidget builders={builderCensorship.builders} />
        </div>
        <div className="flex flex-col gap-4">
          <TransactionCensorshipWidget
            transactionCensorship={transactionCencorship}
            timeFrame={timeFrame}
          />
          <TransactionCensorshipList
            transactions={transactionCencorship.transactions}
            timeFrame={timeFrame}
          />
        </div>
        <SanctionsDelayWidget
          sanctionsDelay={sanctionsDelay}
          timeFrame={timeFrame}
        />
      </div>
    </Section>
  );
};

export default CensorshipSection;
