import type { FC } from "react";
import { useContext, useState } from "react";
import Skeleton from "react-loading-skeleton";
import type { BurnCategory } from "../api/burn-categories";
import { useBurnCategories } from "../api/burn-categories";
import Colors from "../colors";
import { FeatureFlagsContext } from "../feature-flags";
import * as Format from "../format";
import { A, flow, NEA, O, pipe } from "../fp";
import type { TimeFrameNext } from "../time-frames";
import { MoneyAmount } from "./Amount";
import { BodyText, LabelText, TextRoboto } from "./Texts";
import { BurnGroupBase, WidgetTitle } from "./WidgetSubcomponents";

type CategoryProps = {
  fees: number | undefined;
  feesUsd: number | undefined;
  transactionCount: number | undefined;
  percentOfTotalBurn: number | undefined;
  percentOfTotalBurnUsd: number | undefined;
  imgAlt: string;
  imgName: string;
  onHoverCategory: (hovering: boolean) => void;
  showHighlight: boolean;
};

type CategoryBarProps = {
  nft: CategoryProps | undefined;
  defi: CategoryProps | undefined;
  mev: CategoryProps | undefined;
  l2: CategoryProps | undefined;
  misc: CategoryProps | undefined;
};

type CategorySegmentProps = {
  imgAlt: string;
  imgName: string;
  onHoverCategory: (hovering: boolean) => void;
  percentOfTotalBurn: number | undefined;
  rounded?: "left" | "right";
  showHighlight: boolean;
};

const alwaysShowImgPercentThreshold = 0.08;
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
      width: `${(percentOfTotalBurn ?? skeletonLoadingWidth) * 100}%`,
    }}
    onMouseEnter={() => onHoverCategory(true)}
    onMouseLeave={() => onHoverCategory(false)}
  >
    {imgName === undefined ? (
      <Skeleton height="16px" width="1.4rem" className="mb-3" />
    ) : (
      <>
        <img
          className="relative w-6"
          src={`/${imgName}-coloroff.svg`}
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
        <img
          className="absolute w-6"
          src={`/${imgName}-coloron.svg`}
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
      </>
    )}
    <div
      className={`h-2 bg-blue-spindle w-full color-animation ${
        rounded === "left"
          ? "rounded-l-full"
          : rounded === "right"
          ? "rounded-r-full"
          : ""
      }`}
      style={{
        backgroundColor: showHighlight ? Colors.white : Colors.spindle,
      }}
    ></div>
    <div style={{ marginTop: "9px" }}>
      {percentOfTotalBurn === undefined ? (
        <Skeleton width="1.5rem" />
      ) : (
        <TextRoboto
          className={`color-animation ${
            !showHighlight && percentOfTotalBurn < alwaysShowImgPercentThreshold
              ? "invisible"
              : "visible"
          }`}
          style={{
            color: showHighlight ? Colors.white : Colors.spindle,
          }}
        >
          {Format.formatNoDecimals(
            (percentOfTotalBurn ?? skeletonLoadingWidth) * 100,
          )}
          %
        </TextRoboto>
      )}
    </div>
  </div>
);

const CategoryBar: FC<CategoryBarProps> = ({ nft, defi, mev, l2, misc }) => (
  <div className="relative flex py-4 items-center">
    <div className="absolute w-full h-2 bg-blue-highlightbg rounded-full color-animation"></div>
    <div className="w-full flex flex-row top-0 left-0 items-center z-10">
      {nft && (
        <CategorySegment
          imgAlt={nft.imgAlt}
          imgName={nft.imgName}
          onHoverCategory={nft.onHoverCategory}
          percentOfTotalBurn={nft.percentOfTotalBurn}
          rounded="left"
          showHighlight={nft.showHighlight}
        />
      )}
      <div className="h-2 bg-blue-dusk w-0.5"></div>
      {defi && (
        <CategorySegment
          imgAlt={defi.imgAlt}
          imgName={defi.imgName}
          onHoverCategory={defi.onHoverCategory}
          percentOfTotalBurn={defi.percentOfTotalBurn}
          showHighlight={defi.showHighlight}
        />
      )}
      <div className="h-2 bg-blue-dusk w-0.5"></div>
      {mev && (
        <CategorySegment
          imgAlt={mev.imgAlt}
          imgName={mev.imgName}
          onHoverCategory={mev.onHoverCategory}
          percentOfTotalBurn={mev.percentOfTotalBurn}
          showHighlight={mev.showHighlight}
        />
      )}
      <div className="h-2 bg-blue-dusk w-0.5"></div>
      {l2 && (
        <CategorySegment
          imgAlt={l2.imgAlt}
          imgName={l2.imgName}
          onHoverCategory={l2.onHoverCategory}
          percentOfTotalBurn={l2.percentOfTotalBurn}
          showHighlight={l2.showHighlight}
        />
      )}
      <div className="h-2 bg-blue-dusk w-0.5"></div>
      {misc && (
        <CategorySegment
          imgAlt={misc.imgAlt}
          imgName={misc.imgName}
          onHoverCategory={misc.onHoverCategory}
          percentOfTotalBurn={misc.percentOfTotalBurn}
          rounded="right"
          showHighlight={misc.showHighlight}
        />
      )}
    </div>
  </div>
);

