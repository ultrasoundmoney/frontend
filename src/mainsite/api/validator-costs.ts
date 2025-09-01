import { useEthPriceStats } from "./eth-price-stats";
import { useValidatorRewards, getTotalAnnualReward, getTotalApr } from "./validator-rewards";
import { GWEI_PER_ETH } from "../../eth-units";

export type ValidatorCosts = {
  hardware: {
    annualCostUsd: number;
    annualCostEth: number;
    aprImpact: number;
    assumptions: string;
  };
  internet: {
    annualCostUsd: number;
    annualCostEth: number;
    aprImpact: number;
    assumptions: string;
  };
  power: {
    annualCostUsd: number;
    annualCostEth: number;
    aprImpact: number;
    assumptions: string;
  };
  totalCostsUsd: number;
  totalCostsEth: number;
  netRewardsEth: number;
  netRewardsUsd: number;
  grossRewardsEth: number;
  grossRewardsUsd: number;
  grossApr: number;
  netApr: number;
  costRatio: number;
};

/**
 * Annual validator operating costs in USD
 * Based on typical home staking setup costs
 */
const HARDWARE_COST_USD = 200; // $800 setup amortized over 4 years
const INTERNET_COST_USD = 300; // $25/month reliable connection
const POWER_COST_USD = 60; // 50W * 8760h * $0.13/kWh (US average)

/** Standard Ethereum validator stake requirement */
const VALIDATOR_STAKE_ETH = 32;

export type CostToggleState = {
  hardware: boolean;
  internet: boolean;
  power: boolean;
};

/**
 * Hook to calculate validator operating costs and net profitability
 * @param enabledCosts - Optional toggle state for each cost category
 * @returns Validator cost data including gross/net rewards, APR impacts, and cost ratios
 */
export const useValidatorCosts = (enabledCosts?: CostToggleState): ValidatorCosts | undefined => {
  const validatorRewards = useValidatorRewards();
  const ethPriceStats = useEthPriceStats();

  // Default all costs to enabled if not specified
  const costState = enabledCosts ?? { hardware: true, internet: true, power: true };

  // Calculate costs if we have both validator rewards and ETH price
  if (!validatorRewards || !ethPriceStats) {
    return undefined;
  }

  const ethPriceUsd = ethPriceStats.usd;
  
  // Early return if ETH price is invalid or zero
  if (!ethPriceUsd || ethPriceUsd <= 0) {
    return undefined;
  }

  // Convert annual rewards from GWEI to ETH
  const grossRewardsGwei = getTotalAnnualReward(validatorRewards) ?? 0;
  const grossRewardsEth = grossRewardsGwei / GWEI_PER_ETH;
  
  // Get gross APR from validator rewards
  const grossApr = getTotalApr(validatorRewards) ?? 0;

  // Convert USD costs to ETH (apply toggle state)
  const hardwareCostEth = costState.hardware ? HARDWARE_COST_USD / ethPriceUsd : 0;
  const internetCostEth = costState.internet ? INTERNET_COST_USD / ethPriceUsd : 0;
  const powerCostEth = costState.power ? POWER_COST_USD / ethPriceUsd : 0;
  
  const totalCostsUsd = 
    (costState.hardware ? HARDWARE_COST_USD : 0) + 
    (costState.internet ? INTERNET_COST_USD : 0) + 
    (costState.power ? POWER_COST_USD : 0);
  const totalCostsEth = totalCostsUsd / ethPriceUsd;
  
  // Calculate APR impact for each cost (cost / 32 ETH stake * 100)
  const hardwareAprImpact = (hardwareCostEth / VALIDATOR_STAKE_ETH) * 100;
  const internetAprImpact = (internetCostEth / VALIDATOR_STAKE_ETH) * 100;
  const powerAprImpact = (powerCostEth / VALIDATOR_STAKE_ETH) * 100;
  
  const netRewardsEth = grossRewardsEth - totalCostsEth;
  const netApr = grossApr - ((totalCostsEth / VALIDATOR_STAKE_ETH) * 100);
  const costRatio = grossRewardsEth > 0 ? (totalCostsEth / grossRewardsEth) * 100 : 0;
  
  // Calculate USD values for gross and net rewards
  const grossRewardsUsd = grossRewardsEth * ethPriceUsd;
  const netRewardsUsd = netRewardsEth * ethPriceUsd;

  return {
    hardware: {
      annualCostUsd: HARDWARE_COST_USD,
      annualCostEth: HARDWARE_COST_USD / ethPriceUsd, // Always show base cost
      aprImpact: hardwareAprImpact, 
      assumptions: "Hardware depreciated over 4 years. Based on budget setup (~$800)",
    },
    internet: {
      annualCostUsd: INTERNET_COST_USD,
      annualCostEth: INTERNET_COST_USD / ethPriceUsd, // Always show base cost
      aprImpact: internetAprImpact,
      assumptions: "Reliable home internet connection. Estimated $25/month",
    },
    power: {
      annualCostUsd: POWER_COST_USD,
      annualCostEth: POWER_COST_USD / ethPriceUsd, // Always show base cost
      aprImpact: powerAprImpact,
      assumptions: "50W continuous power at $0.13/kWh (US average). ~438 kWh/year",
    },
    totalCostsUsd,
    totalCostsEth,
    netRewardsEth,
    netRewardsUsd,
    grossRewardsEth,
    grossRewardsUsd,
    grossApr,
    netApr,
    costRatio,
  };
};

export const getCostRatioColor = (costRatio: number | undefined): string => {
  if (typeof costRatio !== 'number' || !isFinite(costRatio) || costRatio < 0) {
    return "#8899A6"; // Gray - invalid/loading state
  }
  if (costRatio <= 5) return "#00ffa3"; // Green - healthy
  if (costRatio <= 10) return "#f4900c"; // Yellow - acceptable  
  return "#ef4444"; // Red - concerning
};