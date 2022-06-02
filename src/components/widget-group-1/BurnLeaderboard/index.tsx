import React, { FC, memo, RefObject, useCallback, useState } from "react";
import { usePopper } from "react-popper";
import { useAdminToken } from "../../../admin";
import { useContractsFreshness } from "../../../api/contracts";
import { useGroupedAnalysis1 } from "../../../api/grouped-analysis-1";
import { LeaderboardEntry, Leaderboards } from "../../../api/leaderboards";
import { Unit } from "../../../denomination";
import { NEA, O, pipe } from "../../../fp";
import scrollbarStyles from "../../../styles/Scrollbar.module.scss";
import { TimeFrameNext } from "../../../time-frames";
import { useActiveBreakpoint } from "../../../utils/use-active-breakpoint";
import Modal from "../../Modal";
import Tooltip from "../../Tooltip";
import { Group1Base } from "../../widget-subcomponents";
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

const useTooltip = () => {
  const { md } = useActiveBreakpoint();

  // Tooltip logic to be abstracted
  // Popper Tooltip
  const [refEl, setRefEl] = useState<HTMLImageElement | null>(null);
  const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(refEl, popperEl, {
    placement: "right",
    modifiers: [
      {
        name: "flip",
      },
    ],
  });
  const [selectedEntry, setSelectedEntry] = useState<
    LeaderboardEntry & { type: "contract" }
  >();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTimer, setShowTimer] = useState<number>();
  const [hideTimer, setHideTimer] = useState<number>();

  const handleImageMouseEnter = useCallback(
    (entry: LeaderboardEntry, ref: RefObject<HTMLImageElement>) => {
      // The ranking data isn't there yet so no tooltip can be shown.
      if (entry === undefined || entry.type !== "contract") {
        return;
      }

      // If we were waiting to hide, we're hovering again, so leave the tooltip open.
      window.clearTimeout(hideTimer);

      const id = window.setTimeout(() => {
        setRefEl(ref.current);
        setSelectedEntry(entry);
        setShowTooltip(true);
      }, 300);
      setShowTimer(id);

      return () => window.clearTimeout(id);
    },
    [hideTimer],
  );

  const handleImageMouseLeave = useCallback(() => {
    // If we were waiting to show, we stopped hovering, so stop waiting and don't show any tooltip.
    window.clearTimeout(showTimer);

    // If we never made it passed waiting and opened the tooltip, there is nothing to hide.
    if (selectedEntry === undefined) {
      return;
    }

    const id = window.setTimeout(() => {
      setShowTooltip(false);
    }, 300);
    setHideTimer(id);

    return () => window.clearTimeout(id);
  }, [setHideTimer, showTimer, selectedEntry]);

  const handleTooltipEnter = useCallback(() => {
    // If we were waiting to hide, we're hovering again, so leave the tooltip open.
    window.clearTimeout(hideTimer);
  }, [hideTimer]);

  const handleTooltipLeave = useCallback(() => {
    const id = window.setTimeout(() => {
      setShowTooltip(false);
    }, 100);
    setHideTimer(id);

    return () => window.clearTimeout(id);
  }, []);

  const handleClickImage = useCallback(
    (ranking: LeaderboardEntry | undefined) => {
      if (md || ranking?.type !== "contract") {
        return;
      }

      setSelectedEntry(ranking);
    },
    [md, setSelectedEntry],
  );

  return {
    attributes,
    handleClickImage,
    handleImageMouseEnter,
    handleImageMouseLeave,
    handleTooltipEnter,
    handleTooltipLeave,
    selectedEntry,
    setPopperEl,
    setSelectedEntry,
    showTooltip,
    styles,
  };
};

type Props = {
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
  unit: Unit;
};

