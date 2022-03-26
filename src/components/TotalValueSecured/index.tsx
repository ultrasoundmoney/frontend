import { useCallback, useState } from "react";
import {
  TvsRanking,
  useTotalValueSecured,
} from "../../api/total-value-secured";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import { Modal } from "../Modal";
import Tooltip from "../Tooltip";
import Summary from "./Summary";
import TvsLeaderboard from "./TvsLeaderboard";

const TotalValueSecured = () => {
  const totalValueSecured = useTotalValueSecured();
  const [selectedRanking, setSelectedRanking] = useState<TvsRanking>();
  const { md } = useActiveBreakpoint();
  const tooltipTitle = selectedRanking?.tooltipName?.split(":")[0];

  const handleSelectRanking = useCallback(
    (profile: TvsRanking | undefined) => {
      if (md) {
        return;
      }

      setSelectedRanking(profile);
    },
    [md, setSelectedRanking],
  );

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        <Summary />
        <TvsLeaderboard
          className="lg:col-start-2 lg:row-start-1 lg:row-end-3"
          rows={totalValueSecured?.erc20Leaderboard}
          title="erc20 leaderboard"
          maxHeight="max-h-[23rem] lg:max-h-[34rem]"
          onSelectRanking={handleSelectRanking}
        />
        <TvsLeaderboard
          className=""
          rows={totalValueSecured?.nftLeaderboard}
          title="nft leaderboard"
          maxHeight="max-h-[224px]"
          onSelectRanking={handleSelectRanking}
        />
      </div>
      <Modal
        onClickBackground={() => setSelectedRanking(undefined)}
        show={selectedRanking !== undefined}
      >
        <Tooltip
          coingeckoUrl={selectedRanking?.coinGeckoUrl}
          description={selectedRanking?.tooltipDescription}
          famFollowerCount={selectedRanking?.famFollowerCount}
          followerCount={selectedRanking?.followerCount}
          imageUrl={selectedRanking?.imageUrl}
          nftGoUrl={selectedRanking?.nftGoUrl}
          onClickClose={() => setSelectedRanking(undefined)}
          show={selectedRanking !== undefined}
          title={selectedRanking?.tooltipName?.split(":")[0]}
          twitterUrl={selectedRanking?.twitterUrl}
        />
      </Modal>
    </>
  );
};

export default TotalValueSecured;
