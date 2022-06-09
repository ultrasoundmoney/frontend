import React, { FC, memo } from "react";
import { Leaderboards, useFeeData } from "../../api";
import { TimeFrame } from "../../time_frames";
import { Unit } from "../ComingSoon/CurrencyControl";
import { WidgetTitle } from "../WidgetBits";
import LeaderboardRow from "./LeaderboardRow";

type ContractEntry = {
  address: string;
  category: string | null;
  detail: string | null;
  fees: number;
  feesUsd: number;
  image: string | null;
  isBot: boolean;
  name: string | null;
  twitterDescription: string | null;
  twitterHandle: string | null;
  twitterName: string | null;
  type: "contract";
  /**
   * @deprecated
   */
  id: string;
};

type EthTransfersEntry = {
  type: "eth-transfers";
  name: string;
  fees: number;
  feesUsd: number;
  /**
   * @deprecated
   */
  id: string;
};

type ContractCreationsEntry = {
  type: "contract-creations";
  name: string;
  fees: number;
  feesUsd: number;
  /**
   * @deprecated
   */
  id: string;
};

// Name is undefined because we don't always know the name for a contract. Image is undefined because we don't always have an image for a contract. Address is undefined because base fees paid for ETH transfers are shared between many addresses.
export type LeaderboardEntry =
  | ContractEntry
  | EthTransfersEntry
  | ContractCreationsEntry;

const feePeriodToUpdateMap: Record<TimeFrame, keyof Leaderboards> = {
  "5m": "leaderboard5m",
  "1h": "leaderboard1h",
  "24h": "leaderboard24h",
  "7d": "leaderboard7d",
  "30d": "leaderboard30d",
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

type Props = {
  onClickTimeFrame: () => void;
  timeFrame: TimeFrame;
  unit: Unit;
};

const BurnLeaderboard: FC<Props> = ({ onClickTimeFrame, timeFrame, unit }) => {
  const leaderboards = useFeeData()?.leaderboards;
  const selectedLeaderboard =
    leaderboards === undefined
      ? undefined
      : leaderboards[feePeriodToUpdateMap[timeFrame]];

  const leaderboardSkeletons: Partial<LeaderboardEntry>[] = new Array(100).fill(
    {}
  );

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8 lg:h-full">
      <div
        className="flex flex-col gap-y-4 lg:h-0 lg:min-h-full"
        style={{ height: "32rem" }}
      >
        <WidgetTitle
          onClickTimeFrame={onClickTimeFrame}
          title="burn leaderboard"
          timeFrame={timeFrame}
        />
        {/* the scrollbar normally hides, to make it appear as if floating to the right of the main content we add a negative right margin. */}
        <div className="overflow-y-auto overflow-x-hidden leaderboard-scroller -mt-1 -mr-3">
          {(selectedLeaderboard || leaderboardSkeletons).map((row, index) =>
            row.type === "contract" ? (
              <LeaderboardRow
                address={row.address}
                category={row.category || undefined}
                detail={formatDetail(row.name, row.detail)}
                fees={unit === "eth" ? row.fees : row.feesUsd}
                image={row.image ?? undefined}
                isBot={row.isBot}
                key={row.address || index}
                name={formatName(row.name, row.address)}
                type={row.type}
                unit={unit}
              />
            ) : (
              <LeaderboardRow
                fees={unit === "eth" ? row.fees : row.feesUsd}
                key={row.type || index}
                name={formatName(row.name, undefined)}
                type={row.type}
                unit={unit}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(BurnLeaderboard);
