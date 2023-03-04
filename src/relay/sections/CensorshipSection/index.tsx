import type { FC } from "react";
import Section from "../../../components/Section";
import type { LidoOperatorCensorshipPerTimeFrame } from "../../censorship-data/lido_operator_censorship";
import type { RelayCensorshipPerTimeFrame } from "../../censorship-data/relay_censorship";
// import BuilderCensorshipWidget from "./BuilderCensorshipWidget";
// import BuilderListWidget from "./BuilderListWidget";
import LidoOperatorCensorship from "./LidoOperatorCensorship";
import LidoOperatorList from "./LidoOperatorList";
import RelayCensorshipWidget from "./RelayCensorshipWidget";
import RelayListWidget from "./RelayListWidget";
// import TransactionCensorshipList from "./TransactionCensorshipList";
// import TransactionCensorshipWidget from "./TransactionCensorshipWidget";

type Props = {
  lidoOperatorCensorshipPerTimeFrame: LidoOperatorCensorshipPerTimeFrame;
  relayCensorshipPerTimeFrame: RelayCensorshipPerTimeFrame;
};

const CensorshipSection: FC<Props> = ({
  lidoOperatorCensorshipPerTimeFrame,
  relayCensorshipPerTimeFrame,
}) => {
  const timeFrame = "d7";
  const relayCensorship = relayCensorshipPerTimeFrame[timeFrame];
  const lidoOperatorCensorship = lidoOperatorCensorshipPerTimeFrame[timeFrame];

  return (
    <Section
      title="sanctions censorship"
      subtitle="not ultra sound"
      link="sanctions-censorship"
    >
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <RelayCensorshipWidget
            relayCensorship={relayCensorship}
            timeFrame="d7"
          />
          <RelayListWidget relays={relayCensorship.relays} timeFrame="d7" />
        </div>
        <div className="flex flex-col gap-4">
          <LidoOperatorCensorship
            lidoOperatorCensorship={lidoOperatorCensorship}
            timeFrame="d7"
          />
          <LidoOperatorList lidoOperatorCensorship={lidoOperatorCensorship} />
        </div>
        {/* <div className="flex flex-col gap-4"> */}
        {/*   <BuilderCensorshipWidget timeFrame="d1" /> */}
        {/*   <BuilderListWidget timeFrame="d1" /> */}
        {/* </div> */}
        {/* <div className="flex flex-col gap-4"> */}
        {/*   <TransactionCensorshipWidget timeFrame="d1" /> */}
        {/*   <TransactionCensorshipList timeFrame="d1" /> */}
        {/* </div> */}
      </div>
    </Section>
  );
};

export default CensorshipSection;
