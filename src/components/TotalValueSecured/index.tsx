import { useTotalValueSecured } from "../../api/total-value-secured";
import Summary from "./Summary";
import TvsLeaderboard from "./TvsLeaderboard";

const TotalValueSecured = () => {
  const totalValueSecured = useTotalValueSecured();

  return (
    <>
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
    </>
  );
};

export default TotalValueSecured;
