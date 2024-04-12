import { minutesToSeconds } from "date-fns";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import BasicErrorBoundary from "../components/BasicErrorBoundary";
import { pipe, T, TAlt } from "../fp";
import type { ApiPayload, ApiPayloadStats, ApiValidator } from "../relay/api";
import * as Api from "../relay/api";
import type { BuilderCensorshipPerTimeFrame } from "../relay/api/censorship/builders";
// import { fetchBuilderCensorshipPerTimeFrame } from "../relay/api/censorship/builders";
import type { InclusionTimesPerTimeFrame } from "../relay/api/censorship/inclusion_times";
// import { fetchInclusionTimesPerTimeFrame } from "../relay/api/censorship/inclusion_times";
import type { LidoOperatorCensorshipPerTimeFrame } from "../relay/api/censorship/lido_operators";
// import { fetchLidoOperatorCensorshipPerTimeFrame } from "../relay/api/censorship/lido_operators";
import type { RecentDelayedTransactionsPerTimeFrame } from "../relay/api/inclusion-delays/recent_delayed_transactions";
// import { fetchRecentDelayedTransactionsPerTimeFrame } from "../relay/api/inclusion-delays/recent_delayed_transactions";
import type { RelayCensorshipPerTimeFrame } from "../relay/api/censorship/relays";
// import { fetchRelayCensorshipPerTimeFrame } from "../relay/api/censorship/relays";
import type { SanctionsDelayPerTimeFrame } from "../relay/api/censorship/sanctions_delay";
// import { fetchSanctionsDelayPerTimeFrame } from "../relay/api/censorship/sanctions_delay";
// import type { SuboptimalInclusionsPerTimeFrame } from "../relay/api/inclusion-delays/suboptimal_inclusions";
// import { fetchSuboptimalInclusionsPerTimeFrame } from "../relay/api/inclusion-delays/suboptimal_inclusions";
// import type { TransactionCensorshipPerTimeFrame } from "../relay/api/censorship/transaction_censorship";
// import { fetchTransactionCensorshipPerTimeFrame } from "../relay/api/censorship/transaction_censorship";
import RelayDashboards from "../relay/RelayDashboards";
import type { Builder, ValidatorStats } from "../relay/types";
import {
  parsePayload,
  parsePayloadStats,
  parseValidator,
} from "../relay/types";

type StaticProps = {
  // builderCensorshipPerTimeFrame: BuilderCensorshipPerTimeFrame;
  // inclusionTimesPerTimeFrame: InclusionTimesPerTimeFrame;
  // lidoOperatorCensorshipPerTimeFrame: LidoOperatorCensorshipPerTimeFrame;
  payloadStats: ApiPayloadStats;
  payloads: Array<ApiPayload>;
  // recentDelayedTransactionsPerTimeFrame: RecentDelayedTransactionsPerTimeFrame;
  // relayCensorshipPerTimeFrame: RelayCensorshipPerTimeFrame;
  // sanctionsDelayPerTimeFrame: SanctionsDelayPerTimeFrame;
  // suboptimalInclusionsPerTimeFrame: SuboptimalInclusionsPerTimeFrame;
  // transactionCensorshipPerTimeFrame: TransactionCensorshipPerTimeFrame;
  topBuilders: Array<Builder>;
  topPayloads: Array<ApiPayload>;
  validatorStats: ValidatorStats;
  validators: Array<ApiValidator>;
};

export const getStaticProps: GetStaticProps<StaticProps> = pipe(
  TAlt.sequenceStructPar({
    // builderCensorshipPerTimeFrame: fetchBuilderCensorshipPerTimeFrame,
    // inclusionTimesPerTimeFrame: fetchInclusionTimesPerTimeFrame,
    // lidoOperatorCensorshipPerTimeFrame: fetchLidoOperatorCensorshipPerTimeFrame,
    payloadStats: Api.fetchPayloadStats,
    payloads: Api.fetchPayloads,
    // recentDelayedTransactionsPerTimeFrame:
    //   fetchRecentDelayedTransactionsPerTimeFrame,
    // relayCensorshipPerTimeFrame: fetchRelayCensorshipPerTimeFrame,
    // sanctionsDelayPerTimeFrame: fetchSanctionsDelayPerTimeFrame,
    // suboptimalInclusionsPerTimeFrame: fetchSuboptimalInclusionsPerTimeFrame,
    topBuilders: Api.fetchTopBuilders,
    topPayloads: Api.fetchTopPayloads,
    // transactionCensorshipPerTimeFrame: fetchTransactionCensorshipPerTimeFrame,
    validatorStats: Api.fetchValidatorStats,
    validators: Api.fetchValidators,
  }),
  T.map((props) => ({
    props,
    revalidate: minutesToSeconds(2),
  })),
);

const RelayIndexPage: NextPage<StaticProps> = ({
  // builderCensorshipPerTimeFrame,
  // inclusionTimesPerTimeFrame,
  // lidoOperatorCensorshipPerTimeFrame,
  payloadStats,
  payloads,
  // recentDelayedTransactionsPerTimeFrame,
  // relayCensorshipPerTimeFrame,
  // sanctionsDelayPerTimeFrame,
  // suboptimalInclusionsPerTimeFrame,
  topBuilders,
  topPayloads,
  // transactionCensorshipPerTimeFrame,
  validatorStats,
  validators,
}) => {
  const props = {
    // builderCensorshipPerTimeFrame,
    // inclusionTimesPerTimeFrame,
    // lidoOperatorCensorshipPerTimeFrame,
    payloadStats: parsePayloadStats(payloadStats),
    payloads: payloads.map(parsePayload),
    // recentDelayedTransactionsPerTimeFrame,
    // relayCensorshipPerTimeFrame,
    // sanctionsDelayPerTimeFrame,
    // suboptimalInclusionsPerTimeFrame,
    topBuilders,
    topPayloads: topPayloads.map(parsePayload),
    // transactionCensorshipPerTimeFrame,
    validatorStats,
    validators: validators.map(parseValidator),
  };

  return (
    <BasicErrorBoundary>
      <Head>
        <title>Ultra Sound Relay</title>
        <meta property="og:title" content="Ultra Sound Relay" />
        <meta
          name="description"
          content="Permissionless, neutral, and censorship free MEV relay"
        />
        <meta
          name="keywords"
          content="ultra sound relay, ethereum, ETH, MEV, MEV Boost Relay"
        />
        <meta
          property="og:description"
          content="Permissionless, neutral, and censorship free MEV relay"
        />
        <meta property="og:url" content="https://relay.ultrasound.money" />
      </Head>
      <Script
        defer
        data-domain="relay.ultrasound.money"
        src="https://plausible.io/js/script.js"
      />
      <RelayDashboards {...props} />
    </BasicErrorBoundary>
  );
};

export default RelayIndexPage;
