import type { FC } from "react";
import { useTotalValueSecured } from "../api/total-value-secured";
import Summary from "../components/TotalValueSecured/Summary";
import TvsLeaderboard from "../components/TotalValueSecured/TvsLeaderboard";
import Section from "../../components/Section";

const TotalValueSecuredSection: FC = () => {
  const totalValueSecured = useTotalValueSecured();

  return (
    <Section
      title="total value secured—TVS"
      link="tvs"
      subtitle="securing the internet of value"
    >
      <div className="grid w-full gap-4 lg:grid-cols-2">
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
    </Section>
  );
};

export default TotalValueSecuredSection;
