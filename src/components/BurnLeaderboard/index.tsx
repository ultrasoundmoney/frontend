import range from "lodash/range";
import type { FC, RefObject } from "react";
import { memo, useCallback, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { useContractsFreshness } from "../../api/contracts";
import {
  decodeGroupedAnalysis1,
  useGroupedAnalysis1,
} from "../../api/grouped-analysis-1";
import type { LeaderboardEntry, Leaderboards } from "../../api/leaderboards";
import type { Unit } from "../../denomination";
import { useAdminToken } from "../../hooks/use-admin-token";
import scrollbarStyles from "../../styles/Scrollbar.module.scss";
import type { TimeFrameNext } from "../../time-frames";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import Modal from "../Modal";
import FamTooltip from "../FamTooltip";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { BurnGroupBase } from "../WidgetSubcomponents";
import LeaderboardRow from "./LeaderboardRow";

const feePeriodToUpdateMap: Record<TimeFrameNext, keyof Leaderboards> = {
  m5: "leaderboard5m",
  h1: "leaderboard1h",
  d1: "leaderboard24h",
  d7: "leaderboard7d",
  d30: "leaderboard30d",
  since_burn: "leaderboardAll",
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
  const onTooltip = useRef<boolean>(false);
  const onImage = useRef<boolean>(false);

  const handleImageMouseEnter = useCallback(
    (entry: LeaderboardEntry, ref: RefObject<HTMLImageElement>) => {
      // The ranking data isn't there yet so no tooltip can be shown.
      if (
        entry === undefined ||
        entry.type !== "contract" ||
        entry.isBot === true
      ) {
        return;
      }

      onImage.current = true;

      // Delayed show.
      const id = window.setTimeout(() => {
        if (onImage.current || onTooltip.current) {
          setRefEl(ref.current);
          setSelectedEntry(entry);
          setShowTooltip(true);
        }
      }, 300);

      return () => window.clearTimeout(id);
    },
    [onImage, onTooltip],
  );

  const handleImageMouseLeave = useCallback(() => {
    onImage.current = false;

    // Delayed hide.
    const id = window.setTimeout(() => {
      if (!onImage.current && !onTooltip.current) {
        setShowTooltip(false);
        setSelectedEntry(undefined);
      }
    }, 300);

    return () => window.clearTimeout(id);
  }, [onImage, onTooltip]);

  const handleTooltipEnter = useCallback(() => {
    onTooltip.current = true;
  }, []);

  const handleTooltipLeave = useCallback(() => {
    onTooltip.current = false;

    // Delayed hide.
    const id = window.setTimeout(() => {
      if (!onImage.current && !onTooltip.current) {
        setShowTooltip(false);
        setSelectedEntry(undefined);
      }
    }, 100);

    return () => window.clearTimeout(id);
  }, [onImage, onTooltip]);

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
    popperStyles: styles,
  };
};

type Props = {
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
  unit: Unit;
};

const BurnLeaderboard: FC<Props> = ({ onClickTimeFrame, timeFrame, unit }) => {
  const groupedAnalysisF = useGroupedAnalysis1();
  const groupedAnalysis1 = decodeGroupedAnalysis1(groupedAnalysisF);
  const leaderboards = groupedAnalysis1?.leaderboards;
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
    popperStyles,
  } = useTooltip();

  const { md } = useActiveBreakpoint();

  return (
    <WidgetErrorBoundary title="burn total">
      <BurnGroupBase
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
            ${scrollbarStyles["styled-scrollbar-vertical"]}
            ${scrollbarStyles["styled-scrollbar"]}
          `}
        >
          {selectedLeaderboard === undefined
            ? range(0, 100).map((_, index) => <LeaderboardRow key={index} />)
            : selectedLeaderboard.map((entry, index) =>
                entry.type === "contract" ? (
                  <LeaderboardRow
                    address={entry.address}
                    adminToken={adminToken}
                    category={entry.category || undefined}
                    detail={formatDetail(entry.name, entry.detail)}
                    fees={unit === "eth" ? entry.fees : entry.feesUsd}
                    onClickImage={() =>
                      md ? () => undefined : handleClickImage(entry)
                    }
                    onMouseEnterImage={(ref) =>
                      !md ? () => undefined : handleImageMouseEnter(entry, ref)
                    }
                    onMouseLeaveImage={() =>
                      !md ? () => undefined : handleImageMouseLeave()
                    }
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
      </BurnGroupBase>
      <>
        <div
          ref={setPopperEl}
          className="z-20 hidden p-4 md:block"
          style={{
            ...popperStyles.popper,
            visibility: showTooltip && md ? "visible" : "hidden",
          }}
          {...attributes.popper}
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
        >
          <FamTooltip
            contractAddresses={
              selectedEntry === undefined ? undefined : [selectedEntry.address]
            }
            description={selectedEntry?.twitterBio}
            links={selectedEntry?.twitterLinks}
            famFollowerCount={selectedEntry?.famFollowerCount}
            followerCount={selectedEntry?.followerCount}
            imageUrl={selectedEntry?.image ?? undefined}
            onClickClose={() => setSelectedEntry(undefined)}
            title={selectedEntry?.twitterName}
            twitterUrl={selectedEntry?.twitterUrl}
            width="min-w-[18rem] max-w-sm"
          />
        </div>
        <Modal
          onClickBackground={() => setSelectedEntry(undefined)}
          show={!md && selectedEntry !== undefined}
        >
          {!md && selectedEntry !== undefined && (
            <FamTooltip
              contractAddresses={[selectedEntry.address]}
              description={selectedEntry.twitterBio}
              famFollowerCount={selectedEntry.famFollowerCount}
              followerCount={selectedEntry.followerCount}
              imageUrl={selectedEntry.image ?? undefined}
              onClickClose={() => setSelectedEntry(undefined)}
              title={selectedEntry.twitterName}
              twitterUrl={selectedEntry.twitterUrl}
              width="min-w-[18rem] max-w-sm"
            />
          )}
        </Modal>
      </>
    </WidgetErrorBoundary>
  );
};

export default memo(BurnLeaderboard);
