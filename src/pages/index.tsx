import { minutesToSeconds } from "date-fns";
import type { GetStaticProps, NextPage } from "next";
import { SWRConfig } from "swr";
import type { BaseFeePerGas } from "../api/base-fee-per-gas";
import { fetchBaseFeePerGas } from "../api/base-fee-per-gas";
import type { EthPriceStats } from "../api/eth-price-stats";
import { fetchEthPriceStats } from "../api/eth-price-stats";
import type { EthSupplyF } from "../api/eth-supply";
import { fetchEthSupplyParts } from "../api/eth-supply";
import type { MergeEstimate } from "../api/merge-estimate";
import { fetchMergeEstimate } from "../api/merge-estimate";
import type { MergeStatus } from "../api/merge-status";
import { fetchMergeStatus } from "../api/merge-status";
import type { ScarcityF } from "../api/scarcity";
import { fetchScarcity } from "../api/scarcity";
import BasicErrorBoundary from "../components/BasicErrorBoundary";
import Dashboard from "../components/Dashboard";

type StaticProps = {
  fallback: {
    "/api/fees/scarcity": ScarcityF;
    "/api/v2/fees/base-fee-per-gas": BaseFeePerGas;
    "/api/v2/fees/eth-price-stats": EthPriceStats;
    "/api/v2/fees/eth-supply-parts": EthSupplyF;
    "/api/v2/fees/merge-estimate": MergeEstimate;
    "/api/v2/fees/merge-status": MergeStatus;
  };
};

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const [
    mergeEstimate,
    ethSupplyF,
    baseFeePerGas,
    ethPriceStats,
    mergeStatus,
    scarcityF,
  ] = await Promise.all([
    // fetch(`${getDomain()}/api/v2/fees/total-difficulty-progress`),
    fetchMergeEstimate(),
    fetchEthSupplyParts(),
    // fetch(`${getApiDomain()}/api/fees/scarcity`),
    fetchBaseFeePerGas(),
    fetchEthPriceStats(),
    fetchMergeStatus(),
    fetchScarcity(),
  ]);
  // const tdpData = (await tdpRes.json()) as TotalDifficultyProgress;
  // const scData = (await scRes.json()) as Scarcity;
  // const gaData = (await gaRes.json()) as GroupedAnalysis1F;

  if ("error" in mergeEstimate) {
    throw mergeEstimate.error;
  }

  if ("error" in ethSupplyF) {
    throw ethSupplyF.error;
  }

  if ("error" in baseFeePerGas) {
    throw baseFeePerGas.error;
  }

  if ("error" in ethPriceStats) {
    throw ethPriceStats.error;
  }

  if ("error" in mergeStatus) {
    throw mergeStatus.error;
  }

  if ("error" in scarcityF) {
    throw scarcityF.error;
  }

  return {
    props: {
      fallback: {
        "/api/fees/scarcity": scarcityF.data,
        "/api/v2/fees/base-fee-per-gas": baseFeePerGas.data,
        "/api/v2/fees/eth-price-stats": ethPriceStats.data,
        "/api/v2/fees/eth-supply-parts": ethSupplyF.data,
        "/api/v2/fees/merge-estimate": mergeEstimate.data,
        "/api/v2/fees/merge-status": mergeStatus.data,
      },
    },
    // Should be the expected lifetime of the data which goes stale quickest.
    // Currently: mergeEstimate ~12s
    // Although merge estimate updates every block, it's good enough to update SSR every 1min.
    revalidate: minutesToSeconds(1),
  };
};

const IndexPage: NextPage<StaticProps> = ({ fallback }) => (
  <BasicErrorBoundary>
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <Dashboard />
    </SWRConfig>
  </BasicErrorBoundary>
);
export default IndexPage;