const BurnLeaderboard: FC<Props> = ({ onClickTimeFrame, timeFrame, unit }) => {
  const leaderboards = useGroupedAnalysis1()?.leaderboards;
  const selectedLeaderboard =
    leaderboards === undefined
      ? undefined
      : leaderboards[feePeriodToUpdateMap[timeFrame]];

  const adminToken = useAdminToken();
  const addresses =
    leaderboards === undefined
      ? undefined
      : getLeaderboardsAddresses(leaderboards);
  const freshnessMap = useContractsFreshness(addresses, adminToken);

  const {
    attributes,
    handleClickImage,
    handleTooltipEnter,
    handleTooltipLeave,
    handleImageMouseLeave,
    handleImageMouseEnter,
    selectedEntry,
    setPopperEl,
    setSelectedEntry,
    showTooltip,
    styles,
  } = useTooltip();

  const { md } = useActiveBreakpoint();

  return (
    <>
      <Group1Base
        backgroundClassName="flex flex-col gap-y-4 h-[32rem] lg:h-full"
        onClickTimeFrame={onClickTimeFrame}
        title="burn leaderboard"
        timeFrame={timeFrame}
      >
        {/* the scrollbar normally hides, to make it appear as if floating to the right of the main content we add a negative right margin. */}
        <div
          className={`
            -mt-1 -mr-3
            overflow-y-auto overflow-x-hidden
            ${scrollbarStyles["styled-scrollbar"]}
          `}
        >
          {selectedLeaderboard === undefined
            ? NEA.range(0, 100).map((_, index) => (
                <LeaderboardRow key={index} />
              ))
            : selectedLeaderboard.map((entry, index) =>
                entry.type === "contract" ? (
                  <LeaderboardRow
                    address={entry.address}
                    adminToken={adminToken}
                    category={entry.category || undefined}
                    detail={formatDetail(entry.name, entry.detail)}
                    fees={unit === "eth" ? entry.fees : entry.feesUsd}
                    onClickImage={() => handleClickImage(entry)}
                    onMouseEnterImage={(ref) =>
                      handleImageMouseEnter(entry, ref)
                    }
                    onMouseLeaveImage={handleImageMouseLeave}
                    freshness={
                      entry.address === undefined || freshnessMap === undefined
                        ? undefined
                        : freshnessMap[entry.address]
                    }
                    image={entry.image ?? undefined}
                    isBot={entry.isBot}
                    key={entry.address}
                    name={formatName(entry.name, entry.address)}
                    type={entry.type}
                    unit={unit}
                  />
                ) : (
                  <LeaderboardRow
                    fees={unit === "eth" ? entry.fees : entry.feesUsd}
                    key={entry.type || index}
                    name={formatName(entry.name, undefined)}
                    type={entry.type}
                    unit={unit}
                  />
                ),
              )}
        </div>
      </Group1Base>
      <>
        <div
          ref={setPopperEl}
          className="z-20 hidden md:block p-4"
          style={{
            ...styles.popper,
            visibility: showTooltip ? "visible" : "hidden",
          }}
          {...attributes.popper}
          onMouseOver={handleTooltipEnter}
          onMouseOut={handleTooltipLeave}
        >
          <Tooltip
            contractAddresses={pipe(
              selectedEntry?.address,
              O.fromNullable,
              O.map((address) => [address]),
              O.getOrElseW(() => []),
            )}
            description={selectedEntry?.twitterBio}
            links={selectedEntry?.twitterLinks}
            famFollowerCount={selectedEntry?.famFollowerCount}
            followerCount={selectedEntry?.followerCount}
            imageUrl={selectedEntry?.image ?? undefined}
            onClickClose={() => setSelectedEntry(undefined)}
            title={selectedEntry?.twitterName}
            twitterUrl={selectedEntry?.twitterUrl}
          />
        </div>
        <Modal
          onClickBackground={() => setSelectedEntry(undefined)}
          show={!md && selectedEntry !== undefined}
        >
          {!md && selectedEntry !== undefined && (
            <Tooltip
              contractAddresses={pipe(
                selectedEntry.address,
                O.fromNullable,
                O.map((address) => [address]),
                O.getOrElseW(() => []),
              )}
              description={selectedEntry.twitterBio}
              famFollowerCount={selectedEntry.famFollowerCount}
              followerCount={selectedEntry.followerCount}
              imageUrl={selectedEntry.image ?? undefined}
              onClickClose={() => setSelectedEntry(undefined)}
              title={selectedEntry.twitterName}
              twitterUrl={selectedEntry.twitterUrl}
            />
          )}
        </Modal>
      </>
    </>
  );
};

export default memo(BurnLeaderboard);
