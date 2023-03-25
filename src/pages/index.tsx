import { minutesToSeconds } from "date-fns";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import { SWRConfig } from "swr";
import BasicErrorBoundary from "../components/BasicErrorBoundary";
import { pipe, T, TAlt } from "../fp";
import type { BaseFeePerGasBarrier } from "../mainsite/api/barrier";
import { fetchBaseFeePerGasBarrier } from "../mainsite/api/barrier";
import type { BaseFeePerGas } from "../mainsite/api/base-fee-per-gas";
import { fetchBaseFeePerGas } from "../mainsite/api/base-fee-per-gas";
import type { BaseFeePerGasStats } from "../mainsite/api/base-fee-per-gas-stats";
import { fetchBaseFeePerGasStats } from "../mainsite/api/base-fee-per-gas-stats";
import type { EthPriceStats } from "../mainsite/api/eth-price-stats";
import { fetchEthPriceStats } from "../mainsite/api/eth-price-stats";
import type { ApiResult } from "../fetchers";
import type { GaugeRates } from "../mainsite/api/gauge-rates";
import { fetchGaugeRates } from "../mainsite/api/gauge-rates";
import type { ScarcityF } from "../mainsite/api/scarcity";
import { fetchScarcity } from "../mainsite/api/scarcity";
import type { SupplyPartsF } from "../mainsite/api/supply-parts";
import { fetchSupplyParts } from "../mainsite/api/supply-parts";
import Dashboards from "../mainsite/Dashboards";
import SiteMetadata from "../site-metadata";
import type { BurnSums } from "../mainsite/api/burn-sums";
import { fetchBurnSums } from "../mainsite/api/burn-sums";
import type { BurnRates } from "../mainsite/api/burn-rates";
import { fetchBurnRates } from "../mainsite/api/burn-rates";
import type { AverageEthPrice } from "../mainsite/api/average-eth-price";
import { fetchAverageEthPrice } from "../mainsite/api/average-eth-price";

type StaticProps = {
  fallback: {
    "/api/fees/scarcity": ScarcityF;
    "/api/v2/fees/average-eth-prices": AverageEthPrice;
    "/api/v2/fees/base-fee-per-gas": BaseFeePerGas;
    "/api/v2/fees/base-fee-per-gas-barrier": BaseFeePerGasBarrier;
    "/api/v2/fees/base-fee-per-gas-stats?time_frame=d1": BaseFeePerGasStats;
    "/api/v2/fees/base-fee-per-gas-stats?time_frame=d30": BaseFeePerGasStats;
    "/api/v2/fees/base-fee-per-gas-stats?time_frame=d7": BaseFeePerGasStats;
    "/api/v2/fees/base-fee-per-gas-stats?time_frame=h1": BaseFeePerGasStats;
    "/api/v2/fees/base-fee-per-gas-stats?time_frame=m5": BaseFeePerGasStats;
    "/api/v2/fees/base-fee-per-gas-stats?time_frame=since_burn": BaseFeePerGasStats;
    "/api/v2/fees/base-fee-per-gas-stats?time_frame=since_merge": BaseFeePerGasStats;
    "/api/v2/fees/burn-sums": BurnSums;
    "/api/v2/fees/burn-rates": BurnRates;
    "/api/v2/fees/eth-price-stats": EthPriceStats;
    "/api/v2/fees/gauge-rates": GaugeRates;
    "/api/v2/fees/supply-parts": SupplyPartsF;
  };
};

// Either throw or return the data contained in the ApiResult.
function fetchOrThrow<A>(fn: T.Task<ApiResult<A>>) {
  return pipe(
    fn,
    T.map((a) => {
      if ("error" in a) {
        throw a.error;
      }
      return a.data;
    }),
  );
}

export const getStaticProps: GetStaticProps<StaticProps> = pipe(
  T.Do,
  T.apS(
    "fetches",
    TAlt.sequenceStructPar({
      "/api/fees/scarcity": fetchOrThrow(fetchScarcity),
      "/api/v2/fees/average-eth-prices": fetchOrThrow(fetchAverageEthPrice),
      "/api/v2/fees/base-fee-per-gas": fetchOrThrow(fetchBaseFeePerGas),
      "/api/v2/fees/base-fee-per-gas-barrier": fetchOrThrow(
        fetchBaseFeePerGasBarrier,
      ),
      "/api/v2/fees/burn-rates": fetchOrThrow(fetchBurnRates),
      "/api/v2/fees/burn-sums": fetchOrThrow(fetchBurnSums),
      "/api/v2/fees/eth-price-stats": fetchOrThrow(fetchEthPriceStats),
      "/api/v2/fees/gauge-rates": fetchOrThrow(fetchGaugeRates),
      "/api/v2/fees/supply-parts": fetchOrThrow(fetchSupplyParts),
    }),
  ),
  T.apS("baseFeePerGasStats", fetchOrThrow(fetchBaseFeePerGasStats)),
  T.map(({ fetches, baseFeePerGasStats }) => ({
    ...fetches,
    "/api/v2/fees/base-fee-per-gas-stats?time_frame=m5":
      baseFeePerGasStats.base_fee_per_gas_stats.m5,
    "/api/v2/fees/base-fee-per-gas-stats?time_frame=h1":
      baseFeePerGasStats.base_fee_per_gas_stats.h1,
    "/api/v2/fees/base-fee-per-gas-stats?time_frame=d1":
      baseFeePerGasStats.base_fee_per_gas_stats.d1,
    "/api/v2/fees/base-fee-per-gas-stats?time_frame=d7":
      baseFeePerGasStats.base_fee_per_gas_stats.d7,
    "/api/v2/fees/base-fee-per-gas-stats?time_frame=d30":
      baseFeePerGasStats.base_fee_per_gas_stats.d30,
    "/api/v2/fees/base-fee-per-gas-stats?time_frame=since_merge":
      baseFeePerGasStats.base_fee_per_gas_stats.since_merge,
    "/api/v2/fees/base-fee-per-gas-stats?time_frame=since_burn":
      baseFeePerGasStats.base_fee_per_gas_stats.since_burn,
  })),
  T.map((fallback) => ({
    props: { fallback },
    // Should be the expected lifetime of the data which goes stale quickest.
    // Although base-fee-per-gas updates every block, it's good enough to update SSR every 1min.
    revalidate: minutesToSeconds(1),
  })),
);

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
      <Dashboards />
    </SWRConfig>
  </BasicErrorBoundary>
);
export default IndexPage;