type CategoryRowProps = {
  amountFormatted: string | undefined;
  countFormatted: string | undefined;
  hovering: boolean;
  link?: string;
  name: string;
  setHovering: (hovering: boolean) => void;
  showCategoryCounts: boolean;
};

const CategoryRow: FC<CategoryRowProps> = ({
  amountFormatted,
  countFormatted,
  hovering,
  name,
  setHovering,
  showCategoryCounts = false,
}) => (
  <div
    className={`
      grid grid-cols-2 ${showCategoryCounts ? "md:grid-cols-3" : ""}
    `}
    onMouseEnter={() => setHovering(true)}
    onMouseLeave={() => setHovering(false)}
    style={{ opacity: hovering ? 0.6 : 1 }}
  >
    <BodyText>{name}</BodyText>
    <div
      className={`
        text-right
        col-span-1 md:col-span-1
        ${showCategoryCounts ? "md:mr-8" : ""}
      `}
    >
      {amountFormatted === undefined ? (
        <Skeleton width="4rem" />
      ) : (
        <MoneyAmount>{amountFormatted}</MoneyAmount>
      )}
    </div>
    <div
      className={`
        text-right
        hidden ${showCategoryCounts ? "md:block" : ""}
      `}
    >
      {countFormatted === undefined ? (
        <Skeleton width="5rem" />
      ) : (
        <TextRoboto className="text-right">{countFormatted}</TextRoboto>
      )}
    </div>
  </div>
);

const formatFees = flow(
  (num: number | undefined) => O.fromNullable(num),
  O.map(Format.ethFromWei),
  O.map((num) => Format.formatZeroDecimals(num)),
  O.toUndefined,
);

const formatCount = flow(
  (count: number | undefined) => O.fromNullable(count),
  O.map((num) => num / 10 ** 3),
  O.map((num) => Format.formatOneDecimal(num) + "K"),
  O.toUndefined,
);

const buildMiscCategory = (
  burnCategories: BurnCategory[],
  setHoveringMisc: (bool: boolean) => void,
  hoveringMisc: boolean,
) =>
  pipe(
    NEA.fromArray(burnCategories),
    O.map(
      A.reduce({} as CategoryProps, (sumCategory, category) => ({
        imgName: "misc",
        imgAlt:
          "three dots, signaling the summing of other contracts that have been categorized",
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
      })),
    ),
    O.getOrElse(
      (): CategoryProps => ({
        imgName: "misc",
        imgAlt:
          "three dots, signaling the summing of other contracts that have been categorized",
        fees: undefined,
        feesUsd: undefined,
        transactionCount: undefined,
        percentOfTotalBurn: undefined,
        percentOfTotalBurnUsd: undefined,
        onHoverCategory: setHoveringMisc,
        showHighlight: hoveringMisc,
      }),
    ),
  );

type Props = {
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
};

