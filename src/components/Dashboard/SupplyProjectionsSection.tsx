import dynamic from "next/dynamic";
import type { FC } from "react";
import { Suspense } from "react";
import type { EthPriceStats } from "../../api/eth-price-stats";
import type { Scarcity } from "../../api/scarcity";
import BasicErrorBoundary from "../BasicErrorBoundary";
import SectionDivider from "../SectionDivider";
import SupplyView from "../SupplyView";
const EquilibriumWidget = dynamic(() => import("../EquilibriumWidget"), {
  ssr: false,
});

type Props = {
  ethPriceStats: EthPriceStats;
  scarcity: Scarcity | undefined;
};

const SupplyProjectionsSection: FC<Props> = () => (
  <BasicErrorBoundary>
    <Suspense>
      <div id="projection">
        <SectionDivider
          link="projection"
          subtitle="ultra sound money for years to come"
          title="supply projections"
        />
        <div className="flex flex-col gap-4 xs:px-4 md:px-16">
          <EquilibriumWidget />
          <div className="w-full md:m-auto relative bg-blue-tangaroa px-2 md:px-4 xl:px-12 py-4 md:py-8 xl:py-12 rounded-xl">
            <SupplyView />
          </div>
        </div>
      </div>
    </Suspense>
  </BasicErrorBoundary>
);

export default SupplyProjectionsSection;
