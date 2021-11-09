import React, { FC, memo } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useFeeData } from "../../api";
import { Unit } from "../ComingSoon";
import { Timeframe } from "../FeePeriodControl";
import { WidgetBackground, WidgetTitle } from "../WidgetBits";
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

type Props = { timeframe: Timeframe; unit: Unit };

const BurnLeaderboard: FC<Props> = ({ timeframe, unit }) => {
  const { leaderboards } = useFeeData();
  const selectedLeaderboard: LeaderboardEntry[] | undefined =
    leaderboards && leaderboards[feePeriodToUpdateMap[timeframe]];

  return (
    <WidgetBackground>
      <WidgetTitle title="burn leaderboard" timeframe={timeframe} />
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
    </WidgetBackground>
  );
};

export default memo(BurnLeaderboard);
