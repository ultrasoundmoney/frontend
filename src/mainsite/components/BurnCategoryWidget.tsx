import type { Dispatch, FC } from "react";
import { useMemo } from "react";
import { useReducer } from "react";
import { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import type { BurnCategory, CategoryId } from "../api/burn-categories";
import { useBurnCategories, categoryDisplayMap } from "../api/burn-categories";
import Colors from "../../colors";
import { WEI_PER_ETH } from "../../eth-units";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import type { TimeFrame } from "../time-frames";
import { timeFrames } from "../time-frames";
import { BaseText } from "../../components/Texts";
import LabelText from "../../components/TextsNext/LabelText";
import BurnGroupBase from "./BurnGroupBase";
import QuantifyText from "../../components/TextsNext/QuantifyText";
import SkeletonText from "../../components/TextsNext/SkeletonText";
import { useBurnSums } from "../api/burn-sums";
import { A, flow, N, O, OAlt, OrdM, pipe, RA, Record } from "../../fp";
import { useGroupedAnalysis1 } from "../api/grouped-analysis-1";
import { leaderboardKeyFromTimeFrame } from "./BurnLeaderboard";
import questionMarkSlateus from "../../assets/question-mark-slateus.svg";
import questionMarkOwn from "../../assets/question-mark-own.svg";
import paletteSlateus from "../../assets/palette-slateus.svg";
import paletteOwn from "../../assets/palette-own.svg";
import robotSlateus from "../../assets/robot-slateus.svg";
import robotOwn from "../../assets/robot-own.svg";
import moneyWingsSlateus from "../../assets/money-wings-slateus.svg";
import moneyWingsOwn from "../../assets/money-wings-own.svg";
import dotsSlateus from "../../assets/dots-slateus.svg";
import dotsOwn from "../../assets/dots-own.svg";
import transfersSlateus from "../../assets/transfers-slateus.svg";
import transfersOwn from "../../assets/transfers-own.svg";
import chainsSlateus from "../../assets/chains-slateus.svg";
import chainsOwn from "../../assets/chains-own.svg";
import copySlateus from "../../assets/copy-slateus.svg";
import copyOwn from "../../assets/copy-own.svg";
import bridgeSlateus from "../../assets/bridge-slateus.svg";
import bridgeOwn from "../../assets/bridge-own.svg";
import chartSlateus from "../../assets/chart-slateus.svg";
import chartOwn from "../../assets/chart-own.svg";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { OnClick } from "../../components/TimeFrameControl";

type CategoryProps = {
  id: CategoryId;
  fees: number | undefined;
  feesUsd: number | undefined;
  transactionCount: number | undefined;
  percentOfTotalBurn: number | undefined;
  percentOfTotalBurnUsd: number | undefined;
  imgAlt: string;
  imgName: { coloron: StaticImageData; coloroff: StaticImageData };
  onHoverCategory: (hovering: boolean) => void;
  showHighlight: boolean;
};

type CategorySegmentProps = {
  imgAlt: string;
  imgName: { coloron: StaticImageData; coloroff: StaticImageData };
  onHoverCategory: (hovering: boolean) => void;
  percentOfTotalBurn: number | undefined;
  rounded?: "left" | "right";
  showHighlight: boolean;
};

const activeCategories: CategoryId[] = [
  "nft",
  "l2",
  "mev",
  "defi",
  "transfers",
  "creations",
];

const alwaysShowImgPercentThreshold = 0.08;
const separatorWidth = 1;
// -1 because separators are in between items, +1 because we add misc.
const separatorCount = activeCategories.length - 1 + 1;
const skeletonLoadingWidth = 0.1;

const CategorySegment: FC<CategorySegmentProps> = ({
  imgAlt,
  imgName,
  onHoverCategory,
  percentOfTotalBurn,
  rounded,
  showHighlight,
}) => (
  <div
    className="flex flex-col items-center select-none"
    style={{
      width: `calc(${(percentOfTotalBurn ?? 0.1) * 100}% - ${
        separatorWidth * separatorCount
      }px)`,
    }}
    onMouseEnter={() => onHoverCategory(true)}
    onMouseLeave={() => onHoverCategory(false)}
  >
    <Image
      className="relative w-6"
      height={21}
      width={21}
      src={imgName.coloroff}
      alt={imgAlt}
      style={{
        height: "21px",
        marginBottom: "12px",
        visibility:
          percentOfTotalBurn === undefined
            ? "hidden"
            : percentOfTotalBurn < alwaysShowImgPercentThreshold
            ? "hidden"
            : "visible",
      }}
    />
    <Image
      className="absolute w-6"
      height={21}
      width={21}
      src={imgName.coloron}
      alt="colored ice crystal, signifying staked ETH"
      style={{
        height: "21px",
        marginBottom: "12px",
        visibility:
          percentOfTotalBurn === undefined
            ? "hidden"
            : showHighlight
            ? "visible"
            : "hidden",
      }}
    />
    <div
      className={`color-animation h-2 w-full bg-slateus-200 ${
        rounded === "left"
          ? "rounded-l-full"
          : rounded === "right"
          ? "rounded-r-full"
          : ""
      }`}
      style={{
        backgroundColor: showHighlight ? Colors.white : Colors.slateus200,
      }}
    ></div>
    <div style={{ marginTop: "9px" }}>
      {percentOfTotalBurn === undefined ? (
        <Skeleton width="1.5rem" />
      ) : (
        <BaseText
          font="font-roboto"
          className={`color-animation ${
            !showHighlight && percentOfTotalBurn < alwaysShowImgPercentThreshold
              ? "invisible"
              : "visible"
          }`}
          style={{
            color: showHighlight ? Colors.white : Colors.slateus200,
          }}
        >
          {Format.formatZeroDecimals(
            (percentOfTotalBurn ?? skeletonLoadingWidth) * 100,
          )}
          %
        </BaseText>
      )}
    </div>
  </div>
);

type CategoryRowProps = {
  amountFormatted: string | undefined;
  countFormatted: string | undefined;
  hovering: boolean;
  id: CategoryId;
  link?: string;
  name: string;
  setHovering: Dispatch<HighlightAction>;
  showCategoryCounts: boolean;
};

const CategoryRow: FC<CategoryRowProps> = ({
  amountFormatted,
  countFormatted,
  hovering,
  id,
  name,
  setHovering,
  showCategoryCounts = false,
}) => (
  <div
    className={`
      grid
      grid-cols-2
      ${showCategoryCounts ? "md:grid-cols-3" : ""}
    `}
    onMouseEnter={() => setHovering({ type: "highlight", category: id })}
    onMouseLeave={() => setHovering({ type: "unhighlight", category: id })}
    style={{ opacity: hovering ? 0.6 : 1 }}
  >
    <BaseText font="font-inter" size="text-base md:text-lg">
      {name}
    </BaseText>
    <QuantifyText
      className="text-right"
      size="text-base md:text-lg"
      unitPostfix="ETH"
    >
      <SkeletonText className="text-right" width="4rem">
        {amountFormatted}
      </SkeletonText>
    </QuantifyText>
    <QuantifyText
      className={`
        hidden
        text-right ${showCategoryCounts ? "md:block" : ""}
      `}
    >
      {countFormatted === undefined ? (
        <Skeleton width="5rem" />
      ) : (
        <BaseText font="font-roboto" className="text-right">
          {countFormatted}
        </BaseText>
      )}
    </QuantifyText>
  </div>
);

const formatFees = (num: number | undefined): string | undefined =>
  num === undefined
    ? undefined
    : flow((num: number) => num / WEI_PER_ETH, Format.formatZeroDecimals)(num);

const formatCount = (num: number | undefined): string | undefined =>
  num === undefined
    ? undefined
    : flow(
        (num: number) => num / 10 ** 3,
        (num) => Format.formatOneDecimal(num) + "K",
      )(num);

const buildMiscCategory = (
  burnCategories: BurnCategory[],
  activeCategories: CategoryId[],
  setHoveringMisc: (bool: boolean) => void,
  hoveringMisc: boolean,
): CategoryProps =>
  burnCategories
    .filter((category) => !activeCategories.includes(category.category))
    .reduce(
      (sumCategory, category) => ({
        ...sumCategory,
        fees: (sumCategory.fees ?? 0) + category.fees,
        feesUsd: (sumCategory.feesUsd ?? 0) + category.feesUsd,
        transactionCount:
          (sumCategory.transactionCount ?? 0) + category.transactionCount,
        percentOfTotalBurn:
          (sumCategory.percentOfTotalBurn ?? 0) + category.percentOfTotalBurn,
        percentOfTotalBurnUsd:
          (sumCategory.percentOfTotalBurnUsd ?? 0) +
          category.percentOfTotalBurnUsd,
        onHoverCategory: setHoveringMisc,
        showHighlight: hoveringMisc,
      }),
      {
        id: "misc",
        imgName: {
          coloroff: dotsSlateus as StaticImageData,
          coloron: dotsOwn as StaticImageData,
        },
        imgAlt:
          "three dots, signaling the summing of other contracts that have been categorized",
        fees: 0,
        feesUsd: 0,
        transactionCount: 0,
        percentOfTotalBurn: 0,
        percentOfTotalBurnUsd: 0,
        onHoverCategory: setHoveringMisc,
        showHighlight: hoveringMisc,
      } as CategoryProps,
    );

const imgAltMap: Record<CategoryId, string> = {
  "l1-bridge": "a bridge, signaling L1 bridge fees",
  cex: "a bridge, signaling CEX bridge fees",
  defi: "an image of flying money, signaling DeFi",
  gaming: "a game controller, signaling gaming",
  l1: "a bridge, signaling L1 fees",
  l2: "a bridge, signaling L2 fees",
  mev: "a robot, signaling bots extracting miner-extractable-value",
  misc: "three dots, signaling the summing of other contracts that have been categorized",
  nft: "icon of a wooden painters palette, signaling NFTs",
  transfers: "an image of flying money, signaling ETH transfers",
  creations: "a copy icon, signaling contract creations",
  woof: "a dog, signaling meme tokens",
};

const imgMap: Record<
  CategoryId,
  { coloroff: StaticImageData; coloron: StaticImageData }
> = {
  cex: {
    coloroff: chartSlateus as StaticImageData,
    coloron: chartOwn as StaticImageData,
  },
  nft: {
    coloroff: paletteSlateus as StaticImageData,
    coloron: paletteOwn as StaticImageData,
  },
  defi: {
    coloroff: moneyWingsSlateus as StaticImageData,
    coloron: moneyWingsOwn as StaticImageData,
  },
  gaming: {
    coloroff: questionMarkSlateus as StaticImageData,
    coloron: questionMarkOwn as StaticImageData,
  },
  l1: {
    coloroff: questionMarkSlateus as StaticImageData,
    coloron: questionMarkOwn as StaticImageData,
  },
  "l1-bridge": {
    coloroff: bridgeSlateus as StaticImageData,
    coloron: bridgeOwn as StaticImageData,
  },
  l2: {
    coloroff: chainsSlateus as StaticImageData,
    coloron: chainsOwn as StaticImageData,
  },
  mev: {
    coloroff: robotSlateus as StaticImageData,
    coloron: robotOwn as StaticImageData,
  },
  misc: {
    coloroff: dotsSlateus as StaticImageData,
    coloron: dotsOwn as StaticImageData,
  },
  transfers: {
    coloroff: transfersSlateus as StaticImageData,
    coloron: transfersOwn as StaticImageData,
  },
  creations: {
    coloroff: copySlateus as StaticImageData,
    coloron: copyOwn as StaticImageData,
  },
  woof: {
    coloroff: questionMarkSlateus as StaticImageData,
    coloron: questionMarkOwn as StaticImageData,
  },
};

const initialState: Record<CategoryId, boolean> = {
  "l1-bridge": false,
  cex: false,
  defi: false,
  gaming: false,
  l1: false,
  l2: false,
  mev: false,
  misc: false,
  nft: false,
  transfers: false,
  creations: false,
  woof: false,
};

type HighlightAction = {
  type: "highlight" | "unhighlight";
  category: CategoryId;
};

const hoverReducer = (
  state: Record<string, boolean>,
  action: HighlightAction,
) => {
  switch (action.type) {
    case "highlight":
      return { ...state, [action.category]: true };
    case "unhighlight":
      return { ...state, [action.category]: false };
    default:
      throw new Error();
  }
};

// We want to have separators in between the categories, but not at the end.
// We use a fragment to create one mixed list of separators and categories.
// This causes key errors, so we use a wrapper element.
const CategorySegmentItem: FC<{
  category: CategoryProps;
  isFirst: boolean;
  isLast: boolean;
}> = ({ isLast, category, isFirst }) => (
  <>
    <CategorySegment
      rounded={isFirst ? "left" : undefined}
      {...category}
    />
    {!isLast && <div className="z-10 w-0.5 h-2 bg-slateus-500"></div>}
  </>
);

type Props = {
  onClickTimeFrame: OnClick;
  timeFrame: TimeFrame;
};

const BurnCategoryWidget: FC<Props> = ({ onClickTimeFrame, timeFrame }) => {
  const burnCategories = useBurnCategories();
  const leaderboard =
    useGroupedAnalysis1()?.leaderboards?.[
      leaderboardKeyFromTimeFrame[timeFrame]
    ];
  const burnSum = useBurnSums()[timeFrame];
  const [hoverState, dispatchHover] = useReducer(hoverReducer, initialState);
  const { showCategoryCounts } = useContext(FeatureFlagsContext);

  const sortByFeesDesc = pipe(
    N.Ord,
    OrdM.reverse,
    OrdM.contramap((category: CategoryProps) => category.fees ?? 0),
  );

  const combinedCategoriesPerTimeFrame: Record<
    TimeFrame,
    O.Option<CategoryProps[]>
  > = useMemo(
    () =>
      pipe(
        timeFrames,
        RA.toArray,
        A.map((timeFrame) => {
          // We disable a few time frames which are waiting on backend fixes.
          // This could be done more cleanly. First gather time frame and data
          // pairs then map the one where data is not unavailable.
          if (["m5"].includes(timeFrame)) {
            return [timeFrame, O.none] as [
              TimeFrame,
              O.Option<CategoryProps[]>,
            ];
          }

          const categoryFromCategories = (
            category: BurnCategory,
          ): CategoryProps =>
            pipe({
              id: category.category,
              imgName: imgMap[category.category] ?? {
                coloron: questionMarkOwn as StaticImageData,
                coloroff: questionMarkSlateus as StaticImageData,
              },
              imgAlt:
                imgAltMap[category.category] ??
                "question mark signaling missing image",
              fees: category?.fees,
              feesUsd: category?.feesUsd,
              transactionCount: category?.transactionCount,
              percentOfTotalBurn: category?.percentOfTotalBurn,
              percentOfTotalBurnUsd: category?.percentOfTotalBurnUsd,
              onHoverCategory: (hovering: boolean) =>
                dispatchHover({
                  type: hovering ? "highlight" : "unhighlight",
                  category: category.category,
                }),
              showHighlight: hoverState[category.category] ?? false,
            });

          const apiBurnCategories = pipe(
            burnCategories,
            O.fromNullable,
            O.chain(O.fromNullableK((categories) => categories[timeFrame])),
            O.map(A.map(categoryFromCategories)),
          );

          // ethTransfers is a special case that we hack on in the frontend.
          const ethTransfers = pipe(
            leaderboard,
            O.fromNullable,
            O.map(A.filter((entry) => entry.type === "eth-transfers")),
            O.chain(A.head),
            O.map(
              (transfers): CategoryProps => ({
                imgName: imgMap.transfers,
                id: "transfers",
                imgAlt: "missing icon for ETH transfer fees",
                fees: transfers.fees,
                feesUsd: transfers.feesUsd,
                transactionCount: undefined,
                percentOfTotalBurn: transfers.fees / burnSum.sum.eth / 1e18,
                percentOfTotalBurnUsd: transfers.feesUsd / burnSum.sum.usd,
                onHoverCategory: (hovering) =>
                  dispatchHover({
                    type: hovering ? "highlight" : "unhighlight",
                    category: "transfers",
                  }),
                showHighlight: hoverState["transfers"] ?? false,
              }),
            ),
          );

          // contractCreations is a special case that we hack on in the frontend.
          const contractDeployments = pipe(
            leaderboard,
            O.fromNullable,
            O.map(A.filter((entry) => entry.type === "contract-creations")),
            O.chain(A.head),
            O.map(
              (transfers): CategoryProps => ({
                imgName: imgMap.creations,
                id: "creations",
                imgAlt: "missing icon for contract creation fees",
                fees: transfers.fees,
                feesUsd: transfers.feesUsd,
                transactionCount: undefined,
                percentOfTotalBurn: transfers.fees / burnSum.sum.eth / 1e18,
                percentOfTotalBurnUsd: transfers.feesUsd / burnSum.sum.usd,
                onHoverCategory: (hovering) =>
                  dispatchHover({
                    type: hovering ? "highlight" : "unhighlight",
                    category: "creations",
                  }),
                showHighlight: hoverState["creations"] ?? false,
              }),
            ),
          );

          const miscCategory = pipe(
            burnCategories,
            O.fromNullable,
            O.map((categories) =>
              buildMiscCategory(
                categories[timeFrame],
                activeCategories,
                (hovering) =>
                  dispatchHover({
                    type: hovering ? "highlight" : "unhighlight",
                    category: "misc",
                  }),
                hoverState["misc"] ?? false,
              ),
            ),
          );

          const combinedCategories = pipe(
            OAlt.sequenceTuple(apiBurnCategories, ethTransfers, contractDeployments, miscCategory),
            O.map(([apiCategories, ethTransfers, contractDeployments, miscCategory]) =>
              pipe(
                apiCategories,
                A.filter((category) => activeCategories.includes(category.id)),
                (categories) => [...categories, ethTransfers, contractDeployments, miscCategory],
                A.sort(sortByFeesDesc),
              ),
            ),
          );

          return [timeFrame, combinedCategories] as [
            TimeFrame,
            O.Option<CategoryProps[]>,
          ];
        }),
        Record.fromEntries,
      ),
    [
      burnCategories,
      burnSum.sum.eth,
      burnSum.sum.usd,
      hoverState,
      leaderboard,
      sortByFeesDesc,
    ],
  );

  return (
    <BurnGroupBase
      backgroundClassName="h-[508px]"
      onClickTimeFrame={onClickTimeFrame}
      title="burn categories"
      timeFrame={timeFrame}
    >
      {pipe(
        combinedCategoriesPerTimeFrame[timeFrame],
        O.match(
          () => (
            <div
              className={`
                flex h-[394px] w-full items-center justify-center
                text-center text-lg text-slateus-200
              `}
            >
              time frame unavailable
            </div>
          ),
          (categories) => (
            <>
              <div>
                <div className={`relative flex items-center py-4`}>
                  <div className="absolute w-full h-2 rounded-full color-animation bg-slateus-600"></div>
                  <div className="flex top-0 left-0 z-10 flex-row items-center w-full">
                    {categories.map((category, index) => {
                      return (
                        <CategorySegmentItem
                          key={category.id}
                          isFirst={index === 0}
                          isLast={index === categories.length - 1}
                          category={category}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className={`flex flex-col gap-y-4`}>
                <div
                  className={`grid items-center ${
                    showCategoryCounts ? "md:grid-cols-3" : "grid-cols-2"
                  }`}
                >
                  <LabelText>category</LabelText>
                  <div
                    className={`
                      text-right
                      ${showCategoryCounts ? "col-span-1" : "col-span-1"}
                      ${showCategoryCounts ? "md:mr-8" : ""}
                    `}
                  >
                    <LabelText>burn</LabelText>
                  </div>
                  <LabelText
                    className={`hidden text-right ${
                      showCategoryCounts ? "md:block" : ""
                    }`}
                  >
                    transactions
                  </LabelText>
                </div>
                {categories.map((category) => (
                  <CategoryRow
                    key={category.id}
                    amountFormatted={formatFees(category.fees)}
                    id={category.id}
                    countFormatted={formatCount(category.transactionCount)}
                    hovering={hoverState[category.id] ?? false}
                    name={categoryDisplayMap[category.id]}
                    setHovering={dispatchHover}
                    showCategoryCounts={showCategoryCounts}
                  />
                ))}
              </div>
            </>
          ),
        ),
      )}
    </BurnGroupBase>
  );
};

export default BurnCategoryWidget;
