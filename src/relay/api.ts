import { getApiUrl } from "./config";
import type { Builder, ValidatorStats } from "./types";

// Next cannot serialize dates, these types represent domain objects before parsing

export type ApiPayload = {
  insertedAt: string;
  blockNumber: number;
  value: number;
};

export type ApiPayloadStats = {
  count: number;
  totalValue: number;
  firstPayloadAt: string;
};

export type ApiValidator = {
  insertedAt: string;
  pubkeyFragment: string;
  index: string;
};

export const fetchPayloads = (): Promise<Array<ApiPayload>> =>
  fetch(`${getApiUrl()}/api/payloads`)
    .then((res) => res.json())
    .then(({ payloads }) => payloads as Array<ApiPayload>)
    .catch((err) => {
      console.error("error fetching payloads", err);
      return [];
    });

export const fetchTopPayloads = (): Promise<Array<ApiPayload>> =>
  fetch(`${getApiUrl()}/api/payloads/top`)
    .then((res) => res.json())
    .then(({ payloads }) => payloads as Array<ApiPayload>)
    .catch((err) => {
      console.error("error fetching top payloads", err);
      return [];
    });

export const fetchPayloadStats = (): Promise<ApiPayloadStats> =>
  fetch(`${getApiUrl()}/api/payloads/count`)
    .then((res) => res.json() as Promise<ApiPayloadStats>)
    .then(
      ({ count, totalValue, firstPayloadAt }) =>
        ({
          count,
          totalValue,
          firstPayloadAt,
        } as ApiPayloadStats),
    )
    .catch((err) => {
      console.error("error fetching payload stats", err);
      return {
        count: 0,
        totalValue: 0,
        firstPayloadAt: "2022-11-25T23:49:23.789155Z",
      };
    });

export const fetchValidators = (): Promise<Array<ApiValidator>> =>
  fetch(`${getApiUrl()}/api/validators`)
    .then((res) => res.json())
    .then(({ validators }) => validators as Array<ApiValidator>)
    .catch((err) => {
      console.error("error fetching validators", err);
      return [];
    });

export const fetchValidatorStats = (): Promise<ValidatorStats> =>
  fetch(`${getApiUrl()}/api/validators/count`)
    .then((res) => res.json() as Promise<ValidatorStats>)
    .then(
      ({ validatorCount, knownValidatorCount, recipientCount }) =>
        ({
          validatorCount,
          knownValidatorCount,
          recipientCount,
        } as ValidatorStats),
    )
    .catch((err) => {
      console.error("error fetching validator count", err);
      return {
        validatorCount: 0,
        knownValidatorCount: 0,
        recipientCount: 0,
      };
    });

export const fetchTopBuilders = (): Promise<Array<Builder>> =>
  fetch(`${getApiUrl()}/api/builders/top`)
    .then((res) => res.json())
    .then(({ builders }) => builders as Array<Builder>)
    .catch((err) => {
      console.error("error fetching top builders", err);
      return [];
    });
