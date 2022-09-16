import {
  decodeGroupedAnalysis1,
  useGroupedAnalysis1,
} from "./grouped-analysis-1";

export const useBurnRates = () => {
  const groupedAnalysisF = useGroupedAnalysis1();
  return decodeGroupedAnalysis1(groupedAnalysisF)?.burnRates;
};
