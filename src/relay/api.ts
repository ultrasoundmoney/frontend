import { getApiUrl } from "./config";

export type ApiPayload = {
  insertedAt: Date;
  blockNumber: number;
  value: number;
};

export type ApiPayloadStats = {
  count: number;
  totalValue: number;
  firstPayloadAt: Date;
};

export type ApiValidator = {
  insertedAt: Date;
  pubkeyFragment: string;
  index: string;
};

export type ApiValidatorStats = {
  validatorCount: number;
  knownValidatorCount: number;
  recipientCount: number;
};

// TODO: parse response bodies

export const fetchPayloads = (): Promise<Array<ApiPayload>> =>
  fetch(`${getApiUrl()}/api/payloads`)
    .then((res) => res.json())
    .then(({ payloads }) => payloads as Array<ApiPayload>)
    .catch((err) => {
      console.error("error fetching payloads", err);
      return [];
    });

export const fetchPayloadStats = (): Promise<ApiPayloadStats> =>
  fetch(`${getApiUrl()}/api/payloads/count`)
    .then((res) => res.json())
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
      return { count: 0, totalValue: 0, firstPayloadAt: new Date() };
    });

export const fetchValidators = (): Promise<Array<ApiValidator>> =>
  fetch(`${getApiUrl()}/api/validators`)
    .then((res) => res.json())
    .then(({ validators }) => validators as Array<ApiValidator>)
    .catch((err) => {
      console.error("error fetching validators", err);
      return [];
    });

export const fetchValidatorStats = (): Promise<ApiValidatorStats> =>
  fetch(`${getApiUrl()}/api/validators/count`)
    .then((res) => res.json())
    .then(
      ({ validatorCount, knownValidatorCount, recipientCount }) =>
        ({
          validatorCount,
          knownValidatorCount,
          recipientCount,
        } as ApiValidatorStats),
    )
    .catch((err) => {
      console.error("error fetching validator count", err);
      return {
        validatorCount: 0,
        knownValidatorCount: 0,
        recipientCount: 0,
      };
    });
