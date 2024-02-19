import type { FC } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import colors from "../colors";
import AdminTools from "../components/AdminTools";
import BasicErrorBoundary from "../components/BasicErrorBoundary";
import HeaderGlow from "../components/HeaderGlow";
import MainTitle from "../components/MainTitle";
import * as SharedConfig from "../config";
import { FeatureFlagsContext, useFeatureFlags } from "../feature-flags";
import ContactSection from "../sections/ContactSection";
import type { BuilderCensorshipPerTimeFrame } from "./api/censorship/builders";
import type { InclusionTimesPerTimeFrame } from "./api/censorship/inclusion_times";
import type { LidoOperatorCensorshipPerTimeFrame } from "./api/censorship/lido_operators";
import type { SanctionsDelayPerTimeFrame } from "./api/censorship/sanctions_delay";
import type { TransactionCensorshipPerTimeFrame } from "./api/censorship/transaction_censorship";
import type { RecentDelayedTransactionsPerTimeFrame } from "./api/inclusion-delays/recent_delayed_transactions";
import type { SuboptimalInclusionsPerTimeFrame } from "./api/inclusion-delays/suboptimal_inclusions";
import AddressWidget from "./components/AddressWidget";
import CheckRegistrationWidget from "./components/CheckRegistrationWidget";
import InclusionsWidget from "./components/InclusionsWidget";
import ValidatorWidget from "./components/ValidatorWidget";
import LeaderboardSection from "./sections/LeaderboardSection";
import CensorshipSection from "./sections/CensorshipSection";
import type { RelayCensorship } from "./sections/CensorshipSection/RelayCensorshipWidget";
import FaqSection from "./sections/FaqSection";
import InclusionDelaySection from "./sections/InclusionDelaySection";
import type {
  Builder,
  Payload,
  PayloadStats,
  Validator,
  ValidatorStats,
} from "./types";

export type RelayDashboardProps = {
  builderCensorshipPerTimeFrame: BuilderCensorshipPerTimeFrame;
  inclusionTimesPerTimeFrame: InclusionTimesPerTimeFrame;
  lidoOperatorCensorshipPerTimeFrame: LidoOperatorCensorshipPerTimeFrame;
  payloadStats: PayloadStats;
  payloads: Array<Payload>;
  recentDelayedTransactionsPerTimeFrame: RecentDelayedTransactionsPerTimeFrame;
  relayCensorshipPerTimeFrame: Record<"d7" | "d30", RelayCensorship>;
  sanctionsDelayPerTimeFrame: SanctionsDelayPerTimeFrame;
  suboptimalInclusionsPerTimeFrame: SuboptimalInclusionsPerTimeFrame;
  topBuilders: Array<Builder>;
  topPayloads: Array<Payload>;
  transactionCensorshipPerTimeFrame: TransactionCensorshipPerTimeFrame;
  validatorStats: ValidatorStats;
  validators: Array<Validator>;
};

const env = SharedConfig.envFromEnv();

const RelayDashboard: FC<RelayDashboardProps> = ({
  builderCensorshipPerTimeFrame,
  inclusionTimesPerTimeFrame,
  lidoOperatorCensorshipPerTimeFrame,
  payloadStats,
  payloads,
  recentDelayedTransactionsPerTimeFrame,
  relayCensorshipPerTimeFrame,
  sanctionsDelayPerTimeFrame,
  suboptimalInclusionsPerTimeFrame,
  topBuilders,
  topPayloads,
  transactionCensorshipPerTimeFrame,
  validatorStats,
  validators,
}) => {
  const { featureFlags, setFlag } = useFeatureFlags();

  return (
    <FeatureFlagsContext.Provider value={featureFlags}>
      <SkeletonTheme
        baseColor={colors.slateus500}
        highlightColor="#565b7f"
        enableAnimation={true}
      >
        <HeaderGlow />
        <div className="container mx-auto">
          <BasicErrorBoundary>
            <AdminTools setFlag={setFlag} />
          </BasicErrorBoundary>
          <div className="h-[48.5px] md:h-[68px]"></div>
          <MainTitle>ultra sound relay</MainTitle>
          {env === "stag" ? (
            <div
              className={`
              mt-4 text-center font-inter text-xl
              font-extralight tracking-wide
              text-slateus-400 sm:mt-0
            `}
            >
              holesky testnet
            </div>
          ) : null}
          <div className="flex flex-col gap-y-4 mt-16 mb-32 md:px-16 xs:px-4">
            <div className="flex flex-col gap-x-4 gap-y-4 mt-16 lg:flex-row">
              <div className="flex lg:w-1/2">
                <AddressWidget />
              </div>
              <div className="flex lg:w-1/2">
                <CheckRegistrationWidget />
              </div>
            </div>
            <div className="flex flex-col gap-x-4 gap-y-4 lg:flex-row">
              <div className="flex flex-col lg:w-1/2">
                <InclusionsWidget
                  payloadCount={payloadStats.count}
                  totalValue={payloadStats.totalValue}
                  firstPayloadAt={new Date(payloadStats.firstPayloadAt)}
                  payloads={payloads}
                />
              </div>
              <div className="flex flex-col lg:w-1/2">
                <ValidatorWidget {...validatorStats} validators={validators} />
              </div>
            </div>
          </div>
          <LeaderboardSection
            payloadCount={payloadStats.count}
            topBuilders={topBuilders}
            topPayloads={topPayloads}
          />
          <CensorshipSection
            builderCensorshipPerTimeFrame={builderCensorshipPerTimeFrame}
            lidoOperatorCensorshipPerTimeFrame={
              lidoOperatorCensorshipPerTimeFrame
            }
            relayCensorshipPerTimeFrame={relayCensorshipPerTimeFrame}
            sanctionsDelayPerTimeFrame={sanctionsDelayPerTimeFrame}
            transactionCensorshipPerTimeFrame={
              transactionCensorshipPerTimeFrame
            }
          />
          <InclusionDelaySection
            inclusionTimesPerTimeFrame={inclusionTimesPerTimeFrame}
            recentDelayedTransactionsPerTimeFrame={
              recentDelayedTransactionsPerTimeFrame
            }
            suboptimalInclusionsPerTimeFrame={suboptimalInclusionsPerTimeFrame}
          />
          <FaqSection />
          <ContactSection />
        </div>
      </SkeletonTheme>
    </FeatureFlagsContext.Provider>
  );
};

export default RelayDashboard;
