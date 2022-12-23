import { minutesToSeconds } from "date-fns";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import { SWRConfig } from "swr";
import SiteMetadata from "../site-metadata";
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
import type { SupplyChanges } from "../api/supply-changes";
import { fetchSupplyChanges } from "../api/supply-changes";
import type { IssuanceEstimate } from "../api/issuance-estimate";
import { fetchIssuanceEstimate } from "../api/issuance-estimate";

type StaticProps = {
  fallback: {
    "/api/fees/scarcity": ScarcityF;
    "/api/v2/fees/base-fee-per-gas": BaseFeePerGas;
    "/api/v2/fees/base-fee-per-gas-stats": BaseFeePerGasStats;
    "/api/v2/fees/eth-price-stats": EthPriceStats;
    "/api/v2/fees/eth-supply-parts": SupplyPartsF;
    "/api/v2/fees/issuance-estimate": IssuanceEstimate;
    "/api/v2/fees/supply-changes": SupplyChanges;
  };
};

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const [
    baseFeePerGas,
    baseFeePerGasStats,
    ethPriceStats,
    ethSupplyF,
    issuanceEstimate,
    scarcityF,
    supplyChanges,
  ] = await Promise.all([
    fetchBaseFeePerGas(),
    fetchBaseFeePerGasStats(),
    fetchEthPriceStats(),
    fetchSupplyParts(),
    fetchIssuanceEstimate(),
    fetchScarcity(),
    fetchSupplyChanges(),
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

  if ("error" in supplyChanges) {
    throw supplyChanges.error;
  }

  if ("error" in issuanceEstimate) {
    throw issuanceEstimate.error;
  }

  return {
    props: {
      fallback: {
        "/api/fees/scarcity": scarcityF.data,
        "/api/v2/fees/base-fee-per-gas": baseFeePerGas.data,
        "/api/v2/fees/base-fee-per-gas-stats": baseFeePerGasStats.data,
        "/api/v2/fees/eth-price-stats": ethPriceStats.data,
        "/api/v2/fees/eth-supply-parts": ethSupplyF.data,
        "/api/v2/fees/issuance-estimate": issuanceEstimate.data,
        "/api/v2/fees/supply-changes": supplyChanges.data,
      },
    },
    // Should be the expected lifetime of the data which goes stale quickest.
    // Although base-fee-per-gas updates every block, it's good enough to update SSR every 1min.
    revalidate: minutesToSeconds(1),
  };
};

const IndexPage: NextPage<StaticProps> = ({ fallback }) => (
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
      <Dashboard />
    </SWRConfig>
  </BasicErrorBoundary>
);
export default IndexPage;
