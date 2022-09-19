import type { GetStaticProps, NextPage } from "next";
import "react-loading-skeleton/dist/skeleton.css";
import type { BaseFeePerGas } from "../api/base-fee-per-gas";
import { fetchBaseFeePerGas } from "../api/base-fee-per-gas";
import type { EthPriceStats } from "../api/eth-price-stats";
import { fetchEthPriceStats } from "../api/eth-price-stats";
import type { FamCount } from "../api/fam-count";
import { fetchFamCount } from "../api/fam-count";
import BasicErrorBoundary from "../components/BasicErrorBoundary";
import FamPage from "../components/FamPage";
import * as Duration from "../duration";

export const getStaticProps: GetStaticProps = async () => {
  const [baseFeePerGas, ethPriceStats, famCount] = await Promise.all([
    fetchBaseFeePerGas(),
    fetchEthPriceStats(),
    fetchFamCount(),
  ]);

  if ("error" in famCount) {
    throw famCount.error;
  }

  return {
    props: {
      baseFeePerGas,
      ethPriceStats,
      famCount: famCount.data,
    },
    revalidate: Duration.secsFromMinutes(10),
  };
};

type StaticProps = {
  baseFeePerGas: BaseFeePerGas;
  ethPriceStats: EthPriceStats;
  famCount: FamCount;
};

const WrappedFamPage: NextPage<StaticProps> = ({
  baseFeePerGas,
  ethPriceStats,
  famCount,
}) => (
  <BasicErrorBoundary>
    <FamPage
      famCount={famCount}
      baseFeePerGas={baseFeePerGas}
      ethPriceStats={ethPriceStats}
    />
  </BasicErrorBoundary>
);

export default WrappedFamPage;
