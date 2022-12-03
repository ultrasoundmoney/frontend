import { minutesToSeconds } from "date-fns";
import type { GetStaticProps, NextPage } from "next";
import { SWRConfig } from "swr";
import type { BaseFeePerGas } from "../api/base-fee-per-gas";
import { fetchBaseFeePerGas } from "../api/base-fee-per-gas";
import type { BaseFeePerGasStats } from "../api/base-fee-per-gas-stats";
import { fetchBaseFeePerGasStats } from "../api/base-fee-per-gas-stats";
import type { EthPriceStats } from "../api/eth-price-stats";
import { fetchEthPriceStats } from "../api/eth-price-stats";
import type { SupplyPartsF } from "../api/eth-supply";
import { fetchSupplyParts } from "../api/eth-supply";
import type { ScarcityF } from "../api/scarcity";
import { fetchScarcity } from "../api/scarcity";
import BasicErrorBoundary from "../components/BasicErrorBoundary";
import Dashboard from "../components/Dashboard";

type StaticProps = {
  fallback: {
    "/api/fees/scarcity": ScarcityF;
    "/api/v2/fees/base-fee-per-gas": BaseFeePerGas;
    "/api/v2/fees/base-fee-per-gas-stats": BaseFeePerGasStats;
    "/api/v2/fees/eth-price-stats": EthPriceStats;
    "/api/v2/fees/eth-supply-parts": SupplyPartsF;
  };
};

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const [
    baseFeePerGas,
    baseFeePerGasStats,
    ethPriceStats,
    ethSupplyF,
    scarcityF,
  ] = await Promise.all([
    fetchBaseFeePerGas(),
    fetchBaseFeePerGasStats(),
    fetchEthPriceStats(),
    fetchSupplyParts(),
    fetchScarcity(),
  ]);

  if ("error" in ethSupplyF) {
    throw ethSupplyF.error;
  }

  if ("error" in baseFeePerGas) {
    throw baseFeePerGas.error;
  }

  if ("error" in ethPriceStats) {
    throw ethPriceStats.error;
  }

  if ("error" in scarcityF) {
    throw scarcityF.error;
  }

  if ("error" in baseFeePerGasStats) {
    throw baseFeePerGasStats.error;
  }

  return {
    props: {
      fallback: {
        "/api/fees/scarcity": scarcityF.data,
        "/api/v2/fees/base-fee-per-gas": baseFeePerGas.data,
        "/api/v2/fees/base-fee-per-gas-stats": baseFeePerGasStats.data,
        "/api/v2/fees/eth-price-stats": ethPriceStats.data,
        "/api/v2/fees/eth-supply-parts": ethSupplyF.data,
      },
    },
    // Should be the expected lifetime of the data which goes stale quickest.
    // Although base-fee-per-gas updates every block, it's good enough to update SSR every 1min.
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
