import React, { FC, memo } from "react";
import { useAdminToken } from "../../../admin";
import { useContractsFreshness } from "../../../api/contracts";
import { useGroupedData1 } from "../../../api/grouped_stats_1";
import { LeaderboardEntry, Leaderboards } from "../../../api/leaderboards";
import { Unit } from "../../../denomination";
import { FeatureFlags } from "../../../feature-flags";
import styles from "../../../styles/Scrollbar.module.scss";
import { TimeFrameNext } from "../../../time_frames";
import Title from "../../widget-subcomponents/WidgetTitle";
import LeaderboardRow from "./LeaderboardRow";

const feePeriodToUpdateMap: Record<TimeFrameNext, keyof Leaderboards> = {
  m5: "leaderboard5m",
  h1: "leaderboard1h",
  d1: "leaderboard24h",
  d7: "leaderboard7d",
  d30: "leaderboard30d",
  all: "leaderboardAll",
};

const formatName = (rawName: unknown, address: unknown) => {
  if (typeof rawName !== "string" && typeof address !== "string") {
    // We have neither.
    return undefined;
  }

  if (typeof rawName !== "string") {
    if (typeof address !== "string") {
      // Should never happen. If there is no name there should always be an address available.
      return undefined;
    }

    return undefined;
  }

  // We have a name

  // It's possible the name is actually an address.
  // To deprecate this:
  // * deploy a frontend that falls back to address when name is missing.
  if (rawName.startsWith("0x") && rawName.length === 42) {
    return undefined;
    // return <FormattedAddress address={rawName} />;
  }

  // Contract names are really an encoded format of shape: `name: details`. We decode the name portion.
  // To deprecate this:
  // * deploy a frontend that relies on the detail field in leaderboard entries.
  const name = rawName.split(":")[0];
  return name;
};

const formatDetail = (rawName: unknown, detail: unknown) => {
  if (typeof rawName !== "string" && typeof detail !== "string") {
    return undefined;
  }

  if (typeof detail === "string") {
    return detail;
  }

  return undefined;
};

const getLeaderboardsAddresses = (leaderboards: Leaderboards) =>
  Object.values(leaderboards)
    .flatMap((leaderboardEntries) =>
      leaderboardEntries.map((entry) =>
        entry.type === "contract" ? entry.address : undefined,
      ),
    )
    .filter((mAddress): mAddress is string => mAddress !== undefined);

type Props = {
  featureFlags: FeatureFlags;
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
  unit: Unit;
};

const BurnLeaderboard: FC<Props> = ({
  featureFlags,
  onClickTimeFrame,
  timeFrame,
  unit,
}) => {
  const leaderboards = useGroupedData1()?.leaderboards;
  const selectedLeaderboard =
    leaderboards === undefined
      ? undefined
      : leaderboards[feePeriodToUpdateMap[timeFrame]];

  const leaderboardSkeletons = new Array(100).fill(
    {},
  ) as Partial<LeaderboardEntry>[];

  const adminToken = useAdminToken();
  const addresses =
    leaderboards === undefined
      ? undefined
      : getLeaderboardsAddresses(leaderboards);
  const freshnessMap = useContractsFreshness(addresses, adminToken);

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8 lg:h-full">
      <div
        className="flex flex-col gap-y-4 lg:h-0 lg:min-h-full"
        style={{ height: "32rem" }}
      >
        <Title
          onClickTimeFrame={onClickTimeFrame}
          title="burn leaderboard"
          timeFrame={timeFrame}
        />
        {/* the scrollbar normally hides, to make it appear as if floating to the right of the main content we add a negative right margin. */}
        <div
          className={`
            -mt-1 -mr-3
            overflow-y-auto overflow-x-hidden
            ${styles["styled-scrollbar"]}
          `}
        >
          {(selectedLeaderboard || leaderboardSkeletons).map((row, index) =>
            row.type === "contract" ? (
              <LeaderboardRow
                address={row.address}
                adminToken={adminToken}
                category={row.category || undefined}
                detail={formatDetail(row.name, row.detail)}
                fees={unit === "eth" ? row.fees : row.feesUsd}
                freshness={
                  row.address === undefined || freshnessMap === undefined
                    ? undefined
                    : freshnessMap[row.address]
                }
                image={row.image ?? undefined}
                isBot={row.isBot}
                key={row.address || index}
                name={formatName(row.name, row.address)}
                type={row.type}
                unit={unit}
                featureFlags={featureFlags}
              />
            ) : (
              <LeaderboardRow
                featureFlags={featureFlags}
                fees={unit === "eth" ? row.fees : row.feesUsd}
                key={row.type || index}
                name={formatName(row.name, undefined)}
                type={row.type}
                unit={unit}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(BurnLeaderboard);
