import * as DateFns from "date-fns";
import useSWR from "swr";
import { getAdminToken } from "../admin";
import { feesBasePath } from "../api";
import { A, pipe } from "../fp";

export const setContractTwitterHandle = async (
  address: string,
  handle: string
) => {
  const token = getAdminToken();
  if (token === undefined) {
    return;
  }

  const res = await fetch(
    `${feesBasePath}/contracts/admin/set-twitter-handle?address=${address}&token=${token}&handle=${handle}`
  );

  if (res.status !== 200) {
    console.error("failed to add twitter handle", await res.json());
    return;
  }

  console.log(`successfully twitter handle ${handle} for ${address}`);
};

export const setContractName = async (address: string, name: string) => {
  const token = getAdminToken();
  if (token === undefined) {
    return;
  }

  const res = await fetch(
    `${feesBasePath}/contracts/admin/set-name?address=${address}&token=${token}&name=${name}`
  );

  if (res.status !== 200) {
    console.error("failed to add contract name", await res.json());
    return;
  }

  console.log(`successfully added contract name ${name} for ${address}`);
};

export const setContractCategory = async (
  address: string,
  category: string
) => {
  const token = getAdminToken();
  if (token === undefined) {
    return;
  }

  const res = await fetch(
    `${feesBasePath}/contracts/admin/set-category?address=${address}&token=${token}&category=${category}`
  );

  if (res.status !== 200) {
    console.error("failed to add contract category", await res.json());
    return;
  }

  console.log(`successfully added category ${category} for ${address}`);
};

export const setContractLastManuallyVerified = async (address: string) => {
  const token = getAdminToken();
  if (token === undefined) {
    return;
  }

  const res = await fetch(
    `${feesBasePath}/contracts/admin/set-last-manually-verified?address=${address}&token=${token}`
  );

  if (res.status !== 200) {
    console.error("failed to add contract category", await res.json());
    return;
  }

  console.log(`successfully added set last manually verified for ${address}`);
};

type RawMetadataFreshness = {
  openseaContractLastFetch: string | null;
  lastManuallyVerified: string | null;
};
type RawMetadataFreshnessMap = Record<string, RawMetadataFreshness>;
export type MetadataFreshness = {
  openseaContractLastFetch: Date | null;
  lastManuallyVerified: Date | null;
};
export type MetadataFreshnessMap = Record<string, MetadataFreshness>;

const mapValues = <B, C>(
  obj: Record<string, B>,
  fn: (b: B) => C
): Record<string, C> =>
  pipe(
    Array.from(Object.entries(obj)),
    A.map(([key, value]) => [key, fn(value)] as [string, C]),
    (entries) => Object.fromEntries(entries)
  );

const decodeFreshness = (freshness: RawMetadataFreshness) => ({
  openseaContractLastFetch:
    freshness.openseaContractLastFetch === null
      ? null
      : DateFns.parseISO(freshness.openseaContractLastFetch),
  lastManuallyVerified:
    freshness.lastManuallyVerified === null
      ? null
      : DateFns.parseISO(freshness.lastManuallyVerified),
});

export const useContractsFreshness = (
  addresses: string[] | undefined
): MetadataFreshnessMap | undefined => {
  const token = getAdminToken();
  const shouldFetch = addresses !== undefined && token !== undefined;

  const fetcher = (url: string) =>
    fetch(url, {
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
      ? `${feesBasePath}/contracts/admin/set-last-manually-verified?token=${token}`
      : null,
    fetcher
  );

  return data === undefined ? undefined : mapValues(data, decodeFreshness);
};
