import flow from "lodash/flow";
import type { FC } from "react";
import { useContext, useState } from "react";
import Skeleton from "react-loading-skeleton";
import type { BurnCategory } from "../api/burn-categories";
import { useBurnCategories } from "../api/burn-categories";
import Colors from "../../colors";
import { WEI_PER_ETH } from "../../eth-units";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import type { TimeFrame } from "../time-frames";
import { MoneyAmount } from "../components/Amount";
import { BaseText } from "../../components/Texts";
import BodyText from "../../components/TextsNext/BodyText";
import LabelText from "../../components/TextsNext/LabelText";
import { WidgetTitle } from "../../components/WidgetSubcomponents";
import BurnGroupBase from "./BurnGroupBase";

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
    className="flex select-none flex-col items-center"
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

const CategoryBar: FC<CategoryBarProps> = ({ nft, defi, mev, l2, misc }) => (
  <div className="relative flex items-center py-4">
    <div className="color-animation absolute h-2 w-full rounded-full bg-slateus-600"></div>
    <div className="top-0 left-0 z-10 flex w-full flex-row items-center">
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
      <div className="h-2 w-0.5 bg-slateus-500"></div>
      {defi && (
        <CategorySegment
          imgAlt={defi.imgAlt}
          imgName={defi.imgName}
          onHoverCategory={defi.onHoverCategory}
          percentOfTotalBurn={defi.percentOfTotalBurn}
          showHighlight={defi.showHighlight}
        />
      )}
      <div className="h-2 w-0.5 bg-slateus-500"></div>
      {mev && (
        <CategorySegment
          imgAlt={mev.imgAlt}
          imgName={mev.imgName}
          onHoverCategory={mev.onHoverCategory}
          percentOfTotalBurn={mev.percentOfTotalBurn}
          showHighlight={mev.showHighlight}
        />
      )}
      <div className="h-2 w-0.5 bg-slateus-500"></div>
      {l2 && (
        <CategorySegment
          imgAlt={l2.imgAlt}
          imgName={l2.imgName}
          onHoverCategory={l2.onHoverCategory}
          percentOfTotalBurn={l2.percentOfTotalBurn}
          showHighlight={l2.showHighlight}
        />
      )}
      <div className="h-2 w-0.5 bg-slateus-500"></div>
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
        col-span-1
        text-right md:col-span-1
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
    </div>
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
  setHoveringMisc: (bool: boolean) => void,
  hoveringMisc: boolean,
) =>
  burnCategories
    .filter(
      (category) => !["nft", "defi", "mev", "l2"].includes(category.category),
    )
    .reduce(
      (sumCategory, category) => ({
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
      }),
      {
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
      } as CategoryProps,
    );

type Props = {
  onClickTimeFrame: () => void;
  timeFrame: TimeFrame;
};

const BurnCategoryWidget: FC<Props> = ({ onClickTimeFrame, timeFrame }) => {
  const burnCategories = useBurnCategories();
  const [hoveringNft, setHoveringNft] = useState(false);
  const [hoveringDefi, setHoveringDefi] = useState(false);
  const [hoveringMev, setHoveringMev] = useState(false);
  const [hoveringL2, setHoveringL2] = useState(false);
  const [hoveringMisc, setHoveringMisc] = useState(false);
  const { showCategoryCounts } = useContext(FeatureFlagsContext);

  // TODO: Remove workaround when "since_merge" is added to the burnCategories
  const selectedBurnCategories =
    burnCategories?.[timeFrame == "since_merge" ? "since_burn" : timeFrame];

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
  const misc =
    selectedBurnCategories !== undefined
      ? buildMiscCategory(selectedBurnCategories, setHoveringMisc, hoveringMisc)
      : undefined;

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
      <div
        className={`${
          timeFrame === "m5" || timeFrame === "since_burn"
            ? "hidden"
            : "visible"
        }`}
      >
        <CategoryBar
          nft={burnCategoryParts?.nft}
          defi={burnCategoryParts?.defi}
          mev={burnCategoryParts?.mev}
          l2={burnCategoryParts?.l2}
          misc={misc}
        />
      </div>
      {timeFrame === "m5" ? (
        <div
          className={`
            flex min-h-[324px] w-full items-center justify-center
            text-center text-lg text-slateus-200
          `}
        >
          5 minute time frame unavailable
        </div>
      ) : timeFrame === "since_burn" ? (
        <div
          className={`
            flex min-h-[324px] w-full items-center justify-center
            text-center text-lg text-slateus-200
          `}
        >
          all time frame unavailable, data sync in progress...
        </div>
      ) : (
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
              className={`hidden text-right ${
                showCategoryCounts ? "md:block" : ""
              }`}
            >
              transactions
            </LabelText>
          </div>
          {
            <>
              <CategoryRow
                amountFormatted={formatFees(burnCategoryParts.nft.fees)}
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
      )}
    </BurnGroupBase>
  );
};

export default BurnCategoryWidget;
