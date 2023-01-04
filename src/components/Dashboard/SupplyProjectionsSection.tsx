import type { FC } from "react";
import BasicErrorBoundary from "../BasicErrorBoundary";
import EquilibriumWidget from "../EquilibriumWidget";
import SectionDivider from "../SectionDivider";
import TwoYearProjection from "../TwoYearProjection";

const SupplyProjectionsSection: FC = () => (
  <BasicErrorBoundary>
    <div id="projection" className="mt-16">
      <SectionDivider
        link="projections"
        subtitle="ultra sound for decades to come"
        title="projections"
      />
      <div className="flex flex-col gap-4 xs:px-4 md:px-16">
        <EquilibriumWidget />
        <div className="relative w-full rounded-xl bg-slateus-700 px-2 py-4 md:m-auto md:px-4 md:py-8 xl:px-12 xl:py-12">
          <TwoYearProjection />
        </div>
      </div>
    </div>
  </BasicErrorBoundary>
);

export default SupplyProjectionsSection;
