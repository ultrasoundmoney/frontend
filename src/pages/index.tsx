import type { GetStaticProps, NextPage } from "next";
import type { EthSupplyF } from "../api/eth-supply";
import type { GroupedAnalysis1F } from "../api/grouped-analysis-1";
import type { MergeEstimate } from "../api/merge-estimate";
import type { TotalDifficultyProgress } from "../api/total-difficulty-progress";
import Dashboard from "../components/Dashboard";
import { getDomain } from "../config";
import * as Duration from "../duration";

type StaticProps = {
  ethSupplyF: EthSupplyF;
  // Experiment, this one updates frequently, might be a bad idea to include.
  // It's too big to include in SSR. It creates a huge json embedded in our html that needs to be parsed to hydrate which slows our first load. Consider cutting down the data in it, splitting the data in it over multiple endpoints, loading this data client side with suspense.
  groupedAnalysis1F: GroupedAnalysis1F;
  mergeEstimate: MergeEstimate;
  totalDifficultyProgress: TotalDifficultyProgress;
};

export const getStaticProps: GetStaticProps = async () => {
  const [tdpRes, meRes, esRes, gaRes] = await Promise.all([
    fetch(`${getDomain()}/api/v2/fees/total-difficulty-progress`),
    fetch(`${getDomain()}/api/v2/fees/merge-estimate`),
    fetch(`${getDomain()}/api/v2/fees/eth-supply`),
    // fetch(`${getApiDomain()}/api/fees/scarcity`),
    fetch(`${getDomain()}/api/fees/grouped-analysis-1`),
  ]);
  const tdpData = (await tdpRes.json()) as TotalDifficultyProgress;
  const meData = (await meRes.json()) as MergeEstimate;
  const esData = (await esRes.json()) as EthSupplyF;
  // const scData = (await scRes.json()) as Scarcity;
  const gaData = (await gaRes.json()) as GroupedAnalysis1F;

  return {
    props: {
      ethSupplyF: esData,
      groupedAnalysis1F: gaData,
      mergeEstimate: meData,
      // scarcity: scData,
      totalDifficultyProgress: tdpData,
    },
    // Should be the expected lifetime of the data which goes stale quickest.
    // Currently: mergeEstimate ~12s
    // Although merge estimate updates every block, it's good enough to update SSR every 10min.
    revalidate: Duration.secsFromMinutes(10),
  };
};

const IndexPage: NextPage<StaticProps> = ({
  ethSupplyF,
  groupedAnalysis1F,
  mergeEstimate,
  totalDifficultyProgress,
}) => (
  <Dashboard
    groupedAnalysis1F={groupedAnalysis1F}
    ethSupplyF={ethSupplyF}
    mergeEstimate={mergeEstimate}
    totalDifficultyProgress={totalDifficultyProgress}
  />
);
export default IndexPage;
