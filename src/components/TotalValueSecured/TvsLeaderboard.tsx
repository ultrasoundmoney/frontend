import { FC, HTMLAttributes } from "react";
import { TvsRanking } from "../../api/total-value-secured";
import scrollbarStyles from "../../styles/Scrollbar.module.scss";
import { AmountBillionsUsdAnimated } from "../Amount";
import ImageWithTooltip from "../ImageWithTooltip";
import Link from "../Link";
import { TextInter } from "../Texts";
import { WidgetBackground, WidgetTitle } from "../widget-subcomponents";

type TvsLeaderboardProps = {
  className?: HTMLAttributes<HTMLDivElement>["className"];
  rows: TvsRanking[] | undefined;
  title: string;
  maxHeight?: string;
  onSelectRanking: (ranking: TvsRanking) => void;
};

const TvsLeaderboard: FC<TvsLeaderboardProps> = ({
  className = "",
  maxHeight = "",
  rows,
  title,
  onSelectRanking,
}) => {
  const leaderboardSkeletons = new Array(20).fill({}) as Partial<TvsRanking>[];

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
          {(rows || leaderboardSkeletons).map((row) => (
            <li className="flex items-center" key={row.name}>
              <ImageWithTooltip
                className="w-8 h-8"
                coingeckoUrl={row?.coinGeckoUrl}
                description={row?.tooltipDescription}
                famFollowerCount={row?.famFollowerCount}
                followerCount={row?.followerCount}
                imageUrl={row.imageUrl}
                nftGoUrl={row?.nftGoUrl}
                onClickImage={() => onSelectRanking(row as TvsRanking)}
                title={row?.tooltipName?.split(":")[0]}
                tooltipImageUrl={row?.imageUrl}
                twitterUrl={row?.twitterUrl}
              />
              <Link
                className="flex justify-between ml-4 w-full truncate"
                href={row.coinGeckoUrl ?? row.nftGoUrl}
              >
                <div className="truncate">
                  <TextInter className="" skeletonWidth="6rem">
                    {row.name?.split(":")[0]}
                  </TextInter>
                  <TextInter className="hidden md:inline ml-2 font-extralight text-blue-shipcove uppercase">
                    {row.detail}
                  </TextInter>
                </div>
                <AmountBillionsUsdAnimated>
                  {row.marketCap}
                </AmountBillionsUsdAnimated>
              </Link>
            </li>
          ))}
        </ul>
      </WidgetBackground>
    </>
  );
};

export default TvsLeaderboard;
