import { minutesToSeconds } from "date-fns";
import type { GetStaticProps, NextPage } from "next";
import type { BaseFeePerGas } from "../api/base-fee-per-gas";
import { fetchBaseFeePerGas } from "../api/base-fee-per-gas";
import type { EthPriceStats } from "../api/eth-price-stats";
import { fetchEthPriceStats } from "../api/eth-price-stats";
import type { EthSupplyF } from "../api/eth-supply";
import type { MergeEstimate } from "../api/merge-estimate";
import type { MergeStatus } from "../api/merge-status";
import { fetchMergeStatus } from "../api/merge-status";
import Dashboard from "../components/Dashboard";
import { getDomain } from "../config";

type StaticProps = {
  baseFeePerGas: BaseFeePerGas;
  ethPriceStats: EthPriceStats;
  ethSupplyF: EthSupplyF;
  mergeEstimate: MergeEstimate;
  mergeStatus: MergeStatus;
};

export const getStaticProps: GetStaticProps = async () => {
  const [meRes, esRes, baseFeePerGas, ethPriceStats, mergeStatus] =
    await Promise.all([
      // fetch(`${getDomain()}/api/v2/fees/total-difficulty-progress`),
      fetch(`${getDomain()}/api/v2/fees/merge-estimate`),
      fetch(`${getDomain()}/api/v2/fees/eth-supply-parts`),
      // fetch(`${getApiDomain()}/api/fees/scarcity`),
      fetchBaseFeePerGas(),
      fetchEthPriceStats(),
      fetchMergeStatus(),
    ]);
  // const tdpData = (await tdpRes.json()) as TotalDifficultyProgress;
  // const scData = (await scRes.json()) as Scarcity;
  // const gaData = (await gaRes.json()) as GroupedAnalysis1F;

  return {
    props: {
      baseFeePerGas,
      ethPriceStats,
      ethSupplyF: (await esRes.json()) as EthSupplyF,
      mergeEstimate: (await meRes.json()) as MergeEstimate,
      mergeStatus: mergeStatus,
      // groupedAnalysis1F: gaData,
      // scarcity: scData,
      // totalDifficultyProgress: tdpData,
    },
    // Should be the expected lifetime of the data which goes stale quickest.
    // Currently: mergeEstimate ~12s
    // Although merge estimate updates every block, it's good enough to update SSR every 1min.
    revalidate: minutesToSeconds(1),
  };
};

const IndexPage: NextPage<StaticProps> = ({
  baseFeePerGas,
  ethPriceStats,
  ethSupplyF,
  // groupedAnalysis1F,
  mergeEstimate,
  mergeStatus,
}) => (
  <Dashboard
    baseFeePerGas={baseFeePerGas}
    ethPriceStats={ethPriceStats}
    // groupedAnalysis1F={groupedAnalysis1F}
    ethSupplyF={ethSupplyF}
    mergeStatus={mergeStatus}
    mergeEstimate={mergeEstimate}
  />
);
export default IndexPage;
