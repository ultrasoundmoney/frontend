import type { GetStaticProps, NextPage } from "next";
import "react-loading-skeleton/dist/skeleton.css";
import { SWRConfig } from "swr";
import type { BaseFeePerGas } from "../api/base-fee-per-gas";
import { fetchBaseFeePerGas } from "../api/base-fee-per-gas";
import type { EthPriceStats } from "../api/eth-price-stats";
import { fetchEthPriceStats } from "../api/eth-price-stats";
import type { FamCount } from "../api/fam-count";
import { fetchFamCount } from "../api/fam-count";
import BasicErrorBoundary from "../components/BasicErrorBoundary";
import FamPage from "../components/FamPage";
import * as Duration from "../duration";

type StaticProps = {
  fallback: {
    "/api/v2/fees/base-fee-per-gas": BaseFeePerGas;
    "/api/v2/fees/eth-price-stats": EthPriceStats;
    "/api/v2/fam/count": FamCount;
  };
};

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const [baseFeePerGas, ethPriceStats, famCount] = await Promise.all([
    fetchBaseFeePerGas(),
    fetchEthPriceStats(),
    fetchFamCount(),
  ]);

  if ("error" in famCount) {
    throw famCount.error;
  }

  if ("error" in baseFeePerGas) {
    throw baseFeePerGas.error;
  }

  if ("error" in ethPriceStats) {
    throw ethPriceStats.error;
  }

  return {
    props: {
      fallback: {
        "/api/v2/fees/base-fee-per-gas": baseFeePerGas.data,
        "/api/v2/fees/eth-price-stats": ethPriceStats.data,
        "/api/v2/fam/count": famCount.data,
      },
    },
    revalidate: Duration.secsFromMinutes(10),
  };
};

const WrappedFamPage: NextPage<StaticProps> = ({ fallback }) => (
  <BasicErrorBoundary>
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <FamPage />
    </SWRConfig>
  </BasicErrorBoundary>
);

export default WrappedFamPage;
