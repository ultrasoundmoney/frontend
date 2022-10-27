import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { SWRConfig } from "swr";
import type { BaseFeePerGas } from "../api/base-fee-per-gas";
import { fetchBaseFeePerGas } from "../api/base-fee-per-gas";
import type { BaseFeePerGasStats } from "../api/base-fee-per-gas-stats";
import type { EthPriceStats } from "../api/eth-price-stats";
import { fetchEthPriceStats } from "../api/eth-price-stats";
import Story from "../components/Landing";
import * as Duration from "../duration";

type StaticProps = {
  fallback: {
    "/api/v2/fees/base-fee-per-gas": BaseFeePerGas;
    "/api/v2/fees/base-fee-per-gas-stats": BaseFeePerGasStats;
    "/api/v2/fees/eth-price-stats": EthPriceStats;
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const [baseFeePerGas, ethPriceStats, baseFeePerGasStats] = await Promise.all([
    fetchBaseFeePerGas(),
    fetchEthPriceStats(),
    fetchBaseFeePerGas(),
  ]);

  if ("error" in baseFeePerGas) {
    throw baseFeePerGas.error;
  }

  if ("error" in ethPriceStats) {
    throw ethPriceStats.error;
  }

  if ("error" in baseFeePerGasStats) {
    throw baseFeePerGasStats.error;
  }

  return {
    props: {
      baseFeePerGas,
      ethPriceStats,
      fallback: {
        "/api/v2/fees/base-fee-per-gas": baseFeePerGas.data,
        "/api/v2/fees/base-fee-per-gas-stats": baseFeePerGasStats.data,
        "/api/v2/fees/eth-price-stats": ethPriceStats.data,
      },
    },
    // Should be the expected lifetime of the data which goes stale quickest.
    revalidate: Duration.secsFromMinutes(10),
  };
};

const StoryPreview: NextPage<StaticProps> = ({ fallback }) => (
  <>
    <Head>
      <title>ultrasound.money</title>
    </Head>
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <Story />
    </SWRConfig>
  </>
);
export default StoryPreview;
