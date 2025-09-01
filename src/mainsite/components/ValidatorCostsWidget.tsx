import type { FC } from "react";
import Skeleton from "react-loading-skeleton";
import {
  useValidatorCosts,
  getCostRatioColor,
  type CostToggleState,
} from "../api/validator-costs";
import * as Format from "../../format";
import { MoneyAmount, PercentAmount } from "./Amount";
import BodyText from "../../components/TextsNext/BodyText";
import LabelText from "../../components/TextsNext/LabelText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../components/WidgetSubcomponents";
import { useState, useCallback } from "react";
import { BaseText } from "../../components/Texts";

type SimpleTooltipProps = {
  children: React.ReactNode;
  text: string | undefined;
};

const SimpleTooltip: FC<SimpleTooltipProps> = ({ children, text }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!text) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative isolate"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      <div
        className={`
          absolute left-0 bottom-8 w-72 z-50
          rounded-lg border border-slateus-400 bg-slateus-700 p-3
          ${showTooltip ? "block" : "hidden"}
        `}
        style={{
          opacity: '1',
          isolation: 'isolate'
        }}
      >
        <BaseText font="font-inter" color="text-slateus-300" size="text-xs">
          {text}
        </BaseText>
      </div>
      {children}
    </div>
  );
};

type CostRowProps = {
  name: string;
  costEth: number | undefined;
  costUsd: number | undefined;
  aprImpact: number | undefined;
  assumptions: string | undefined;
  emoji: string;
  isEnabled: boolean;
  onToggle: () => void;
};

const CostRow: FC<CostRowProps> = ({
  name,
  costEth,
  costUsd,
  aprImpact,
  assumptions,
  emoji,
  isEnabled,
  onToggle,
}) => (
  <div 
    className={`grid grid-cols-4 items-center gap-x-2 md:gap-x-3 cursor-pointer transition-all duration-200 hover:bg-slateus-700/20 rounded-lg px-2 py-1 -mx-2 ${
      !isEnabled ? 'opacity-40 bg-slateus-800/20' : ''
    }`}
    onClick={onToggle}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle();
      }
    }}
    role="button"
    tabIndex={0}
    aria-label={`${name} cost: ${isEnabled ? 'enabled' : 'disabled'}. Click to ${isEnabled ? 'disable' : 'enable'}.`}
    title={isEnabled ? 'Click to disable this cost' : 'Click to enable this cost'}
  >
    <div className="flex items-center gap-x-2">
      <SimpleTooltip text={assumptions}>
        <div className="flex items-center gap-x-2 cursor-help">
          <span 
            className={`text-base flex-shrink-0 ${!isEnabled ? 'grayscale' : ''}`}
            style={{ filter: !isEnabled ? 'grayscale(1)' : 'none' }}
          >
            {emoji}
          </span>
          <BodyText className="truncate">{name}</BodyText>
        </div>
      </SimpleTooltip>
    </div>
    <MoneyAmount className="font-light text-right">
      {costEth === undefined
        ? undefined
        : isEnabled ? Format.formatTwoDigit(costEth) : Format.formatTwoDigit(0)}
    </MoneyAmount>
    <BodyText className="text-right text-slateus-400 text-xs">
      {costUsd === undefined
        ? <Skeleton width="2rem" />
        : isEnabled ? `$${Format.formatZeroDecimals(costUsd)}` : '$0'}
    </BodyText>
    <PercentAmount className="text-right text-red-400">
      {aprImpact === undefined
        ? undefined
        : isEnabled ? `-${Format.formatPercentTwoDecimals(aprImpact / 100)}` : '-0.00%'}
    </PercentAmount>
  </div>
);

type CostRatioIndicatorProps = {
  costRatio: number | undefined;
};

const CostRatioIndicator: FC<CostRatioIndicatorProps> = ({
  costRatio,
}) => {
  if (costRatio === undefined) {
    return (
      <div className="flex flex-col items-end gap-y-1">
        <Skeleton height="0.75rem" width="4rem" />
        <Skeleton height="1.5rem" width="3rem" />
      </div>
    );
  }

  const color = getCostRatioColor(costRatio);

  return (
    <div className="flex flex-col items-end gap-y-1">
      <BodyText className="text-slateus-400 text-xs uppercase tracking-wider">
        cost ratio
      </BodyText>
      <div
        className="text-xl md:text-2xl font-roboto font-light"
        style={{ color }}
      >
        {Format.formatOneDecimal(costRatio)}%
      </div>
    </div>
  );
};

