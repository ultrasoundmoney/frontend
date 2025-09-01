import type { FC } from "react";
import Flippenings from "../components/Flippenings";
import IssuanceBreakdown from "../components/IssuanceBreakdown";
import PriceModel from "../components/PriceModel";
import ScarcityWidget from "../components/ScarcityWidget";
import ValidatorRewardsWidget from "../components/ValidatorRewards";
import ValidatorCostsWidget from "../components/ValidatorCostsWidget";
import Section from "../../components/Section";

const MonetaryPremiumSection: FC = () => (
  <Section
    title="monetary premium"
    link="monetary-premium"
    subtitle="the race to become the most desirable money"
  >
    <div className="flex w-full flex-col gap-y-4 lg:flex-row lg:gap-x-4">
      <div className="flex basis-1/2 flex-col gap-y-4">
        <ScarcityWidget />
        <ValidatorRewardsWidget />
        <ValidatorCostsWidget />
        <Flippenings />
      </div>
      <div className="flex basis-1/2 flex-col gap-y-4">
        <PriceModel />
        <IssuanceBreakdown />
      </div>
    </div>
  </Section>
);

export default MonetaryPremiumSection;
