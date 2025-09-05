import type { FC } from "react";
import Flippenings from "../components/Flippenings";
import IssuanceBreakdown from "../components/IssuanceBreakdown";
import ScarcityWidget from "../components/ScarcityWidget";
import ValidatorRewardsWidget from "../components/ValidatorRewards";
import Section from "../../components/Section";

const MonetaryPremiumSection: FC = () => (
  <Section
    title="monetary premium"
    link="monetary-premium"
    subtitle="the race to become the most desirable money"
  >
    <div className="flex w-full flex-col gap-y-4 lg:flex-row lg:gap-x-4">
      <div className="flex basis-1/2 flex-col gap-y-4 lg:h-full">
        <ScarcityWidget />
        <ValidatorRewardsWidget />
      </div>
      <div className="flex basis-1/2 flex-col gap-y-4 lg:h-full">
        <IssuanceBreakdown />
        <Flippenings />
      </div>
    </div>
  </Section>
);

export default MonetaryPremiumSection;
