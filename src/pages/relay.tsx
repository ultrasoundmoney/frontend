import { minutesToSeconds } from "date-fns";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import BasicErrorBoundary from "../components/BasicErrorBoundary";
import { pipe, T, TAlt } from "../fp";
import type { ApiPayload, ApiPayloadStats, ApiValidator } from "../relay/api";
import * as Api from "../relay/api";
import type { BuilderCensorshipPerTimeFrame } from "../relay/censorship-data/builder_censorship";
import { builderCensorshipPerTimeFrame as builderCensorshipPerTimeFrameData } from "../relay/censorship-data/builder_censorship";
import type { InclusionTimesPerTimeFrame } from "../relay/censorship-data/inclusion_times";
import { suboptimalInclusionsPerTimeFrame as inclusionTimesPerTimeFrameData } from "../relay/censorship-data/inclusion_times";
import type { LidoOperatorCensorshipPerTimeFrame } from "../relay/censorship-data/lido_operator_censorship";
import { lidoOperatorCensorshipPerTimeFrame as lidoOperatorCensorshipPerTimeFrameData } from "../relay/censorship-data/lido_operator_censorship";
import type { RelayCensorshipPerTimeFrame } from "../relay/censorship-data/relay_censorship";
import { relayCensorshipPerTimeFrame as relayCensorshipPerTimeFrameData } from "../relay/censorship-data/relay_censorship";
import type { SanctionsDelayPerTimeFrame } from "../relay/censorship-data/sanctions_delay";
import { sanctionsDelayPerTimeFrame as sanctionsDelayPerTimeFrameData } from "../relay/censorship-data/sanctions_delay";
import type { SuboptimalInclusionsPerTimeFrame } from "../relay/censorship-data/suboptimal_inclusions";
import { suboptimalInclusionsPerTimeFrame as suboptimalInclusionsPerTimeFrameData } from "../relay/censorship-data/suboptimal_inclusions";
import type { TransactionCensorshipPerTimeFrame } from "../relay/censorship-data/transaction_censorship";
import { transactionCensorshipPerTimeFrame as transactionCensorshipPerTimeFrameData } from "../relay/censorship-data/transaction_censorship";
import RelayDashboards from "../relay/RelayDashboards";
import type { Builder, ValidatorStats } from "../relay/types";
import {
  parsePayload,
  parsePayloadStats,
  parseValidator,
} from "../relay/types";

type StaticProps = {
  builderCensorshipPerTimeFrame: BuilderCensorshipPerTimeFrame;
  inclusionTimesPerTimeFrame: InclusionTimesPerTimeFrame;
  lidoOperatorCensorshipPerTimeFrame: LidoOperatorCensorshipPerTimeFrame;
  payloadStats: ApiPayloadStats;
  payloads: Array<ApiPayload>;
  relayCensorshipPerTimeFrame: RelayCensorshipPerTimeFrame;
  sanctionsDelayPerTimeFrame: SanctionsDelayPerTimeFrame;
  suboptimalInclusionsPerTimeFrame: SuboptimalInclusionsPerTimeFrame;
  transactionCensorshipPerTimeFrame: TransactionCensorshipPerTimeFrame;
  topBuilders: Array<Builder>;
  topPayloads: Array<ApiPayload>;
  validatorStats: ValidatorStats;
  validators: Array<ApiValidator>;
};

export const getStaticProps: GetStaticProps<StaticProps> = pipe(
  TAlt.sequenceStruct({
    payloadStats: Api.fetchPayloadStats,
    payloads: Api.fetchPayloads,
    topBuilders: Api.fetchTopBuilders,
    topPayloads: Api.fetchTopPayloads,
    validatorStats: Api.fetchValidatorStats,
    validators: Api.fetchValidators,
  }),
  T.map((props) => ({
    props: {
      builderCensorshipPerTimeFrame: builderCensorshipPerTimeFrameData,
      inclusionTimesPerTimeFrame: inclusionTimesPerTimeFrameData,
      lidoOperatorCensorshipPerTimeFrame:
        lidoOperatorCensorshipPerTimeFrameData,
      relayCensorshipPerTimeFrame: relayCensorshipPerTimeFrameData,
      sanctionsDelayPerTimeFrame: sanctionsDelayPerTimeFrameData,
      suboptimalInclusionsPerTimeFrame: suboptimalInclusionsPerTimeFrameData,
      transactionCensorshipPerTimeFrame: transactionCensorshipPerTimeFrameData,
      ...props,
    },
    revalidate: minutesToSeconds(2),
  })),
);

const RelayIndexPage: NextPage<StaticProps> = ({
  builderCensorshipPerTimeFrame,
  inclusionTimesPerTimeFrame,
  lidoOperatorCensorshipPerTimeFrame,
  payloadStats,
  payloads,
  relayCensorshipPerTimeFrame,
  sanctionsDelayPerTimeFrame,
  suboptimalInclusionsPerTimeFrame,
  topBuilders,
  topPayloads,
  transactionCensorshipPerTimeFrame,
  validatorStats,
  validators,
}) => {
  const props = {
    builderCensorshipPerTimeFrame,
    inclusionTimesPerTimeFrame,
    lidoOperatorCensorshipPerTimeFrame,
    payloadStats: parsePayloadStats(payloadStats),
    payloads: payloads.map(parsePayload),
    relayCensorshipPerTimeFrame,
    sanctionsDelayPerTimeFrame,
    suboptimalInclusionsPerTimeFrame,
    topBuilders,
    topPayloads: topPayloads.map(parsePayload),
    transactionCensorshipPerTimeFrame,
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
