import type { FC } from "react";
import Head from "next/head";
import Script from "next/script";
import * as Api from "../relay/api";
import type { ApiPayload, ApiPayloadStats, ApiValidator } from "../relay/api";
import {
  Payload,
  Builder,
  ValidatorStats,
  parsePayload,
  parseValidator,
  parsePayloadStats,
} from "../relay/types";
import BasicErrorBoundary from "../components/BasicErrorBoundary";
import RelayDashboard from "../relay/components/RelayDashboard";

export const getServerSideProps = async () => {
  const [
    payloads,
    topPayloads,
    payloadStats,
    validators,
    validatorStats,
    topBuilders,
  ] = await Promise.all([
    Api.fetchPayloads(),
    Api.fetchTopPayloads(),
    Api.fetchPayloadStats(),
    Api.fetchValidators(),
    Api.fetchValidatorStats(),
    Api.fetchTopBuilders(),
  ]);

  return {
    props: {
      payloads,
      topPayloads,
      payloadStats,
      validators,
      validatorStats,
      topBuilders,
    },
  };
};

type RelayPageProps = {
  payloadStats: ApiPayloadStats;
  payloads: Array<ApiPayload>;
  topPayloads: Array<ApiPayload>;
  validatorStats: ValidatorStats;
  validators: Array<ApiValidator>;
  topBuilders: Array<Builder>;
};

const RelayIndexPage: FC<RelayPageProps> = ({
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
