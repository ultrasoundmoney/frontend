import * as DateFns from "date-fns";
import mapValues from "lodash/mapValues";
import useSWR from "swr";
import * as SharedConfig from "../../config";

export const setContractTwitterHandle = async (
  address: string,
  handle: string,
  token: string | undefined,
) => {
  if (token === undefined) {
    return;
  }

  const res = await fetch(
    `${SharedConfig.usmDomainFromEnv()}/api/fees/contracts/admin/set-twitter-handle?address=${address}&token=${token}&handle=${handle}`,
  );

  if (res.status !== 200) {
    console.error("failed to add twitter handle", await res.json());
    return;
  }

  console.log(`successfully twitter handle ${handle} for ${address}`);
};

export const setContractName = async (
  address: string,
  name: string,
  token: string | undefined,
) => {
  if (token === undefined) {
    return;
  }

  const res = await fetch(
    `${SharedConfig.usmDomainFromEnv()}/api/fees/contracts/admin/set-name?address=${address}&token=${token}&name=${name}`,
  );

  if (res.status !== 200) {
    console.error("failed to add contract name", await res.json());
    return;
  }

  console.log(`successfully added contract name ${name} for ${address}`);
};

export const setContractCategory = async (
  address: string,
  category: string,
  token: string | undefined,
) => {
  if (token === undefined) {
    return;
  }

  const res = await fetch(
    `${SharedConfig.usmDomainFromEnv()}/api/contracts/admin/set-category?address=${address}&token=${token}&category=${category}`,
  );

  if (res.status !== 200) {
    console.error("failed to add contract category", await res.json());
    return;
  }

  console.log(`successfully added category ${category} for ${address}`);
};

export const setContractLastManuallyVerified = async (
  address: string,
  token: string | undefined,
) => {
  if (token === undefined) {
    return;
  }

  const res = await fetch(
    `${SharedConfig.usmDomainFromEnv()}/api/contracts/admin/set-last-manually-verified?address=${address}&token=${token}`,
  );

  if (res.status !== 200) {
    console.error("failed to add contract category", await res.json());
    return;
  }

  console.log(`successfully set last manually verified for ${address}`);
};

type RawMetadataFreshness = {
  openseaContractLastFetch: string | null;
  lastManuallyVerified: string | null;
};
type RawMetadataFreshnessMap = Record<string, RawMetadataFreshness>;
export type MetadataFreshness = {
  openseaContractLastFetch: Date | undefined;
  lastManuallyVerified: Date | undefined;
};
export type MetadataFreshnessMap = Record<string, MetadataFreshness>;

const decodeFreshness = (freshness: RawMetadataFreshness) => ({
  openseaContractLastFetch:
    freshness.openseaContractLastFetch == null
      ? undefined
      : DateFns.parseISO(freshness.openseaContractLastFetch),
  lastManuallyVerified:
    freshness.lastManuallyVerified == null
      ? undefined
      : DateFns.parseISO(freshness.lastManuallyVerified),
});

export const useContractsFreshness = (
  addresses: string[] | undefined,
  token: string | undefined,
): MetadataFreshnessMap | undefined => {
  const shouldFetch = addresses !== undefined && token !== undefined;

  const fetcher = (url: string) =>
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ addresses }),
    }).then(async (res) => {
      if (!res.ok) {
        console.log(await res.json());
        throw new Error("failed to fetch contract metadata freshness");
      }

      return res.json() as Promise<RawMetadataFreshnessMap>;
    });

  const { data } = useSWR(
    shouldFetch
      ? `${SharedConfig.usmDomainFromEnv()}/api/contracts/metadata-freshness?token=${token}`
      : null,
    fetcher,
  );

  return data === undefined ? undefined : mapValues(data, decodeFreshness);
};
