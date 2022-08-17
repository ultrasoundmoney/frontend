import type { FC, HTMLAttributes, RefObject } from "react";
import { useCallback, useContext, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { useAdminToken } from "../../admin";
import { useContractsFreshness } from "../../api/contracts";
import type { TvsRanking } from "../../api/total-value-secured";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import scrollbarStyles from "../../styles/Scrollbar.module.scss";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import { AmountBillionsUsdAnimated } from "../Amount";
import AdminControls from "../BurnGroup/BurnLeaderboard/AdminControls";
import ImageWithTooltip from "../ImageWithTooltip";
import Link from "../Link";
import Modal from "../Modal";
import { BodyText } from "../Texts";
import Tooltip from "../Tooltip";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";

type TvsLeaderboardProps = {
  className?: HTMLAttributes<HTMLDivElement>["className"];
  rows: TvsRanking[] | undefined;
  title: string;
  maxHeight?: string;
};

const TvsLeaderboard: FC<TvsLeaderboardProps> = ({
  className = "",
  maxHeight = "",
  rows,
  title,
}) => {
  const { md } = useActiveBreakpoint();
  const adminToken = useAdminToken();

  // Tooltip logic should be abstracted. See BurnLeaderboard tooltip. The abstraction over there could also be made more generic to support this if that makes sense instead of copying.
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
  const [selectedRanking, setSelectedRanking] = useState<TvsRanking>();
  const [showTooltip, setShowTooltip] = useState(false);
  const onTooltip = useRef<boolean>(false);
  const onImage = useRef<boolean>(false);

  const handleImageMouseEnter = useCallback(
    (ranking: TvsRanking, ref: RefObject<HTMLImageElement>) => {
      // The ranking data isn't there yet so no tooltip can be shown.
      if (ranking === undefined) {
        return;
      }

      onImage.current = true;

      const id = window.setTimeout(() => {
        setRefEl(ref.current);
        setSelectedRanking(ranking);
        setShowTooltip(true);
      }, 300);

      return () => window.clearTimeout(id);
    },
    [],
  );

  const handleImageMouseLeave = useCallback(() => {
    onImage.current = false;

    const id = window.setTimeout(() => {
      if (!onImage.current && !onTooltip.current) {
        setShowTooltip(false);
        setSelectedRanking(undefined);
      }
    }, 300);

    return () => window.clearTimeout(id);
  }, []);

  const handleTooltipEnter = useCallback(() => {
    onTooltip.current = true;
  }, []);

  const handleTooltipLeave = useCallback(() => {
    onTooltip.current = false;

    const id = window.setTimeout(() => {
      if (!onImage.current && !onTooltip.current) {
        setShowTooltip(false);
        setSelectedRanking(undefined);
      }
    }, 100);

    return () => window.clearTimeout(id);
  }, []);

  const handleClickProfile = useCallback(
    (ranking: TvsRanking | undefined) => {
      if (md) {
        return;
      }

      setSelectedRanking(ranking);
    },
    [md, setSelectedRanking],
  );

  const leaderboardSkeletons = new Array(100).fill({}) as undefined[];

  const addresses = rows?.map((row) => row.contractAddresses[0]);
  const freshnessMap = useContractsFreshness(addresses, adminToken);
  const { showMetadataTools } = useContext(FeatureFlagsContext);

  return (
    <>
      <WidgetBackground
        className={`flex flex-col gap-y-4 overflow-x-auto ${className}`}
      >
        <WidgetTitle>{title}</WidgetTitle>
        {/* the scrollbar normally hides, to make it appear as if floating to the right of the main content we add a negative right margin. */}
        <ul
          className={`
            flex flex-col
            overflow-y-auto ${maxHeight}
            gap-y-4
            pr-2 -mr-3
            h-full
            ${scrollbarStyles["styled-scrollbar"]}
          `}
        >
          {(rows || leaderboardSkeletons).map((row, index) => (
            <div key={row?.name ?? index}>
              <li className="text-white flex items-center">
                <ImageWithTooltip
                  className="w-8 h-8 select-none"
                  imageUrl={row?.imageUrl}
                  isDoneLoading={row !== undefined}
                  onMouseEnter={(ref) =>
                    !md || row === undefined
                      ? () => undefined
                      : handleImageMouseEnter(row, ref)
                  }
                  onMouseLeave={() =>
                    !md ? () => undefined : handleImageMouseLeave()
                  }
                  onClick={() =>
                    md || row === undefined
                      ? () => undefined
                      : handleClickProfile(row)
                  }
                  height={32}
                  width={32}
                />
                <Link
                  className="flex justify-between ml-4 w-full overflow-hidden"
                  href={row?.coinGeckoUrl || row?.nftGoUrl}
                >
                  <BodyText skeletonWidth="6rem" className="truncate">
                    {row?.name?.split(":")[0]}
                  </BodyText>
                  <BodyText
                    className={`
                      font-extralight text-blue-shipcove uppercase
                      pr-2 ml-2 mr-auto
                      hidden ${row?.detail !== undefined ? "md:inline" : ""}
                    `}
                  >
                    {row?.detail}
                  </BodyText>
                  <AmountBillionsUsdAnimated
                    tooltip={
                      row !== undefined
                        ? `${Format.formatZeroDecimals(row.marketCap)} USD`
                        : undefined
                    }
                  >
                    {row?.marketCap}
                  </AmountBillionsUsdAnimated>
                </Link>
              </li>
              {adminToken !== undefined &&
                row !== undefined &&
                freshnessMap !== undefined &&
                showMetadataTools && (
                  <AdminControls
                    address={row.contractAddresses[0]}
                    freshness={
                      row !== undefined
                        ? freshnessMap[row.contractAddresses[0]]
                        : undefined
                    }
                  />
                )}
            </div>
          ))}
        </ul>
      </WidgetBackground>
      <>
        <div
          ref={setPopperEl}
          className="z-20 hidden md:block p-4"
          style={{
            ...styles.popper,
            visibility: showTooltip && md ? "visible" : "hidden",
          }}
          {...attributes.popper}
          onMouseOver={handleTooltipEnter}
          onMouseOut={handleTooltipLeave}
        >
          <Tooltip
            contractAddresses={selectedRanking?.contractAddresses}
            coingeckoUrl={selectedRanking?.coinGeckoUrl}
            description={selectedRanking?.tooltipDescription}
            famFollowerCount={selectedRanking?.famFollowerCount}
            followerCount={selectedRanking?.followerCount}
            imageUrl={selectedRanking?.imageUrl}
            links={selectedRanking?.links ?? undefined}
            nftGoUrl={selectedRanking?.nftGoUrl}
            onClickClose={() => setSelectedRanking(undefined)}
            title={selectedRanking?.tooltipName?.split(":")[0]}
            twitterUrl={selectedRanking?.twitterUrl}
          />
        </div>
        <Modal
          onClickBackground={() => setSelectedRanking(undefined)}
          show={!md && selectedRanking !== undefined}
        >
          {!md && selectedRanking !== undefined && (
            <Tooltip
              contractAddresses={selectedRanking?.contractAddresses}
              coingeckoUrl={selectedRanking?.coinGeckoUrl}
              description={selectedRanking?.tooltipDescription}
              famFollowerCount={selectedRanking?.famFollowerCount}
              followerCount={selectedRanking?.followerCount}
              imageUrl={selectedRanking?.imageUrl}
              links={selectedRanking?.links ?? undefined}
              nftGoUrl={selectedRanking?.nftGoUrl}
              onClickClose={() => setSelectedRanking(undefined)}
              title={selectedRanking?.tooltipName?.split(":")[0]}
              twitterUrl={selectedRanking?.twitterUrl}
            />
          )}
        </Modal>
      </>
    </>
  );
};

export default TvsLeaderboard;
