import { minutesToSeconds } from "date-fns";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import BasicErrorBoundary from "../components/BasicErrorBoundary";
import { pipe, T, TAlt } from "../fp";
import type { ApiPayload, ApiPayloadStats, ApiValidator } from "../relay/api";
import * as Api from "../relay/api";
import RelayDashboards from "../relay/RelayDashboards";
import type { ValidatorStats } from "../relay/types";
import {
  parsePayload,
  parsePayloadStats,
  parseValidator,
} from "../relay/types";

type StaticProps = {
  payloadStats: ApiPayloadStats;
  payloads: Array<ApiPayload>;
  validatorStats: ValidatorStats;
  validators: Array<ApiValidator>;
};

export const getStaticProps: GetStaticProps<StaticProps> = pipe(
  TAlt.sequenceStructPar({
    payloadStats: Api.fetchPayloadStats,
    payloads: Api.fetchPayloads,
    validatorStats: Api.fetchValidatorStats,
    validators: Api.fetchValidators,
  }),
  T.map((props) => ({
    props,
    revalidate: minutesToSeconds(2),
  })),
);

const RelayIndexPage: NextPage<StaticProps> = ({
  payloadStats,
  payloads,
  validatorStats,
  validators,
}) => {
  const props = {
    payloadStats: parsePayloadStats(payloadStats),
    payloads: payloads.map(parsePayload),
    validatorStats,
    validators: validators.map(parseValidator),
  };

  return (
    <BasicErrorBoundary>
      <Head>
        <title>Ultra Sonic Relay</title>
        <meta property="og:title" content="Ultra Sonic Relay" />
        <meta
          name="description"
          content="Permissionless, neutral, and censorship free MEV relay"
        />
        <meta
          name="keywords"
          content="ultra sonic relay, ethereum, ETH, MEV, MEV Boost Relay"
        />
        <meta
          property="og:description"
          content="Permissionless, neutral, and censorship free MEV relay"
        />
        <meta property="og:url" content="https://relay.ultrasonic.money" />
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
