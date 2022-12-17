import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import "react-loading-skeleton/dist/skeleton.css";
import { SWRConfig } from "swr";
import SiteMetadata from "../site-metadata";
import type { BaseFeePerGas } from "../api/base-fee-per-gas";
import { fetchBaseFeePerGas } from "../api/base-fee-per-gas";
import type { BaseFeePerGasStats } from "../api/base-fee-per-gas-stats";
import { fetchBaseFeePerGasStats } from "../api/base-fee-per-gas-stats";
import type { EthPriceStats } from "../api/eth-price-stats";
import { fetchEthPriceStats } from "../api/eth-price-stats";
import type { FamCount } from "../api/fam-count";
import { fetchFamCount } from "../api/fam-count";
import BasicErrorBoundary from "../components/BasicErrorBoundary";
import FamPage from "../components/FamPage";
import * as Duration from "../duration";

type StaticProps = {
  fallback: {
    "/api/v2/fam/count": FamCount;
    "/api/v2/fees/base-fee-per-gas": BaseFeePerGas;
    "/api/v2/fees/base-fee-per-gas-stats": BaseFeePerGasStats;
    "/api/v2/fees/eth-price-stats": EthPriceStats;
  };
};

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const [baseFeePerGas, ethPriceStats, famCount, baseFeePerGasStats] =
    await Promise.all([
      fetchBaseFeePerGas(),
      fetchEthPriceStats(),
      fetchFamCount(),
      fetchBaseFeePerGasStats(),
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

  if ("error" in baseFeePerGasStats) {
    throw baseFeePerGasStats.error;
  }

  return {
    props: {
      fallback: {
        "/api/v2/fam/count": famCount.data,
        "/api/v2/fees/base-fee-per-gas": baseFeePerGas.data,
        "/api/v2/fees/base-fee-per-gas-stats": baseFeePerGasStats.data,
        "/api/v2/fees/eth-price-stats": ethPriceStats.data,
      },
    },
    revalidate: Duration.secsFromMinutes(10),
  };
};

const WrappedFamPage: NextPage<StaticProps> = ({ fallback }) => (
  <BasicErrorBoundary>
    <Head>
      <meta name="description" content={SiteMetadata.description} />
      <meta
        name="keywords"
        content="ultra sound money, ethereum, ETH, sound money, fee burn, EIP-1559"
      />
      {/* When sharing the site on twitter, twitter adds our metadata, this adds little value, so we remove it. To not spend a lot of time removing our metadata from every shared link we're disabling twitter metadata for now. */}
      <meta property="og:title" content={SiteMetadata.title} />
      <meta property="og:description" content={SiteMetadata.description} />
      <meta property="og:url" content="https://ultrasound.money" />
    </Head>
    {/* This serves our Plausible analytics script. We use cloudflare workers to make this possible. The name is intentionally vague as suggested in the Plausible docs. */}
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
      <FamPage />
    </SWRConfig>
  </BasicErrorBoundary>
);

export default WrappedFamPage;