const ValidatorCostsWidget: FC = () => {
  const [enabledCosts, setEnabledCosts] = useState<CostToggleState>({
    hardware: true,
    internet: true,
    power: true,
  });

  const validatorCosts = useValidatorCosts(enabledCosts);

  const toggleCost = useCallback((costType: keyof CostToggleState) => {
    setEnabledCosts(prev => ({
      ...prev,
      [costType]: !prev[costType],
    }));
  }, []);

  return (
    <WidgetBackground>
      <div className="flex flex-row justify-between items-start mb-6">
        <WidgetTitle>validator costs</WidgetTitle>
        <SimpleTooltip text="How much of a solo stakers rewards are offset by costs. Delegating stake costs from 5% to 15% on average.">
          <div className="cursor-help">
            <CostRatioIndicator costRatio={validatorCosts?.costRatio} />
          </div>
        </SimpleTooltip>
      </div>
      
      <div className="flex flex-col gap-y-4">
        {/* Cost Breakdown Header */}
        <div className="grid grid-cols-4 gap-x-2 md:gap-x-3">
          <LabelText>category</LabelText>
          <LabelText className="text-right">ETH/year</LabelText>
          <LabelText className="text-right hidden sm:block">USD/year</LabelText>
          <LabelText className="text-right sm:hidden">USD</LabelText>
          <LabelText className="text-right">APR impact</LabelText>
        </div>

        {/* Cost Rows */}
        <div className="flex flex-col gap-y-3">
          <CostRow
            name="hardware"
            costEth={validatorCosts?.hardware.annualCostEth}
            costUsd={validatorCosts?.hardware.annualCostUsd}
            aprImpact={validatorCosts?.hardware.aprImpact}
            assumptions={validatorCosts?.hardware.assumptions}
            emoji="💻"
            isEnabled={enabledCosts.hardware}
            onToggle={() => toggleCost('hardware')}
          />
          <CostRow
            name="internet"
            costEth={validatorCosts?.internet.annualCostEth}
            costUsd={validatorCosts?.internet.annualCostUsd}
            aprImpact={validatorCosts?.internet.aprImpact}
            assumptions={validatorCosts?.internet.assumptions}
            emoji="📶"
            isEnabled={enabledCosts.internet}
            onToggle={() => toggleCost('internet')}
          />
          <CostRow
            name="power"
            costEth={validatorCosts?.power.annualCostEth}
            costUsd={validatorCosts?.power.annualCostUsd}
            aprImpact={validatorCosts?.power.aprImpact}
            assumptions={validatorCosts?.power.assumptions}
            emoji="⚡"
            isEnabled={enabledCosts.power}
            onToggle={() => toggleCost('power')}
          />
          
          <hr className="h-[1px] border-slateus-400" />
          
          {/* Gross Rewards */}
          <div className="grid grid-cols-4 items-center gap-x-2">
            <BodyText className="text-slateus-300">gross rewards</BodyText>
            <MoneyAmount className="text-right text-slateus-300">
              {validatorCosts?.grossRewardsEth === undefined
                ? undefined
                : Format.formatTwoDigit(validatorCosts.grossRewardsEth)}
            </MoneyAmount>
            <BodyText className="text-right text-slateus-400 text-xs">
              {validatorCosts?.grossRewardsUsd === undefined
                ? <Skeleton width="2rem" />
                : `$${Format.formatZeroDecimals(validatorCosts.grossRewardsUsd)}`}
            </BodyText>
            <PercentAmount className="text-right text-slateus-300">
              {validatorCosts?.grossApr === undefined
                ? undefined
                : Format.formatOneDecimal(validatorCosts.grossApr)}%
            </PercentAmount>
          </div>
          
          {/* Total Costs */}
          <div className="grid grid-cols-4 items-center gap-x-2">
            <BodyText>total costs</BodyText>
            <MoneyAmount className="text-right">
              {validatorCosts?.totalCostsEth === undefined
                ? undefined
                : Format.formatTwoDigit(validatorCosts.totalCostsEth)}
            </MoneyAmount>
            <BodyText className="text-right text-slateus-400 text-xs">
              {validatorCosts?.totalCostsUsd === undefined
                ? <Skeleton width="2rem" />
                : `$${Format.formatZeroDecimals(validatorCosts.totalCostsUsd)}`}
            </BodyText>
            <PercentAmount className="text-right text-red-400">
              {validatorCosts === undefined
                ? undefined
                : `-${Format.formatPercentTwoDecimals((validatorCosts.totalCostsEth / 32))}`}
            </PercentAmount>
          </div>

          <hr className="h-[1px] border-slateus-400" />

          {/* Net Rewards */}
          <div className="grid grid-cols-4 items-center gap-x-2 font-semibold">
            <BodyText>net rewards</BodyText>
            <MoneyAmount className="text-right">
              {validatorCosts?.netRewardsEth === undefined
                ? undefined
                : Format.formatTwoDigit(validatorCosts.netRewardsEth)}
            </MoneyAmount>
            <BodyText className="text-right text-slateus-400 text-xs">
              {validatorCosts?.netRewardsUsd === undefined
                ? <Skeleton width="2rem" />
                : `$${Format.formatZeroDecimals(validatorCosts.netRewardsUsd)}`}
            </BodyText>
            <PercentAmount className="text-right">
              {validatorCosts?.netApr === undefined
                ? undefined
                : Format.formatOneDecimal(validatorCosts.netApr)}%
            </PercentAmount>
          </div>
        </div>

      </div>
    </WidgetBackground>
  );
};

export default ValidatorCostsWidget;