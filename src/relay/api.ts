import { getApiUrl } from "./config";

export type ApiPayload = {
  insertedAt: Date;
  blockNumber: number;
  value: number;
};

export type ApiValidator = {
  insertedAt: Date;
  pubkeyFragment: string;
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

export const fetchPayloadCount = (): Promise<number> =>
  fetch(`${getApiUrl()}/api/payloads/count`)
    .then((res) => res.json())
    .then(({ count }) => count as number)
    .catch((err) => {
      console.error("error fetching payload count", err);
      return 0;
    });

export const fetchValidators = (): Promise<Array<ApiValidator>> =>
  fetch(`${getApiUrl()}/api/validators`)
    .then((res) => res.json())
    .then(({ validators }) => validators as Array<ApiValidator>)
    .catch((err) => {
      console.error("error fetching validators", err);
      return [];
    });

export const fetchValidatorCount = (): Promise<number> =>
  fetch(`${getApiUrl()}/api/validators/count`)
    .then((res) => res.json())
    .then(({ validatorCount }) => validatorCount as number)
    .catch((err) => {
      console.error("error fetching validator count", err);
      return 0;
    });
