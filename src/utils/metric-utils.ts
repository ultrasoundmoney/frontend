const SECONDS_PER_SLOT = 12;
const SLOTS_PER_EPOCH = 32;
const EPOCHS_PER_DAY = (24 * 60 * 60) / SLOTS_PER_EPOCH / SECONDS_PER_SLOT;
const BASE_REWARD_FACTOR = 64;
const GWEI_PER_ETH = 10 ** 9;
const MAX_ETH_PER_VALIDATOR = 32;
const MAX_EFFECTIVE_BALANCE = MAX_ETH_PER_VALIDATOR * GWEI_PER_ETH;

function integerSquareRoot(n: number): number {
  return Math.floor(Math.sqrt(n));
}

export function estimatedDailyIssuance(ethStaked: number): number {
  const activeValidators = Math.floor(ethStaked / MAX_ETH_PER_VALIDATOR);
  const maxBalanceAtStake = activeValidators * MAX_EFFECTIVE_BALANCE;
  const MAX_ISSUANCE_PER_EPOCH = Math.floor(
    (BASE_REWARD_FACTOR * maxBalanceAtStake) /
      integerSquareRoot(maxBalanceAtStake)
  );
  const MAX_ISSUANCE_PER_DAY = MAX_ISSUANCE_PER_EPOCH * EPOCHS_PER_DAY;
  return Math.floor(MAX_ISSUANCE_PER_DAY / GWEI_PER_ETH);
}

export function estimatedDailyFeeBurn(baseGasPrice: number): number {
  const gasLimit = 15000000;
  return (
    ((SECONDS_PER_SLOT / 13) * // pre-merge block time is 13 seconds (conservative)
      (baseGasPrice * SLOTS_PER_EPOCH * EPOCHS_PER_DAY * gasLimit)) /
    GWEI_PER_ETH
  );
}

export function estimatedDailyStakeChange(ethStaked: number): number {
  const validator_count = Math.floor(ethStaked / MAX_ETH_PER_VALIDATOR);
  const max_validator_churn_per_epoch = Math.max(
    4,
    Math.floor(validator_count / 65536)
  );
  return max_validator_churn_per_epoch * MAX_ETH_PER_VALIDATOR * EPOCHS_PER_DAY;
}

export function formatDate(d: Date): string {
  const date = new Date(d);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (
    (date.getDate() < 10 ? " " : "") +
    date.getDate() +
    " " +
    months[date.getMonth()] +
    " " +
    date.getFullYear()
  );
}
