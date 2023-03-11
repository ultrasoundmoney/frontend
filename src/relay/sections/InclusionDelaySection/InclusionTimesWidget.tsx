import type { FC } from "react";
import { useReducer } from "react";
import Skeleton from "react-loading-skeleton";
import type { TimeFrame } from "../../../mainsite/time-frames";
import type { StaticImageData } from "next/image";
import handOkOwnSvg from "../../../assets/hand-ok-own.svg";
import handPinchingSvg from "../../../assets/hand-pinching-own.svg";
import sneezingOwnSvg from "../../../assets/sneezing-own.svg";
import flagUsSvg from "../../../assets/flag-us-own.svg";
import flagUkSvg from "../../../assets/flag-uk-own.svg";
import handPinchedSvg from "../../../assets/hand-pinched-own.svg";
import questionMarkSvg from "../../../assets/question-mark-own.svg";
import sleuthSvg from "../../../assets/sleuth-own.svg";
import colors from "../../../colors";
import { BaseText } from "../../../components/Texts";
import {
  formatOneDecimal,
  formatTimeDistance,
  formatTimeDistanceToNow,
  formatZeroDecimals,
} from "../../../format";
import LabelText from "../../../components/TextsNext/LabelText";
import Image from "next/image";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import WidgetBase from "../../components/WidgetBase";

type StaticDetails = {
  imgAlt: string;
  imgSrc: StaticImageData;
};

const categoryIconMap: Record<Category, StaticDetails> = {
  borderline: {
    imgAlt: "question mark symbolizing missing icon",
    imgSrc: questionMarkSvg as StaticImageData,
  },
  congested: {
    imgAlt: "sneezing face symbolizing congestion of transactions",
    imgSrc: sneezingOwnSvg as StaticImageData,
  },
  likely_insufficient_balance: {
    imgAlt: "question mark symbolizing missing icon",
    imgSrc: questionMarkSvg as StaticImageData,
  },
  low_base_fee: {
    imgAlt: "pinching hand symbolizing low base fee",
    imgSrc: handPinchedSvg as StaticImageData,
  },
  low_tip: {
    imgAlt: "pinched hand symbol symbolizing low tip",
    imgSrc: handPinchingSvg as StaticImageData,
  },
  miner: {
    imgAlt: "sleuth or spy symbolizing private transactions",
    imgSrc: sleuthSvg as StaticImageData,
  },
  optimal: {
    imgAlt: "ok hand symbol symbolizing optimal inclusion time",
    imgSrc: handOkOwnSvg as StaticImageData,
  },
  sanctions_uk: {
    imgAlt: "UK flag symbolizing inclusion delay from UK influence",
    imgSrc: flagUkSvg as StaticImageData,
  },
  ofac_delayed: {
    imgAlt: "US flag symbolizing inclusion delay from US influence",
    imgSrc: flagUsSvg as StaticImageData,
  },
  unknown: {
    imgAlt: "question mark symbolizing unknown inclusion delay",
    imgSrc: questionMarkSvg as StaticImageData,
  },
};

type CategorySegmentProps = {
  highlight: boolean;
  imgAlt: string;
  imgSrc: StaticImageData;
  name: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  percentage: number | undefined;
  rounded?: "left" | "right";
};

const alwaysShowImgPercentThreshold = 0.08;
const separatorWidth = 1;
const separatorCount = 4;

