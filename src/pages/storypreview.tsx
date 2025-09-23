import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import SiteMetadata from "../site-metadata";
import { SWRConfig } from "swr";
import type { BaseFeePerGas } from "../mainsite/api/base-fee-per-gas";
import { fetchBaseFeePerGas } from "../mainsite/api/base-fee-per-gas";
import type { BaseFeePerGasStats } from "../mainsite/api/base-fee-per-gas-stats";
import type { EthPriceStats } from "../mainsite/api/eth-price-stats";
import { fetchEthPriceStats } from "../mainsite/api/eth-price-stats";
// import Story from "../components/Landing";
import * as Duration from "../duration";
import type { BaseFeePerGasBarrier } from "../mainsite/api/barrier";
import { fetchBaseFeePerGasBarrier } from "../mainsite/api/barrier";
import { E } from "../fp";

type StaticProps = {
  fallback: {
    "/api/v2/fees/base-fee-per-gas": BaseFeePerGas;
    "/api/v2/fees/base-fee-per-gas-barrier": BaseFeePerGasBarrier;
    "/api/v2/fees/base-fee-per-gas-stats": BaseFeePerGasStats;
    "/api/v2/fees/eth-price-stats": EthPriceStats;
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const [
    baseFeePerGas,
    baseFeePerGasBarrier,
    ethPriceStats,
    baseFeePerGasStats,
  ] = await Promise.all([
    fetchBaseFeePerGas()(),
    fetchBaseFeePerGasBarrier(),
    fetchEthPriceStats(),
    fetchBaseFeePerGas()(),
  ]);

  if (E.isLeft(baseFeePerGas)) {
    throw baseFeePerGas.left;
  }

  if ("error" in ethPriceStats) {
    throw ethPriceStats.error;
  }

  if (E.isLeft(baseFeePerGasStats)) {
    throw baseFeePerGasStats.left;
  }

  if ("error" in baseFeePerGasBarrier) {
    throw baseFeePerGasBarrier.error;
  }

  return {
    props: {
      baseFeePerGas,
      ethPriceStats,
      fallback: {
        "/api/v2/fees/base-fee-per-gas": baseFeePerGas.right,
        "/api/v2/fees/base-fee-per-gas-barrier": baseFeePerGasBarrier.data,
        "/api/v2/fees/base-fee-per-gas-stats": baseFeePerGasStats.right,
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
      <title>ultrasonic.money</title>
      <meta name="description" content={SiteMetadata.description} />
      <meta
        name="keywords"
        content="ultra sonic money, ethereum, ETH, sonic money, fee burn, EIP-1559"
      />
      {/* When sharing the site on twitter, twitter adds our metadata, this adds little value, so we remove it. To not spend a lot of time removing our metadata from every shared link we're disabling twitter metadata for now. */}
      <meta property="og:title" content={SiteMetadata.title} />
      <meta property="og:description" content={SiteMetadata.description} />
      <meta property="og:url" content="https://ultrasound.money" />
      {/* This serves our Plausible analytics script. We use cloudflare workers to make this possible. The name is intentionally vague as suggested in the Plausible docs. */}
    </Head>
    <Script
      defer
      data-domain="ultrasound.money"
      data-api="https://ultrasound.money/cfw/event"
      src="https://ultrasound.money/cfw/script.js"
    />
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <div>
        story code has been moved to root/archive, move from there to root/src
        as needed
      </div>
      {/* <Story /> */}
    </SWRConfig>
  </>
);
export default StoryPreview;
