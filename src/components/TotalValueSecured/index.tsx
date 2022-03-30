import { useContext } from "react";
import { useTotalValueSecured } from "../../api/total-value-secured";
import { FeatureFlagsContext } from "../../feature-flags";
import { A, O, pipe } from "../../fp";
import Summary from "./Summary";
import TvsLeaderboard from "./TvsLeaderboard";

const TotalValueSecured = () => {
  const totalValueSecured = useTotalValueSecured();
  const { showTop100Erc20 } = useContext(FeatureFlagsContext);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        <Summary />
        <TvsLeaderboard
          className="lg:col-start-2 lg:row-start-1 lg:row-end-3"
          rows={pipe(
            totalValueSecured?.erc20Leaderboard,
            O.fromNullable,
            O.map(A.takeLeft(showTop100Erc20 ? 100 : 20)),
            O.toUndefined,
          )}
          title="erc20 leaderboard"
          maxHeight="max-h-[23rem] lg:max-h-[564px]"
        />
        <TvsLeaderboard
          className=""
          rows={totalValueSecured?.nftLeaderboard}
          title="nft leaderboard"
          maxHeight="max-h-[224px]"
        />
      </div>
    </>
  );
};

export default TotalValueSecured;
