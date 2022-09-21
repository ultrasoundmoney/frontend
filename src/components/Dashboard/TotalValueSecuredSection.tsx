import type { FC } from "react";
import { useTotalValueSecured } from "../../api/total-value-secured";
import BasicErrorBoundary from "../BasicErrorBoundary";
import SectionDivider from "../SectionDivider";
import Summary from "../TotalValueSecured/Summary";
import TvsLeaderboard from "../TotalValueSecured/TvsLeaderboard";

const TotalValueSecuredSection: FC = () => {
  const totalValueSecured = useTotalValueSecured();

  return (
    <div className="xs:px-4 md:px-16" id="tvs">
      <SectionDivider
        title="total value secured—TVS"
        link="tvs"
        subtitle="securing the internet of value"
      />
      <BasicErrorBoundary>
        <div className="flex flex-col" id="tvs">
          <div className="grid gap-4 lg:grid-cols-2">
            <Summary />
            <TvsLeaderboard
              className="lg:col-start-2 lg:row-start-1 lg:row-end-3"
              rows={totalValueSecured?.erc20Leaderboard}
              title="erc20 leaderboard"
              maxHeight="max-h-[23rem] lg:max-h-[564px]"
            />
            <TvsLeaderboard
              className="-mt-1"
              rows={totalValueSecured?.nftLeaderboard}
              title="nft leaderboard"
              maxHeight="max-h-[224px]"
            />
          </div>
        </div>
      </BasicErrorBoundary>
    </div>
  );
};

export default TotalValueSecuredSection;
