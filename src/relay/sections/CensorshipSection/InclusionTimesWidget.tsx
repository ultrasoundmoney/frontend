import type { FC, ReactNode } from "react";
import { useReducer } from "react";
import Skeleton from "react-loading-skeleton";
import type { TimeFrame } from "../../../mainsite/time-frames";
import type { StaticImageData } from "next/image";
import handOkOwnSvg from "../../../assets/hand-ok-own.svg";
import handPinchingSvg from "../../../assets/hand-pinching-own.svg";
import sneezingOwnSvg from "../../../assets/sneezing-own.svg";
import flagUsSvg from "../../../assets/flag-us-own.svg";
import flagUkSvg from "../../../assets/flag-uk-own.svg";
import colors from "../../../colors";
import { BaseText } from "../../../components/Texts";
import { formatZeroDecimals } from "../../../format";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import TimeFrameIndicator from "../../../mainsite/components/TimeFrameIndicator";
import WidgetErrorBoundary from "../../../components/WidgetErrorBoundary";
import LabelText from "../../../components/TextsNext/LabelText";
import Image from "next/image";
import QuantifyText from "../../../components/TextsNext/QuantifyText";

const categoryNames = [
  "optimal",
  "low_tip",
  "congestion",
  "us_sanctions",
  "uk_sanctions",
] as const;
type CategoryId = typeof categoryNames[number];

type StaticDetails = {
  imgAlt: string;
  imgSrc: StaticImageData;
};

const categoryIconMap: Record<CategoryId, StaticDetails> = {
  optimal: {
    imgAlt: "ok hand symbol symbolizing optimal inclusion time",
    imgSrc: handOkOwnSvg as StaticImageData,
  },
  low_tip: {
    imgAlt: "pinching hand symbol symbolizing low tip",
    imgSrc: handPinchingSvg as StaticImageData,
  },
  congestion: {
    imgAlt: "sneezing face symbolizing congestion of transactions",
    imgSrc: sneezingOwnSvg as StaticImageData,
  },
  us_sanctions: {
    imgAlt: "US flag symbolizing inclusion delay from US influence",
    imgSrc: flagUsSvg as StaticImageData,
  },
  uk_sanctions: {
    imgAlt: "UK flag symbolizing inclusion delay from UK influence",
    imgSrc: flagUkSvg as StaticImageData,
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
    className="flex select-none flex-col items-center"
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
    <div className="color-animation absolute h-2 w-full rounded-full bg-slateus-600"></div>
    <div className="top-0 left-0 z-10 flex w-full flex-row items-center">
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
            <div className="z-10 h-2 w-1 bg-slateus-500"></div>
          )}
        </>
      ))}
    </div>
  </div>
);

type InclusionTimeCategories = Record<"d1", InclusionTimeCategory[]>;

type Props = {
  inclusionTimeCategories: InclusionTimeCategories;
};

type InclusionTimeCategory = {
  averageInclusionTime: number;
  description?: string;
  id: CategoryId;
  name: string;
  transactionCount: number;
};

type CategoryHighlights = Record<CategoryId, boolean>;
const categoryHighlights: CategoryHighlights = {
  congestion: false,
  low_tip: false,
  optimal: false,
  uk_sanctions: false,
  us_sanctions: false,
};
type HighlightAction = {
  type: "highlight";
  id: CategoryId;
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

const inclusionTimeCategories: Props["inclusionTimeCategories"] = {
  d1: [
    {
      averageInclusionTime: 7,
      description: "next block",
      id: "optimal",
      name: "optimal",
      transactionCount: 908102,
    },
    {
      averageInclusionTime: 20,
      description: "blocks full",
      id: "congestion",
      name: "congestion",
      transactionCount: 1000,
    },
    {
      averageInclusionTime: 103,
      id: "low_tip",
      name: "low tip",
      transactionCount: 104,
    },
    {
      averageInclusionTime: 32,
      description: "OFAC",
      id: "us_sanctions",
      name: "US sanctions",
      transactionCount: 21,
    },
    {
      averageInclusionTime: 20,
      id: "uk_sanctions",
      name: "UK sanctions",
      transactionCount: 1,
    },
  ],
};

const WidgetBase: FC<{
  className?: string;
  children: ReactNode;
  onClickTimeFrame?: () => void;
  timeFrame: TimeFrame;
  title: string;
}> = ({ className = "", children, timeFrame, title, onClickTimeFrame }) => (
  <WidgetErrorBoundary title={title}>
    <WidgetBackground className={className}>
      <div className="flex items-baseline justify-between">
        <WidgetTitle>{title}</WidgetTitle>
        <TimeFrameIndicator
          onClickTimeFrame={onClickTimeFrame}
          timeFrame={timeFrame}
        />
      </div>
      {children}
    </WidgetBackground>
  </WidgetErrorBoundary>
);

const InclusionTimesWidget: FC = () => {
  const [highlights, dispatchHighlight] = useReducer(
    reducer,
    categoryHighlights,
  );

  const timeFrame: TimeFrame = "d1";
  const activeCategories = inclusionTimeCategories[timeFrame];

  return (
    <WidgetBase
      onClickTimeFrame={undefined}
      title="inclusion times"
      timeFrame={"d1"}
    >
      <CategoryBar
        className="my-4"
        categories={activeCategories.map((category) => ({
          highlight: highlights[category.id],
          imgAlt: categoryIconMap[category.id].imgAlt,
          imgSrc: categoryIconMap[category.id].imgSrc,
          name: category.name,
          description: category.description,
          percentage: category.averageInclusionTime / 60,
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
      <ul className="flex flex-col gap-y-4">
        <div className="grid grid-cols-4 gap-y-2">
          <LabelText className="col-span-2">category</LabelText>
          <LabelText className="text-right">average</LabelText>
          <LabelText className="text-right">txs</LabelText>
        </div>
        {activeCategories.map((category) => (
          <li
            className={`grid grid-cols-4 gap-y-2 ${
              highlights[category.id] ? "brightness-75" : ""
            }`}
            key={category.id}
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
            <div className="col-span-2 truncate">
              <BaseText className="" font="font-inter">
                {category.name}
              </BaseText>
              <BaseText
                className="hidden md:inline"
                font="font-inter"
                color="text-slateus-200"
              >
                {" "}
                {category.description}
              </BaseText>
            </div>
            <QuantifyText className="text-right">
              {category.averageInclusionTime}s
            </QuantifyText>
            <QuantifyText className="text-right">
              {formatZeroDecimals(category.transactionCount)}
            </QuantifyText>
          </li>
        ))}
      </ul>
    </WidgetBase>
  );
};

export default InclusionTimesWidget;
