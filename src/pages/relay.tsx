import { minutesToSeconds } from "date-fns";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import BasicErrorBoundary from "../components/BasicErrorBoundary";
import { pipe, T, TAlt } from "../fp";
import type { ApiPayload, ApiPayloadStats, ApiValidator } from "../relay/api";
import * as Api from "../relay/api";
import RelayDashboard from "../relay/RelayDashboard";
import type { Builder, ValidatorStats } from "../relay/types";
import {
  parsePayload,
  parsePayloadStats,
  parseValidator,
} from "../relay/types";

type StaticProps = {
  payloadStats: ApiPayloadStats;
  payloads: Array<ApiPayload>;
  topPayloads: Array<ApiPayload>;
  validatorStats: ValidatorStats;
  validators: Array<ApiValidator>;
  topBuilders: Array<Builder>;
};

export const getStaticProps: GetStaticProps<StaticProps> = pipe(
  TAlt.sequenceStruct({
    payloads: Api.fetchPayloads,
    topPayloads: Api.fetchTopPayloads,
    payloadStats: Api.fetchPayloadStats,
    validators: Api.fetchValidators,
    validatorStats: Api.fetchValidatorStats,
    topBuilders: Api.fetchTopBuilders,
  }),
  T.map((props) => ({
    props,
    revalidate: minutesToSeconds(2),
  })),
);

const RelayIndexPage: NextPage<StaticProps> = ({
  payloadStats,
  payloads,
  topPayloads,
  validatorStats,
  validators,
  topBuilders,
}) => {
  const props = {
    payloadStats: parsePayloadStats(payloadStats),
    payloads: payloads.map(parsePayload),
    topPayloads: topPayloads.map(parsePayload),
    validatorStats,
    validators: validators.map(parseValidator),
    topBuilders,
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
      <RelayDashboard {...props} />
    </BasicErrorBoundary>
  );
};

export default RelayIndexPage;
