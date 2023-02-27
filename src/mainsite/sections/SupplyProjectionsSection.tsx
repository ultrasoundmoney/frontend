import type { FC } from "react";
import EquilibriumWidget from "../components/EquilibriumWidget";
import TwoYearProjection from "../components/TwoYearProjection";
import Section from "../../components/Section";

const SupplyProjectionsSection: FC = () => (
  <Section
    title="projections"
    subtitle="ultra sound for decades to come"
    link="projections"
  >
    <div className="flex w-full flex-col gap-4">
      <EquilibriumWidget />
      <div className="relative w-full rounded-xl bg-slateus-700 px-2 py-4 md:m-auto md:px-4 md:py-8 xl:px-12 xl:py-12">
        <TwoYearProjection />
      </div>
    </div>
  </Section>
);

export default SupplyProjectionsSection;
