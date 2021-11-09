import { FC, memo } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useFeeData } from "../../api";
import { formatZeroDigit } from "../../format";
import { Unit } from "../ComingSoon";
import { Timeframe } from "../FeePeriodControl";
import LeaderboardRow from "./LeaderboardRow";

export type LeaderboardEntry = {
  fees: number;
  feesUsd: number;
  id: string;
  isBot: boolean;
  name: string;
  type?: "eth-transfers" | "other" | "contract-creations";
  image: string | undefined;
  category: string | null;
};

const feePeriodToUpdateMap: Record<Timeframe, string> = {
  "5m": "leaderboard5m",
  "1h": "leaderboard1h",
  "24h": "leaderboard24h",
  "7d": "leaderboard7d",
  "30d": "leaderboard30d",
  all: "leaderboardAll",
};

const BurnLeaderboard: FC<{ timeframe: Timeframe; unit: Unit }> = ({
  timeframe,
  unit,
}) => {
  const { leaderboards } = useFeeData();
  const selectedLeaderboard: LeaderboardEntry[] | undefined =
    leaderboards && leaderboards[feePeriodToUpdateMap[timeframe]];

  const LONDON_TIMESTAMP = Date.parse("Aug 5 2021 12:33:42 UTC");
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceLondonFork = formatZeroDigit(
    Math.floor((Date.now() - LONDON_TIMESTAMP) / msPerDay)
  );

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8 h-full">
      <div className="flex flex-col justify-between items-start md:flex-row lg:flex-col xl:items-center xl:flex-row">
        <p className="font-inter font-light text-blue-spindle text-md mb-4 md:mb-0 lg:mb-4 xl:mb-0">
          <span className="uppercase">burn leaderboard</span>{" "}
          <span className="text-blue-manatee font-normal text-sm pl-2">
            ({timeframe === "all" ? `${daysSinceLondonFork}d` : `${timeframe}`})
          </span>
        </p>
      </div>
      {selectedLeaderboard === undefined ? (
        <p className="text-lg text-center text-gray-500 pt-16 pb-20">
          loading...
        </p>
      ) : (
        <div
          className="overflow-auto mt-4 leaderboard-scroller"
          style={{ height: "35.55rem" }}
        >
          <TransitionGroup
            component={null}
            appear={false}
            enter={true}
            exit={false}
          >
            {selectedLeaderboard.map((leaderboardRow) => (
              <CSSTransition
                classNames="fee-block"
                timeout={500}
                key={leaderboardRow.id}
              >
                <LeaderboardRow
                  key={leaderboardRow.name} // ??? should this be leaderboardRow.id?
                  name={leaderboardRow.name.split(":")[0]}
                  detail={leaderboardRow.name.split(":")[1]}
                  id={leaderboardRow.id}
                  isBot={leaderboardRow.isBot}
                  fees={
                    unit === "eth"
                      ? leaderboardRow.fees
                      : leaderboardRow.feesUsd
                  }
                  type={leaderboardRow.type || "other"}
                  image={leaderboardRow.image}
                  category={leaderboardRow.category}
                  unit={unit}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      )}
    </div>
  );
};

export default memo(BurnLeaderboard);