const CategorySegment: FC<CategorySegmentProps> = ({
  imgAlt,
  imgSrc,
  onMouseEnter,
  onMouseLeave,
  percentage: percentage,
  rounded,
  highlight,
}) => (
  <div
    className="flex flex-col items-center select-none"
    style={{
      width: `calc(${(percentage ?? 0.1) * 100}% - ${
        separatorWidth * separatorCount
      }px)`,
    }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <>
      <Image
        className="relative w-6"
        src={imgSrc}
        alt={imgAlt}
        style={{
          height: "21px",
          marginBottom: "12px",
          visibility:
            percentage === undefined
              ? "hidden"
              : percentage < alwaysShowImgPercentThreshold
              ? "hidden"
              : "visible",
        }}
      />
      <Image
        className="absolute w-6"
        src={imgSrc}
        alt="colored ice crystal, signifying staked ETH"
        style={{
          height: "21px",
          marginBottom: "12px",
          visibility:
            percentage === undefined
              ? "hidden"
              : highlight
              ? "visible"
              : "hidden",
        }}
      />
    </>
    <div
      className={`color-animation h-2 w-full bg-slateus-200 ${
        rounded === "left"
          ? "rounded-l-full"
          : rounded === "right"
          ? "rounded-r-full"
          : ""
      }`}
      style={{
        backgroundColor: highlight ? colors.white : colors.slateus200,
      }}
    ></div>
    <div style={{ marginTop: "9px" }}>
      {percentage === undefined ? (
        <Skeleton width="1.5rem" />
      ) : (
        <BaseText
          font="font-roboto"
          className={`color-animation ${
            !highlight && percentage < alwaysShowImgPercentThreshold
              ? "invisible"
              : "visible"
          }`}
          style={{
            color: highlight ? colors.white : colors.slateus200,
          }}
        >
          {formatZeroDecimals((percentage ?? 0.1) * 100)}%
        </BaseText>
      )}
    </div>
  </div>
);

const CategoryBar: FC<{
  categories: CategorySegmentProps[];
  className?: string;
}> = ({ categories, className = "" }) => (
  <div className={`${className} relative flex items-center py-4`}>
    <div className="absolute w-full h-2 rounded-full color-animation bg-slateus-600"></div>
    <div className="flex top-0 left-0 z-10 flex-row items-center w-full">
      {categories.map((category, index) => (
        <>
          <CategorySegment
            key={category.name}
            rounded={
              index === 0
                ? "left"
                : index === categories.length - 1
                ? "right"
                : undefined
            }
            {...category}
          />
          {index !== categories.length - 1 && (
            <div
              className="z-10 w-1 h-2 bg-slateus-500"
              key={`separator-${index}`}
            ></div>
          )}
        </>
      ))}
    </div>
  </div>
);

type CategoryHighlights = Record<Category, boolean>;
const categoryHighlights: CategoryHighlights = {
  borderline: false,
  congested: false,
  likely_insufficient_balance: false,
  low_base_fee: false,
  low_tip: false,
  miner: false,
  ofac_delayed: false,
  optimal: false,
  sanctions_uk: false,
  unknown: false,
};
type HighlightAction = {
  type: "highlight";
  id: Category;
  highlight: boolean;
};
const reducer = (state: CategoryHighlights, action: HighlightAction) => {
  switch (action.type) {
    case "highlight":
      return { ...state, [action.id]: action.highlight };
    default:
      throw new Error("Invalid action type");
  }
};

export type Category =
  | "borderline"
  | "congested"
  | "likely_insufficient_balance"
  | "low_base_fee"
  | "low_tip"
  | "miner"
  | "ofac_delayed"
  | "optimal"
  | "sanctions_uk"
  | "unknown";

export type InclusionTime = {
  average_time: number;
  description?: string;
  id: Category;
  name: string;
  percent: number;
  transaction_count: number;
};

type Props = {
  inclusionTimes: InclusionTime[];
  timeFrame: TimeFrame;
};

const InclusionTimesWidget: FC<Props> = ({ inclusionTimes, timeFrame }) => {
  const [highlights, dispatchHighlight] = useReducer(
    reducer,
    categoryHighlights,
  );

  return (
    <WidgetBase
      onClickTimeFrame={undefined}
      title="inclusion times"
      timeFrame={timeFrame}
    >
      <CategoryBar
        className="my-4"
        categories={inclusionTimes.map((category) => ({
          highlight: highlights[category.id],
          imgAlt: categoryIconMap[category.id].imgAlt,
          imgSrc: categoryIconMap[category.id].imgSrc,
          name: category.id,
          description: category.description,
          percentage: category.percent,
          onMouseEnter: () => {
            dispatchHighlight({
              type: "highlight",
              id: category.id,
              highlight: true,
            });
          },
          onMouseLeave: () => {
            dispatchHighlight({
              type: "highlight",
              id: category.id,
              highlight: false,
            });
          },
        }))}
      />
      <table className="w-full border-separate table-auto border-spacing-y-4">
        <thead>
          <tr>
            <th className="text-left">
              <LabelText>category</LabelText>
            </th>
            <th className="text-right">
              <LabelText>average</LabelText>
            </th>
            <th className="text-right">
              <LabelText>txs</LabelText>
            </th>
          </tr>
        </thead>
        <tbody>
          {inclusionTimes.map((category) => (
            <tr
              key={category.id}
              className={`${highlights[category.id] ? "brightness-75" : ""}`}
              onMouseEnter={() => {
                dispatchHighlight({
                  type: "highlight",
                  id: category.id,
                  highlight: true,
                });
              }}
              onMouseLeave={() => {
                dispatchHighlight({
                  type: "highlight",
                  id: category.id,
                  highlight: false,
                });
              }}
            >
              <td className="p-0 text-left">
                <div className="leading-none truncate">
                  <BaseText
                    className=""
                    font="font-inter"
                    size="text-sm md:text-base"
                  >
                    {category.name}
                  </BaseText>
                  <BaseText
                    className="hidden md:inline"
                    font="font-inter"
                    color="text-slateus-200"
                    size="text-sm md:text-base"
                  >
                    {" "}
                    {category.description}
                  </BaseText>
                </div>
              </td>
              <td className="p-0 text-right">
                <QuantifyText
                  className="box-content text-right overflow-none -py-1"
                  size="text-sm md:text-base"
                >
                  {category.transaction_count === 0
                    ? "-"
                    : `${formatTimeDistance(category.average_time)}`}
                </QuantifyText>
              </td>
              <td className="p-0 text-right">
                <QuantifyText
                  className="box-content text-right overflow-none -py-1"
                  size="text-sm md:text-base"
                >
                  {formatZeroDecimals(category.transaction_count)}
                </QuantifyText>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </WidgetBase>
  );
};

export default InclusionTimesWidget;
