import dynamic from "next/dynamic";
import type { FC } from "react";
import BasicErrorBoundary from "../BasicErrorBoundary";
import SectionDivider from "../SectionDivider";
import SupplyView from "../SupplyView";
const EquilibriumWidget = dynamic(() => import("../EquilibriumWidget"), {
  ssr: false,
});

const SupplyProjectionsSection: FC = () => (
  <BasicErrorBoundary>
    <div id="projection" className="mt-16">
      <SectionDivider
        link="projection"
        subtitle="ultra sound for decades to come"
        title="supply projections"
      />
      <div className="flex flex-col gap-4 xs:px-4 md:px-16">
        <EquilibriumWidget />
        <div className="relative w-full rounded-xl bg-blue-tangaroa px-2 py-4 md:m-auto md:px-4 md:py-8 xl:px-12 xl:py-12">
          <SupplyView />
        </div>
      </div>
    </div>
  </BasicErrorBoundary>
);

export default SupplyProjectionsSection;
