import React, { FC, memo } from "react";
import { useFeeData } from "../../api";
import { Unit } from "../ComingSoon/CurrencyControl";
import { TimeFrame } from "../TimeFrameControl";
import { WidgetTitle } from "../WidgetBits";
import LeaderboardRow from "./LeaderboardRow";

type ContractEntry = {
  type: "contract";
  name: string | null;
  image: string | null;
  fees: number;
  feesUsd: number;
  address: string;
  category: string | null;
  isBot: boolean;
  twitterHandle: string | null;
  /* deprecated */
  id: string;
};

type EthTransfersEntry = {
  type: "eth-transfers";
  name: string;
  fees: number;
  feesUsd: number;
  /* deprecated */
  id: string;
};

type ContractCreationsEntry = {
  type: "contract-creations";
  name: string;
  fees: number;
  feesUsd: number;
  /* deprecated */
  id: string;
};

// Name is undefined because we don't always know the name for a contract. Image is undefined because we don't always have an image for a contract. Address is undefined because base fees paid for ETH transfers are shared between many addresses.
export type LeaderboardEntry =
  | ContractEntry
  | EthTransfersEntry
  | ContractCreationsEntry;

const feePeriodToUpdateMap: Record<TimeFrame, string> = {
  "5m": "leaderboard5m",
  "1h": "leaderboard1h",
  "24h": "leaderboard24h",
  "7d": "leaderboard7d",
  "30d": "leaderboard30d",
  all: "leaderboardAll",
};

type Props = {
  onClickTimeFrame: () => void;
  timeFrame: TimeFrame;
  unit: Unit;
};

const BurnLeaderboard: FC<Props> = ({ onClickTimeFrame, timeFrame, unit }) => {
  const { leaderboards } = useFeeData();
  const selectedLeaderboard: LeaderboardEntry[] | undefined =
    leaderboards && leaderboards[feePeriodToUpdateMap[timeFrame]];

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8">
      <div
        className="flex flex-col gap-y-4 lg:h-0 lg:min-h-full"
        style={{ height: "32rem" }}
      >
        <WidgetTitle
          onClickTimeFrame={onClickTimeFrame}
          title="burn leaderboard"
          timeFrame={timeFrame}
        />
        {selectedLeaderboard === undefined ? (
          <p className="text-lg text-center text-gray-500 pt-16 pb-20">
            loading...
          </p>
        ) : (
          <div className="overflow-auto leaderboard-scroller -mt-1">
            {selectedLeaderboard.map((row) =>
              row.type === "contract" ? (
                <LeaderboardRow
                  key={row.address}
                  name={(row.name || "").split(":")[0]}
                  detail={(row.name || "").split(":")[1]}
                  id={row.id}
                  isBot={row.isBot}
                  fees={unit === "eth" ? row.fees : row.feesUsd}
                  type={row.type || "other"}
                  image={row.image ?? undefined}
                  category={row.category}
                  unit={unit}
                />
              ) : row.type === "eth-transfers" ||
                row.type === "contract-creations" ? (
                <LeaderboardRow
                  key={row.type}
                  name={row.name.split(":")[0]}
                  detail={row.name.split(":")[1]}
                  id={row.id}
                  isBot={false}
                  fees={unit === "eth" ? row.fees : row.feesUsd}
                  type={row.type || "other"}
                  image={undefined}
                  category={null}
                  unit={unit}
                />
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(BurnLeaderboard);