const BurnCategoryWidget: FC<Props> = ({ onClickTimeFrame, timeFrame }) => {
  const burnCategories = useBurnCategories();
  const [hoveringNft, setHoveringNft] = useState(false);
  const [hoveringDefi, setHoveringDefi] = useState(false);
  const [hoveringMev, setHoveringMev] = useState(false);
  const [hoveringL2, setHoveringL2] = useState(false);
  const [hoveringMisc, setHoveringMisc] = useState(false);
  const { showCategoryCounts } = useContext(FeatureFlagsContext);

  const selectedBurnCategories =
    // TODO: our old API returned an array, this element is not visible yet, but trying to access an array like an object does crash the full page, therefore we have this check to make sure not to crash, and can remove it once the new API is deployed in production.
    burnCategories === undefined || Array.isArray(burnCategories)
      ? undefined
      : burnCategories[timeFrame];

  const nft = selectedBurnCategories?.find(
    ({ category }) => category === "nft",
  );
  const defi = selectedBurnCategories?.find(
    ({ category }) => category === "defi",
  );
  const mev = selectedBurnCategories?.find(
    ({ category }) => category === "mev",
  );
  const l2 = selectedBurnCategories?.find(({ category }) => category === "l2");
  const misc = pipe(
    selectedBurnCategories?.filter(
      (category) => !["nft", "defi", "mev", "l2"].includes(category.category),
    ),
    O.fromNullable,
    O.map((categories) =>
      buildMiscCategory(categories, setHoveringMisc, hoveringMisc),
    ),
    O.toUndefined,
  );

  const burnCategoryParts = {
    nft: {
      imgName: "nft",
      imgAlt: "icon of a wooden painters palette, signaling NFTs",
      fees: nft?.fees,
      feesUsd: nft?.feesUsd,
      transactionCount: nft?.transactionCount,
      percentOfTotalBurn: nft?.percentOfTotalBurn,
      percentOfTotalBurnUsd: nft?.percentOfTotalBurnUsd,
      onHoverCategory: setHoveringNft,
      showHighlight: hoveringNft,
    },
    defi: {
      imgName: "defi",
      imgAlt: "an image of flying money, signaling DeFi",
      fees: defi?.fees,
      feesUsd: defi?.feesUsd,
      transactionCount: defi?.transactionCount,
      percentOfTotalBurn: defi?.percentOfTotalBurn,
      percentOfTotalBurnUsd: defi?.percentOfTotalBurnUsd,
      onHoverCategory: setHoveringDefi,
      showHighlight: hoveringDefi,
    },
    mev: {
      imgName: "mev",
      imgAlt: "a robot, signaling bots extracting miner-extractable-value",
      fees: mev?.fees,
      feesUsd: mev?.feesUsd,
      transactionCount: mev?.transactionCount,
      percentOfTotalBurn: mev?.percentOfTotalBurn,
      percentOfTotalBurnUsd: mev?.percentOfTotalBurnUsd,
      onHoverCategory: setHoveringMev,
      showHighlight: hoveringMev,
    },
    l2: {
      imgName: "l2",
      imgAlt: "chains signaling layer-2 networks",
      fees: l2?.fees,
      feesUsd: l2?.feesUsd,
      transactionCount: l2?.transactionCount,
      percentOfTotalBurn: l2?.percentOfTotalBurn,
      percentOfTotalBurnUsd: l2?.percentOfTotalBurnUsd,
      onHoverCategory: setHoveringL2,
      showHighlight: hoveringL2,
    },
  };

  return (
    <BurnGroupBase
      onClickTimeFrame={onClickTimeFrame}
      title="burn categories"
      timeFrame={timeFrame}
    >
      <div className="relative">
        <div
          className={`
          absolute
          text-blue-spindle text-lg text-center
          left-0 top-0 w-full h-full
          flex justify-center items-center
          ${timeFrame === "m5" ? "visible" : "hidden"}
        `}
        >
          5 minute time frame unavailable
        </div>
        <div className={`${timeFrame === "m5" ? "opacity-0" : "visible"}`}>
          <CategoryBar
            nft={burnCategoryParts?.nft}
            defi={burnCategoryParts?.defi}
            mev={burnCategoryParts?.mev}
            l2={burnCategoryParts?.l2}
            misc={misc}
          />
          <div className="flex flex-col gap-y-3">
            <div
              className={`grid ${
                showCategoryCounts ? "md:grid-cols-3" : "grid-cols-2"
              }`}
            >
              <WidgetTitle>category</WidgetTitle>
              <div
                className={`
                  text-right
                  ${showCategoryCounts ? "col-span-1" : "col-span-1"}
                  ${showCategoryCounts ? "md:mr-8" : ""}
                `}
              >
                <WidgetTitle>burn</WidgetTitle>
              </div>
              <LabelText
                className={`text-right hidden ${
                  showCategoryCounts ? "md:block" : ""
                }`}
              >
                transactions
              </LabelText>
            </div>
            {
              <>
                <CategoryRow
                  amountFormatted={formatFees(burnCategoryParts?.nft.fees)}
                  countFormatted={formatCount(
                    burnCategoryParts?.nft.transactionCount,
                  )}
                  hovering={hoveringNft}
                  name="NFT"
                  setHovering={setHoveringNft}
                  showCategoryCounts={showCategoryCounts}
                />
                <CategoryRow
                  amountFormatted={formatFees(burnCategoryParts?.defi.fees)}
                  countFormatted={formatCount(
                    burnCategoryParts?.defi.transactionCount,
                  )}
                  hovering={hoveringDefi}
                  name="defi"
                  setHovering={setHoveringDefi}
                  showCategoryCounts={showCategoryCounts}
                />
                <CategoryRow
                  amountFormatted={formatFees(burnCategoryParts?.mev.fees)}
                  countFormatted={formatCount(
                    burnCategoryParts?.mev.transactionCount,
                  )}
                  hovering={hoveringMev}
                  name="MEV"
                  setHovering={setHoveringMev}
                  showCategoryCounts={showCategoryCounts}
                />
                <CategoryRow
                  amountFormatted={formatFees(burnCategoryParts?.l2.fees)}
                  countFormatted={formatCount(
                    burnCategoryParts?.l2.transactionCount,
                  )}
                  hovering={hoveringL2}
                  name="L2"
                  setHovering={setHoveringL2}
                  showCategoryCounts={showCategoryCounts}
                />
                <CategoryRow
                  amountFormatted={formatFees(misc?.fees)}
                  countFormatted={formatCount(misc?.transactionCount)}
                  hovering={hoveringMisc}
                  name="misc"
                  setHovering={setHoveringMisc}
                  showCategoryCounts={showCategoryCounts}
                />
              </>
            }
          </div>
        </div>
      </div>
    </BurnGroupBase>
  );
};

export default BurnCategoryWidget;
