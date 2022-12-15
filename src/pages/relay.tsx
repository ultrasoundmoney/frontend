import { FC } from "react";
import Head from "next/head";
import * as D from "date-fns";
import { getApiUrl } from "../relay/config";
import BasicErrorBoundary from "../components/BasicErrorBoundary";
import RelayDashboard, {
  RelayDashboardProps,
} from "../relay/components/RelayDashboard";

export const getServerSideProps = async () => {
  const apiUrl = getApiUrl();
  const [payloads, payloadCount, validators, validatorCount] =
    await Promise.all([
      fetch(`${apiUrl}/api/payloads`)
        .then((res) => res.json())
        .then(({ payloads }) => payloads)
        .catch((err) => {
          console.error("error fetching payloads", err);
          return [];
        }),
      fetch(`${apiUrl}/api/payloads/count`)
        .then((res) => res.json())
        .then(({ count }) => count)
        .catch((err) => {
          console.error("error fetching payload count", err);
          return 0;
        }),
      fetch(`${apiUrl}/api/validators`)
        .then((res) => res.json())
        .then(({ validators }) => validators)
        .catch((err) => {
          console.error("error fetching validators", err);
          return [];
        }),
      fetch(`${apiUrl}/api/validators/count`)
        .then((res) => res.json())
        .then(({ validatorCount }) => validatorCount)
        .catch((err) => {
          console.error("error fetching validator count", err);
          return 0;
        }),
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
      </Head>
      <RelayDashboard {...props} />
    </BasicErrorBoundary>
  );
};

export default RelayIndexPage;
