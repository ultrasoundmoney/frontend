import { parseISO } from "date-fns";

import type { ApiPayload, ApiPayloadStats, ApiValidator } from "./api";

export type Payload = {
  blockNumber: number;
  insertedAt: Date;
  value: number;
};

export type PayloadStats = {
  count: number;
  totalValue: number;
  firstPayloadAt: Date;
};

export type Validator = {
  insertedAt: Date;
  index: string;
};

export type ValidatorStats = {
  validatorCount: number;
  knownValidatorCount: number;
  recipientCount: number;
};

export type Builder = {
  extraData: string;
  blockCount: number;
};

export const parsePayload = (p: ApiPayload): Payload => ({
  ...p,
  insertedAt: parseISO(p.insertedAt),
});

export const parseValidator = (v: ApiValidator): Validator => ({
  ...v,
  insertedAt: parseISO(v.insertedAt),
});

export const parsePayloadStats = (ps: ApiPayloadStats): PayloadStats => ({
  ...ps,
  firstPayloadAt: parseISO(ps.firstPayloadAt),
});
