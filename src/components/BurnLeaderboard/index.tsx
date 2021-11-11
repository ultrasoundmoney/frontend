import React, { FC, memo } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useFeeData } from "../../api";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import { Unit } from "../ComingSoon";
import { TimeFrame } from "../TimeFrameControl";
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

const feePeriodToUpdateMap: Record<TimeFrame, string> = {
  "5m": "leaderboard5m",
  "1h": "leaderboard1h",
  "24h": "leaderboard24h",
  "7d": "leaderboard7d",
  "30d": "leaderboard30d",
  all: "leaderboardAll",
};

type Props = { onClickTimeFrame: () => void; timeFrame: TimeFrame; unit: Unit };

const BurnLeaderboard: FC<Props> = ({ onClickTimeFrame, timeFrame, unit }) => {
  const { leaderboards } = useFeeData();
  const { lg } = useActiveBreakpoint();
  const selectedLeaderboard: LeaderboardEntry[] | undefined =
    leaderboards && leaderboards[feePeriodToUpdateMap[timeFrame]];

  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-8">
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
          <div
            className="overflow-auto leaderboard-scroller -mt-1"
            // Could be solved with a ref to the left column + layout effect?, copying its height.
            style={{ height: lg ? "39.95rem" : "39.65rem" }}
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
    </WidgetBackground>
  );
};

export default memo(BurnLeaderboard);
