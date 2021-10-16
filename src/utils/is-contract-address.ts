export const isContractAddress = (address: unknown): boolean =>
  typeof address === "string" &&
  address.startsWith("0x") &&
  address.length === 42;
