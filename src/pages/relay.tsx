import type { FC } from "react";
import Head from "next/head";
import * as D from "date-fns";
import * as Api from "../relay/api";
import BasicErrorBoundary from "../components/BasicErrorBoundary";
import RelayDashboard, {
  type RelayDashboardProps,
} from "../relay/components/RelayDashboard";

export const getServerSideProps = async () => {
  const [payloads, payloadCount, validators, validatorCount] =
    await Promise.all([
      Api.fetchPayloads(),
      Api.fetchPayloadCount(),
      Api.fetchValidators(),
      Api.fetchValidatorCount(),
    ]);

  return {
    props: { payloads, payloadCount, validators, validatorCount },
  };
};

const RelayIndexPage: FC<RelayDashboardProps> = ({
  payloadCount,
  payloads,
  validatorCount,
  validators,
}) => {
  const payloadsSorted = payloads
    .map((p) => ({ ...p, insertedAt: new Date(p.insertedAt) }))
    .sort(({ insertedAt: a }, { insertedAt: b }) => D.compareDesc(a, b));
  const validatorsSorted = validators
    .map((v) => ({
      ...v,
      insertedAt: new Date(v.insertedAt),
    }))
    .sort(({ insertedAt: a }, { insertedAt: b }) => D.compareDesc(a, b));

  const props = {
    payloadCount,
    payloads: payloadsSorted,
    validatorCount,
    validators: validatorsSorted,
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
        <script
          defer
          data-domain="relay.ultrasound.money"
          src="https://plausible.io/js/script.js"
        ></script>
      </Head>
      <RelayDashboard {...props} />
    </BasicErrorBoundary>
  );
};

export default RelayIndexPage;
