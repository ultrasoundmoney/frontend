import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import type { BaseFeePerGas } from "../api/base-fee-per-gas";
import { fetchBaseFeePerGas } from "../api/base-fee-per-gas";
import type { EthPriceStats } from "../api/eth-price-stats";
import { fetchEthPriceStats } from "../api/eth-price-stats";
import Story from "../components/Landing";
import * as Duration from "../duration";

type StaticProps = {
  baseFeePerGas: BaseFeePerGas;
  ethPriceStats: EthPriceStats;
};

export const getStaticProps: GetStaticProps = async () => {
  const [baseFeePerGas, ethPriceStats] = await Promise.all([
    fetchBaseFeePerGas(),
    fetchEthPriceStats(),
  ]);

  return {
    props: {
      baseFeePerGas,
      ethPriceStats,
    },
    // Should be the expected lifetime of the data which goes stale quickest.
    revalidate: Duration.secsFromMinutes(10),
  };
};

const StoryPreview: NextPage<StaticProps> = ({
  baseFeePerGas,
  ethPriceStats,
}) => (
  <>
    <Head>
      <title>ultrasound.money</title>
    </Head>
    <Story baseFeePerGas={baseFeePerGas} ethPriceStats={ethPriceStats} />
  </>
);
export default StoryPreview;
